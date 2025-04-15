import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getSession() {
  const cookieStore = cookies()
  const supabase = await createClient()
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
