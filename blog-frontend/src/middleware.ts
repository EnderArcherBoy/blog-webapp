import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only run on dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify role for specific routes
      const decoded = jwtDecode<{ role: string }>(token);
      const userRole = decoded.role;

      // Role-based access control
      if (pathname.startsWith('/dashboard/manage-users') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (pathname.startsWith('/dashboard') && !['admin', 'writer'].includes(userRole)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Token decode error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};