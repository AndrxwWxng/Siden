import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This is the correct pattern for server components in Next.js App Router
  // We use an async function and await the auth check
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data, error } = await supabase.auth.getUser()
    
    // If no user found, redirect to signin page
    if (error || !data.user) {
      redirect('/signin')
    }
  } catch (error) {
    console.error('Error in dashboard layout:', error)
    redirect('/signin')
  }
  
  return (
    <>
      {children}
    </>
  )
} 