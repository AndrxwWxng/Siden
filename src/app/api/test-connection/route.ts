import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET() {
  try {
    const supabase = createClient();
    console.log('Testing Supabase connection from API route');
    
    // Check database connection without requiring authentication
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed',
        error: error.message
      }, { status: 500 });
    }
    
    // Try to get user if authenticated
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      auth: authError ? 'unauthenticated' : 'authenticated',
      database: 'connected'
    });
  } catch (error) {
    console.error('Error testing connection:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Connection test failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 