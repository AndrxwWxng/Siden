// Supabase configuration from environment variables
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gufmvfkqeitarfsxmwfl.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Zm12ZmtxZWl0YXJmc3htd2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODU0MjAsImV4cCI6MjA2MDA2MTQyMH0.JIpI394wGk2ioKgeKOK3OgZGUeHJt1eWtLc3-OKg83k'
}
