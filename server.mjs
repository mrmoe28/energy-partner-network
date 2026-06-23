import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import { Pool } from 'pg';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = process.env.STATIC_ROOT || join(__dirname, 'dist');

const port = Number(process.env.PORT || 3000);
const sessionCookieName = 'epn_session';
const sessionSecret = process.env.SESSION_SECRET || 'dev-session-secret-change-me';
const sessionTtlMs = 1000 * 60 * 60 * 24 * 7;
const adminEmail = String(
  process.env.ADMIN_EMAIL ||
    (process.env.ADMIN_USERNAME ? `${process.env.ADMIN_USERNAME}@local` : 'admin@local'),
).trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || process.env.BASIC_AUTH_PASSWORD || 'admin';
const adminDisplayName = process.env.ADMIN_NAME || 'Admin';
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.EKOBASE_DATABASE_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  'postgresql://postgres:postgres@127.0.0.1:54332/postgres';
const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 30_000,
});

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function sendText(res, statusCode, text, extraHeaders = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(text),
    ...extraHeaders,
  });
  res.end(text);
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function hashPassword(password, salt = randomBytes(16).toString('base64url')) {
  const hash = scryptSync(password, salt, 64).toString('base64url');
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, storedHash) {
  const parts = String(storedHash || '').split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, salt, hash] = parts;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'base64url');
  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}

function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', sessionSecret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifySessionToken(token) {
  const [body, signature] = String(token || '').split('.');
  if (!body || !signature) {
    return null;
  }

  const expectedSignature = createHmac('sha256', sessionSecret).update(body).digest('base64url');
  const signatureBuffer = Buffer.from(signature, 'base64url');
  const expectedBuffer = Buffer.from(expectedSignature, 'base64url');
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload || typeof payload !== 'object' || typeof payload.exp !== 'number') {
      return null;
    }

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function parseCookies(header) {
  return String(header || '')
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const separator = entry.indexOf('=');
      if (separator === -1) {
        return acc;
      }

      const key = entry.slice(0, separator).trim();
      const value = entry.slice(separator + 1).trim();
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/'];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.floor(options.maxAge)}`);
  }

  if (options.httpOnly !== false) {
    parts.push('HttpOnly');
  }

  parts.push(`SameSite=${options.sameSite || 'Lax'}`);

  if (options.secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  const payload = verifySessionToken(cookies[sessionCookieName]);
  if (!payload) {
    return null;
  }

  return {
    id: payload.id,
    email: payload.email,
    display_name: payload.display_name || null,
    role: payload.role,
  };
}

function setSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(sessionCookieName, token, {
      maxAge: sessionTtlMs / 1000,
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    }),
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(sessionCookieName, '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    }),
  );
}

function requireAuth(req, res, requiredRole = 'admin') {
  const session = getSessionFromRequest(req);
  if (!session) {
    sendJson(res, 401, { error: 'Please sign in to continue.' });
    return null;
  }

  if (requiredRole && session.role !== requiredRole) {
    sendJson(res, 403, { error: 'You do not have access to this area.' });
    return null;
  }

  return session;
}

function normalizeAssetPath(requestPath) {
  const sanitized = normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '');
  return sanitized.startsWith('/') ? sanitized.slice(1) : sanitized;
}

async function parseBody(req) {
  const chunks = [];
  let bytes = 0;

  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 1_000_000) {
      throw new Error('Request body too large.');
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON payload.');
  }
}

function getPublicSiteRoot() {
  if (existsSync(rootDir) && statSync(rootDir).isDirectory()) {
    return rootDir;
  }

  return join(__dirname, 'deploy-dist');
}

async function readStaticFile(pathname) {
  const siteRoot = getPublicSiteRoot();
  const cleanedPath = pathname === '/' ? '/index.html' : pathname;
  const assetPath = normalizeAssetPath(cleanedPath);
  const candidate = join(siteRoot, assetPath);

  if (!candidate.startsWith(siteRoot)) {
    return null;
  }

  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate;
  }

  return null;
}

async function serveStatic(req, res, pathname) {
  const candidate = await readStaticFile(pathname);
  const siteRoot = getPublicSiteRoot();
  const indexPath = join(siteRoot, 'index.html');
  const filePath = candidate || indexPath;

  if (!existsSync(filePath)) {
    sendText(res, 404, 'Not found');
    return;
  }

  const ext = extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': contentTypes[ext] || 'application/octet-stream',
  });
  createReadStream(filePath).pipe(res);
}

function validateLead(payload) {
  const fullName = String(payload.full_name || '').trim();
  const email = String(payload.email || '').trim();
  const partnerInterest = String(payload.partner_interest || '').trim();
  const company = payload.company ? String(payload.company).trim() : null;
  const phone = payload.phone ? String(payload.phone).trim() : null;
  const notes = payload.notes ? String(payload.notes).trim() : null;
  const sourcePage = payload.source_page ? String(payload.source_page).trim() : null;
  const leadSource = String(payload.lead_source || 'website').trim() || 'website';
  const consent = payload.consent !== false;

  if (!fullName || !email || !partnerInterest) {
    throw new Error('full_name, email, and partner_interest are required.');
  }

  return {
    full_name: fullName,
    email,
    company,
    phone,
    partner_interest: partnerInterest,
    notes,
    lead_source: leadSource,
    source_page: sourcePage,
    status: 'new',
    consent,
  };
}

