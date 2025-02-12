import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { join } from 'path'

export function middleware(request: NextRequest) {
  // Handle CORS
  const response = request.method === 'OPTIONS'
    ? new NextResponse(null, { status: 200 })
    : NextResponse.next();
  
  // Allow requests from your frontend domain
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

  // Handle /uploads/* paths
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    // Remove /uploads from the path to match the public directory structure
    const filePath = request.nextUrl.pathname.replace('/uploads/', '')
    return NextResponse.rewrite(new URL(`/public/uploads/${filePath}`, request.url))
  }
 
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/uploads/:path*'
  ],
}
