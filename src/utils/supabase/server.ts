import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseConfig } from './config'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set(name, value, {
            ...options,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        },
        remove(name, options) {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )
}
