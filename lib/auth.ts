import 'server-only';
import { getSession } from '@/lib/session';

// No DB call needed — name + email are embedded in the JWT by the API
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;
  return { id: session.userId, name: session.name, email: session.email };
}
