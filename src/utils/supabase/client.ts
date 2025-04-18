import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  const supabase = createClientComponentClient(supabaseConfig);
  try {
    return supabase;
  } catch {
    return supabase;
  }
};
