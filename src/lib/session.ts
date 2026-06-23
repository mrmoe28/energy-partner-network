export type SessionUser = {
  id: string;
  email: string;
  display_name: string | null;
  role: 'admin' | 'user';
};

export type SessionResponse = {
  authenticated: boolean;
  user: SessionUser | null;
};

async function readJsonError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error || 'Request failed.';
  } catch {
    return 'Request failed.';
  }
}

export async function fetchSession() {
  const response = await fetch('/api/session', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(await readJsonError(response));
  }

  return (await response.json()) as SessionResponse;
}

export async function loginWithEmail(email: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await readJsonError(response));
  }

  return (await response.json()) as { ok: true; user: SessionUser };
}

export async function logout() {
  const response = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(await readJsonError(response));
  }

  return (await response.json()) as { ok: true };
}
