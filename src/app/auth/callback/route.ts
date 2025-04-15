import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    console.log('Auth callback URL:', requestUrl.toString())
    
    // Get token_hash and type from URL
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')
    const code = requestUrl.searchParams.get('code')
    
    console.log('Auth parameters:', { token_hash, type, code })
    
    if (!token_hash && !code) {
      console.error('No token_hash or code found in URL')
      return NextResponse.redirect(new URL('/auth/auth-error?reason=missing_token', requestUrl.origin))
    }
    
    const supabase = await createClient()
    
    if (code) {
      // Handle OAuth code flow
      console.log('Processing code-based authentication')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(new URL('/auth/auth-error?reason=code_exchange_failed', requestUrl.origin))
      }
      
      console.log('Code exchange successful, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    } else if (token_hash && type) {
      // Handle email confirmation
      console.log('Processing email confirmation with token_hash')
      const { error } = await supabase.auth.verifyOtp({
        type: type as any,
        token_hash
      })
      
      if (error) {
        console.error('Error verifying OTP:', error)
        return NextResponse.redirect(new URL(`/auth/auth-error?reason=verification_failed&error=${encodeURIComponent(error.message)}`, requestUrl.origin))
      }
      
      console.log('Email verification successful, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    }
    
    // Fallback for any other cases
    console.error('Unhandled authentication case')
    return NextResponse.redirect(new URL('/auth/auth-error?reason=unknown', requestUrl.origin))
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(new URL('/auth/auth-error?reason=server_error', request.url))
  }
}
