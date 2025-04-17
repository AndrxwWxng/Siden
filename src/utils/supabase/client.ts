import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config'

export function createClient() {
  try {
    // Try the SSR approach first
    return createBrowserClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    )
  } catch (error) {
    console.log("Falling back to direct client creation");
    // Fall back to direct client creation if SSR approach fails
    return createSupabaseClient(
      supabaseConfig.url,
      supabaseConfig.anonKey
    )
  }
}
