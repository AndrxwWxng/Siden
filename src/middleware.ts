timport { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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