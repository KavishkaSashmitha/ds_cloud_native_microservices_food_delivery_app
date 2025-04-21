import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Check if the request is for a dashboard route
  if (pathname.startsWith('/dashboard')) {
    // If no token exists, redirect to login
    if (!token) {
      console.log('No token found in middleware, redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // If user is logged in and tries to access auth pages or home, redirect to dashboard
  // Note: We're doing basic redirection here as we can't determine user role in middleware
  // The AuthWrapper component will handle more specific redirection based on user role
  if ((pathname.startsWith('/auth') || pathname === '/') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware applies to
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/'],
};