import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseConfig } from './config'

export async function createClient() {
  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies()
          return Array.from(cookieStore.getAll()).map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        async setAll(cookiesList) {
          const cookieStore = await cookies()
          cookiesList.forEach(cookie => {
            cookieStore.set(cookie)
          })
        }
      },
    }
  )
}
