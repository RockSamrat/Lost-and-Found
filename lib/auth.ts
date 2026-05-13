import 'server-only';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true },
  });

  return user;
}
