import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config'

export const createClient = () => {
  // Force disable Supabase if needed via env var
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_DISABLE === 'true') {
    console.warn('Supabase is disabled by environment variable');
    // Return a dummy client that won't throw errors
    return createDummyClient();
  }

  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  
  if (isBrowser) {
    try {
      // Browser environment - use browser client with cookie handling
      const supabase = createBrowserClient(
        supabaseConfig.url,
        supabaseConfig.anonKey,
        {
          cookies: {
            get(name) {
              try {
                return document.cookie
                  .split('; ')
                  .find((row) => row.startsWith(`${name}=`))
                  ?.split('=')[1]
              } catch (e) {
                console.error('Error getting cookie:', e);
                return undefined;
              }
            },
            set(name, value, options) {
              try {
                let cookie = `${name}=${value}`
                if (options?.expires) {
                  cookie += `; expires=${options.expires.toUTCString()}`
                }
                if (options?.path) {
                  cookie += `; path=${options.path}`
                }
                document.cookie = cookie
              } catch (e) {
                console.error('Error setting cookie:', e);
              }
            },
            remove(name, options) {
              try {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${
                  options?.path ? `path=${options.path}` : ''
                }`
              } catch (e) {
                console.error('Error removing cookie:', e);
              }
            },
          },
        }
      )
      return supabase
    } catch (error) {
      console.error('Error creating Supabase browser client:', error);
      return createDummyClient();
    }
  } else {
    try {
      // Node.js environment - use regular client without cookie handling
      // This is used for scripts, tests, and other non-browser environments
      return createSupabaseClient(
        supabaseConfig.url,
        supabaseConfig.anonKey
      )
    } catch (error) {
      console.error('Error creating Supabase Node.js client:', error);
      return createDummyClient();
    }
  }
}

// Create a dummy client that won't throw errors if Supabase is unavailable
function createDummyClient() {
  // Return a minimal implementation that won't throw errors
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        }),
        match: () => Promise.resolve({ data: null, error: null }),
        order: () => ({
          limit: () => Promise.resolve({ data: null, error: null })
        })
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
        match: () => Promise.resolve({ data: null, error: null })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
        match: () => Promise.resolve({ data: null, error: null })
      })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
}
