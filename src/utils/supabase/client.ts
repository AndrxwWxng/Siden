import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config'

export const createClient = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  
  if (isBrowser) {
    // Browser environment - use browser client with cookie handling
    const supabase = createBrowserClient(
      supabaseConfig.url,
      supabaseConfig.anonKey,
      {
        cookies: {
          get(name) {
            return document.cookie
              .split('; ')
              .find((row) => row.startsWith(`${name}=`))
              ?.split('=')[1]
          },
          set(name, value, options) {
            let cookie = `${name}=${value}`
            if (options?.expires) {
              cookie += `; expires=${options.expires.toUTCString()}`
            }
            if (options?.path) {
              cookie += `; path=${options.path}`
            }
            document.cookie = cookie
          },
          remove(name, options) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${
              options?.path ? `path=${options.path}` : ''
            }`
          },
        },
      }
    )
    return supabase
  } else {
    // Node.js environment - use regular client without cookie handling
    // This is used for scripts, tests, and other non-browser environments
    return createSupabaseClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    )
  }
}
