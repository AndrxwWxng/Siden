import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseConfig } from './config'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        async get(name) {
          try {
            const cookie = await cookieStore.get(name)
            return cookie?.value
          } catch (error) {
            // Handle potential errors from accessing cookies synchronously
            console.error('Error accessing cookie:', error)
            return undefined
          }
        },
        async set(name, value, options) {
          try {
            await cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        async remove(name, options) {
          try {
            await cookieStore.delete({ name, ...options })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        },
      },
    }
  )
}
