import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET() {
  try {
    console.log('Testing Supabase connection from API route');
    
    // Log the Supabase configuration
    const supabase = createClient();
    console.log('Supabase client created');
    
    // Test table access
    console.log('Testing database table access...');
    const { data: tableData, error: tableError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('Projects table error:', tableError);
      // Try profiles table as fallback
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
        
      if (profileError) {
        console.error('Profiles table error:', profileError);
        return NextResponse.json({ 
          success: false, 
          message: 'Database tables inaccessible',
          projectsError: tableError.message,
          profilesError: profileError.message
        }, { status: 500 });
      }
      
      console.log('Profiles table accessible, but projects table error');
    }
    
    // Try to get the current user
    console.log('Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    // Return comprehensive status
    return NextResponse.json({
      success: true,
      message: 'Connection test completed',
      auth: {
        status: authError ? 'error' : (authData?.user ? 'authenticated' : 'unauthenticated'),
        error: authError ? authError.message : null,
        user: authData?.user ? { id: authData.user.id, email: authData.user.email } : null
      },
      database: {
        projects: tableError ? { error: tableError.message } : { accessible: true },
        profiles: tableData ? { accessible: true } : { error: 'Not tested' }
      }
    });
  } catch (error) {
    console.error('Unexpected error in test-connection:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Connection test failed with unexpected error',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 