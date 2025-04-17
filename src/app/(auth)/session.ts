import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function getSession() {
  // Create a supabase client with proper async cookie handling
  const supabase = await createClient()

  // Get the session with the client
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUserDetails() {
  const session = await getSession()
  if (!session) {
    return null
  }
  return session.user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect('/signin')
  }
  return session
}
