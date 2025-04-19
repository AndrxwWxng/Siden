import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Set dynamic rendering for routes that use cookies
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Add dynamic rendering header for all dashboard routes to force dynamic rendering
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    response.headers.set('x-middleware-next-dynamic', '1');
    response.headers.set('x-middleware-cache', '0');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Special handling for Mastra API route
    if (request.nextUrl.pathname === '/api/mastra/generate') {
      // Handle preflight OPTIONS request for CORS
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
            'Access-Control-Max-Age': '86400',
          },
        });
      }
      
      // For POST requests to /api/mastra/generate, set appropriate headers and continue
      if (request.method === 'POST') {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        return response;
      }
    }
    
    // Handle preflight OPTIONS request for CORS (for other API routes)
    if (request.method === 'OPTIONS') {
      const corsResponse = new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
            ? 'https://siden.ai' 
            : 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      });
      return corsResponse;
    }

    // Add CORS headers for other API requests
    response.headers.set('Access-Control-Allow-Origin', 
      process.env.NODE_ENV === 'production' ? 'https://siden.ai' : 'http://localhost:3000');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: { path?: string }) {
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax',
            httpOnly: true,
          });
        },
        remove(name: string, options: { path?: string }) {
          response.cookies.delete({
            name,
            ...options,
            sameSite: 'lax',
            httpOnly: true,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  // If no session and trying to access protected routes
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    // In development mode, allow access to dashboard paths without authentication
    if (isDevelopment) {
      console.log('DEV MODE: Bypassing auth for dashboard route:', request.nextUrl.pathname);
      return response;
    }
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If session exists and trying to access auth routes
  if (session && (request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

// Configure the middleware to run on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}