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
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Set cookie on the response
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          // Delete cookie from the response
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getSession()

  return response
}
