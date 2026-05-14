import 'server-only';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

// Payload now includes name + email so getCurrentUser() needs no DB round-trip
export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  expiresAt: string;
}

export async function decrypt(token: string | undefined = ''): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Store a token issued by the API (token is already a signed JWT)
export async function createSession(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

// Return the decoded payload (for auth checks, user display)
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  return decrypt(token);
}

// Return the raw JWT string (for forwarding to the API as Bearer token)
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('session')?.value ?? null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
