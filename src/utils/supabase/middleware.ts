import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseConfig } from './config'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        get(name) {
          try {
            return request.cookies.get(name)?.value
          } catch (error) {
            console.error('Error accessing cookie in middleware:', error)
            return undefined
          }
        },
        set(name, value, options) {
          try {
            // Set cookie on the response
            response.cookies.set({
              name,
              value,
              ...options,
              // Ensure cookies are secure, httpOnly, and have proper SameSite policy
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true,
              sameSite: 'lax',
              // Set max age to 7 days for longer sessions
              maxAge: 60 * 60 * 24 * 7,
            })
          } catch (error) {
            console.error('Error setting cookie in middleware:', error)
          }
        },
        remove(name, options) {
          try {
            // Delete cookie from the response
            response.cookies.delete({
              name,
              ...options,
            })
          } catch (error) {
            console.error('Error removing cookie in middleware:', error)
          }
        },
      },
    }
  )

  // This will refresh the session if it exists and store it in the response cookies
  try {
    await supabase.auth.getUser()
  } catch (error) {
    console.error('Error refreshing session in middleware:', error)
  }
  
  return response
}