function validateContact(payload) {
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const company = payload.company ? String(payload.company).trim() : null;
  const partnerType = String(payload.partner_type || '').trim();
  const message = String(payload.message || '').trim();

  if (!name || !email || !partnerType || !message) {
    throw new Error('name, email, partner_type, and message are required.');
  }

  return {
    name,
    email,
    company,
    partner_type: partnerType,
    message,
    status: 'new',
  };
}

async function handleLeadSignupPost(req, res) {
  const payload = await parseBody(req);
  const row = validateLead(payload);

  const query = `
    insert into public.lead_signups
      (full_name, email, company, phone, partner_interest, notes, lead_source, source_page, status, consent)
    values
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    returning *
  `;
  const values = [
    row.full_name,
    row.email,
    row.company,
    row.phone,
    row.partner_interest,
    row.notes,
    row.lead_source,
    row.source_page,
    row.status,
    row.consent,
  ];
  const { rows } = await pool.query(query, values);

  sendJson(res, 201, { ok: true, data: rows[0] });
}

async function handleContactPost(req, res) {
  const payload = await parseBody(req);
  const row = validateContact(payload);

  const query = `
    insert into public.contact_submissions
      (name, email, company, partner_type, message, status)
    values
      ($1, $2, $3, $4, $5, $6)
    returning *
  `;
  const values = [row.name, row.email, row.company, row.partner_type, row.message, row.status];
  const { rows } = await pool.query(query, values);

  sendJson(res, 201, { ok: true, data: rows[0] });
}

async function ensureAdminAccount() {
  const passwordHash = hashPassword(adminPassword);
  await pool.query(
    `
      insert into public.user_accounts (email, display_name, password_hash, role, is_active)
      values ($1, $2, $3, 'admin', true)
      on conflict (email)
      do update set
        display_name = excluded.display_name,
        password_hash = excluded.password_hash,
        role = 'admin',
        is_active = true,
        updated_at = timezone('utc'::text, now())
    `,
    [adminEmail, adminDisplayName, passwordHash],
  );
}

async function handleLoginPost(req, res) {
  const payload = await parseBody(req);
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');

  if (!email || !password) {
    sendJson(res, 400, { error: 'Email and password are required.' });
    return;
  }

  const { rows } = await pool.query(
    `
      select id, email, display_name, password_hash, role
      from public.user_accounts
      where lower(email) = $1 and is_active = true
      limit 1
    `,
    [email],
  );

  if (rows.length === 0 || !verifyPassword(password, rows[0].password_hash)) {
    sendJson(res, 401, { error: 'Invalid email or password.' });
    return;
  }

  await pool.query(
    `
      update public.user_accounts
      set last_login_at = timezone('utc'::text, now()),
          updated_at = timezone('utc'::text, now())
      where id = $1
    `,
    [rows[0].id],
  );

  const user = {
    id: rows[0].id,
    email: rows[0].email,
    display_name: rows[0].display_name,
    role: rows[0].role,
  };
  const token = signSession({
    ...user,
    exp: Date.now() + sessionTtlMs,
  });

  setSessionCookie(res, token);
  sendJson(res, 200, { ok: true, user });
}

async function handleLogoutPost(_req, res) {
  clearSessionCookie(res);
  sendJson(res, 200, { ok: true });
}

async function handleSessionGet(req, res) {
  const user = getSessionFromRequest(req);
  sendJson(res, 200, { authenticated: Boolean(user), user });
}

async function handleRead(req, res, tableName) {
  if (!requireAuth(req, res, 'admin')) {
    return;
  }

  const { rows } = await pool.query(`select * from public.${tableName} order by created_at desc`);
  sendJson(res, 200, rows);
}

await ensureAdminAccount();

const requestHandler = async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const { pathname } = url;

    if (pathname === '/api/health') {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/session') {
      await handleSessionGet(req, res);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/login') {
      await handleLoginPost(req, res);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/logout') {
      await handleLogoutPost(req, res);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/lead-signups') {
      await handleLeadSignupPost(req, res);
      return;
    }

    if (req.method === 'POST' && pathname === '/api/contact-submissions') {
      await handleContactPost(req, res);
      return;
    }

    if (req.method === 'GET' && pathname === '/api/lead-signups') {
      await handleRead(req, res, 'lead_signups');
      return;
    }

    if (req.method === 'GET' && pathname === '/api/contact-submissions') {
      await handleRead(req, res, 'contact_submissions');
      return;
    }

    if (pathname.startsWith('/admin') && !requireAuth(req, res, 'admin')) {
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendText(res, 405, 'Method not allowed');
      return;
    }

    await serveStatic(req, res, pathname);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Internal server error.',
    });
  }
};

const server = createServer((req, res) => {
  Promise.resolve(requestHandler(req, res)).catch((error) => {
    console.error(error);
    if (!res.headersSent) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Internal server error.',
      });
      return;
    }
    res.end();
  });
});

server.listen(port, () => {
  console.log(`Energy Partner Network server listening on http://0.0.0.0:${port}`);
  console.log(`Serving static assets from ${getPublicSiteRoot()}`);
});
