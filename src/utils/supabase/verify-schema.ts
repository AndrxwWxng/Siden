import { createClient } from './client';

// Function to verify if the schema is set up correctly
export async function verifySupabaseSchema() {
  try {
    const supabase = createClient();
    console.log('Checking Supabase schema...');
    
    // Check if the projects table exists
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (projectsError) {
      console.error('Projects table issue:', projectsError);
      console.error('Schema may not be set up correctly. Please run the SQL commands in src/db/schema.sql');
      
      return {
        success: false,
        message: 'Projects table not accessible',
        error: projectsError.message
      };
    }
    
    // Check if the profiles table exists
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError) {
      console.error('Profiles table issue:', profilesError);
      console.error('Schema may not be set up correctly. Please run the SQL commands in src/db/schema.sql');
      
      return {
        success: false,
        message: 'Profiles table not accessible',
        error: profilesError.message
      };
    }
    
    // Test auth
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    const authenticated = !userError && userData?.user !== null;
    
    return {
      success: true,
      message: 'Schema verification passed',
      authenticated: authenticated,
      tables: {
        projects: true,
        profiles: true
      }
    };
  } catch (error) {
    console.error('Error verifying schema:', error);
    return {
      success: false,
      message: 'Error verifying schema',
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 