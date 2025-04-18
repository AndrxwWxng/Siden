import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseConfig } from './config'

export const createClient = () => {
  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        async get(name) {
          const cookieStore = await cookies()
          return cookieStore.get(name)?.value
        },
        async set(name, value, options) {
          const cookieStore = await cookies()
          cookieStore.set(name, value, {
            ...options,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        },
        async remove(name, options) {
          const cookieStore = await cookies()
          cookieStore.delete(name)
        },
      },
    }
  )
}
