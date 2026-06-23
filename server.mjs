import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = process.env.STATIC_ROOT || join(__dirname, 'dist');

const port = Number(process.env.PORT || 3000);
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.EKOBASE_DATABASE_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  'postgresql://postgres:postgres@127.0.0.1:54332/postgres';

const adminUser = process.env.ADMIN_USERNAME || process.env.BASIC_AUTH_USERNAME || 'admin';
const adminPass = process.env.ADMIN_PASSWORD || process.env.BASIC_AUTH_PASSWORD || 'admin';
const basicRealm = 'Energy Partner Network Admin';
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

function isAuthorized(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Basic ')) {
    return false;
  }

  const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
  const separator = decoded.indexOf(':');
  if (separator === -1) {
    return false;
  }

  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  return username === adminUser && password === adminPass;
}

function requireAuth(req, res) {
  if (isAuthorized(req)) {
    return true;
  }

  res.writeHead(401, {
    'WWW-Authenticate': `Basic realm="${basicRealm}", charset="UTF-8"`,
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify({ error: 'Authentication required.' }));
  return false;
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

async function handleRead(req, res, tableName) {
  if (!requireAuth(req, res)) {
    return;
  }

  const { rows } = await pool.query(`select * from public.${tableName} order by created_at desc`);
  sendJson(res, 200, rows);
}

const requestHandler = async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const { pathname } = url;

    if (pathname === '/api/health') {
      sendJson(res, 200, { ok: true });
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

    if (pathname.startsWith('/admin') && !requireAuth(req, res)) {
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
