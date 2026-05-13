import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedRoutes = ['/map', '/my-posts'];
const authRoutes = ['/login', '/signup'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('session')?.value;
  const session = await decrypt(sessionCookie);

  // Redirect authenticated users away from login/signup
  if (authRoutes.some((r) => pathname.startsWith(r)) && session) {
    return NextResponse.redirect(new URL('/map', request.url));
  }

  // Redirect unauthenticated users to login
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/map/:path*', '/my-posts/:path*', '/login', '/signup'],
};
