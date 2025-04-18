import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')
    const next = requestUrl.searchParams.get('next') || '/dashboard'
    
    if (!token_hash && !code) {
      return NextResponse.redirect(new URL('/auth/auth-error?reason=missing_token', requestUrl.origin))
    }
    
    try {
      const supabase = await createClient()
      
      if (code) {
        // Handle OAuth code flow
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('Error exchanging code for session:', error.message)
          return NextResponse.redirect(new URL('/auth/auth-error?reason=code_exchange_failed', requestUrl.origin))
        }
        
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      } else if (token_hash && type) {
        // Handle password recovery specifically
        if (type === 'recovery') {
          const { error } = await supabase.auth.verifyOtp({
            type: 'recovery',
            token_hash,
          })

          if (error) {
            console.error('Error verifying recovery token:', error.message)
            return NextResponse.redirect(
              new URL(`/auth/auth-error?reason=recovery_failed&error=${encodeURIComponent(error.message)}`, 
              requestUrl.origin)
            )
          }
          
          return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin))
        }
        
        // Handle signup or email confirmation
        const { error } = await supabase.auth.verifyOtp({
          type: type as ('signup' | 'email' | 'recovery'),
          token_hash
        })
        
        if (error) {
          console.error('Error verifying OTP:', error.message)
          return NextResponse.redirect(new URL(`/auth/auth-error?reason=verification_failed&error=${encodeURIComponent(error.message)}`, requestUrl.origin))
        }
        
        return NextResponse.redirect(new URL(next, requestUrl.origin))
      }
      
      // Fallback for any other cases
      return NextResponse.redirect(new URL('/auth/auth-error?reason=unknown', requestUrl.origin))
    } catch (authError) {
      console.error('Error during authentication:', authError)
      return NextResponse.redirect(new URL('/auth/auth-error?reason=auth_error', requestUrl.origin))
    }
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(new URL('/auth/auth-error?reason=server_error', request.url))
  }
}
