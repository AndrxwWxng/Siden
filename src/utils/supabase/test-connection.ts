/**
 * Utility to test Supabase connection
 */
import { createClient } from '@/utils/supabase/client';
import { supabaseConfig } from '@/utils/supabase/config';

// Function to test Supabase connection
export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log('Using Supabase URL:', supabaseConfig.url);
  
  try {
    const supabase = createClient();
    console.log('Supabase client created');
    
    // Test the auth service
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('Auth service test:', authError ? 'Failed' : 'Success');
    if (authError) {
      console.error('Auth error:', authError);
    }
    
    // Test connection to projects table
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('count(*)')
      .limit(1);
    
    console.log('Projects table test:', projectsError ? 'Failed' : 'Success');
    if (projectsError) {
      console.error('Projects table error:', projectsError);
    } else {
      console.log('Projects table count:', projectsData);
    }
    
    // Test table list
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    console.log('Table list test:', tablesError ? 'Failed' : 'Success');
    if (tablesError) {
      console.error('Table list error:', tablesError);
    } else {
      console.log('Available tables:', tablesData?.map(t => t.table_name).join(', '));
    }
    
    return { success: true, message: 'Connection tests completed' };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, message: `Connection test failed: ${error}` };
  }
} 