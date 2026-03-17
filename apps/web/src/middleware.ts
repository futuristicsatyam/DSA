// apps/web/src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED = ['/dashboard', '/bookmarks', '/profile', '/progress'];
// Routes that should redirect authenticated users away (auth pages)
const AUTH_ONLY = ['/login', '/signup', '/forgot-password', '/reset-password'];
// Admin-only routes
const ADMIN_ONLY = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the refresh token cookie — its presence is a proxy for "logged in".
  // The actual access token lives in memory; we can't read it from middleware.
  const hasSession =
    request.cookies.has('refresh_token') ||
    request.cookies.has('refreshToken') ||
    request.cookies.has('rt'); // check all possible cookie names your API uses

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));
  const isAdmin = ADMIN_ONLY.some((p) => pathname.startsWith(p));

  // Not logged in → trying to access a protected page
  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Admin routes — we can only do a basic cookie check here;
  // the real RBAC check happens on the API. We'll do an extra client-side guard too.
  if (isAdmin && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Logged in → don't let them see /login or /signup
  if (isAuthOnly && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all pages except static assets and API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
