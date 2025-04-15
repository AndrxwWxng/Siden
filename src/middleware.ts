import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  try {
    // Handle session update first - this refreshes cookies, etc.
    const res = await updateSession(request);
    
    // For dashboard routes, verify authentication
    if (pathname.startsWith('/dashboard')) {
      try {
        // Create a Supabase client
        const supabase = await createClient();
        
        // Check if the user is authenticated - always use getUser not getSession
        const { data, error } = await supabase.auth.getUser();
        
        // If error or no user, redirect to login
        if (error || !data?.user) {
          const redirectUrl = new URL('/signin', request.url);
          // Add the original URL as ?next= so we can redirect after login
          redirectUrl.searchParams.set('next', pathname);
          return NextResponse.redirect(redirectUrl);
        }
      } catch (authError) {
        console.error('Auth error in middleware:', authError);
        // If there's an error verifying the user, redirect to login
        const redirectUrl = new URL('/signin', request.url);
        redirectUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }
    
    // For login/signup pages, redirect to dashboard if already logged in
    if (pathname === '/signin' || pathname === '/signup') {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();
        
        if (!error && data?.user) {
          // Get the "next" query parameter or default to dashboard
          const nextUrl = request.nextUrl.searchParams.get('next') || '/dashboard';
          return NextResponse.redirect(new URL(nextUrl, request.url));
        }
      } catch (authError) {
        console.error('Auth error in middleware:', authError);
        // If there's an error, just allow the user to view the signin/signup page
      }
    }
    
    return res;
  } catch (e) {
    // In case of error just continue without blocking the request
    console.error('Middleware error:', e);
    return NextResponse.next();
  }
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