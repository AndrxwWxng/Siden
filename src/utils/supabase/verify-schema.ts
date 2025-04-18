import { createClient } from './client';

// Function to verify if the schema is set up correctly
export async function verifySupabaseSchema() {
  try {
    console.log('Starting Supabase schema verification...');
    
    // Check environment
    const isBrowser = typeof window !== 'undefined';
    console.log('Environment:', isBrowser ? 'Browser' : 'Server');
    
    const supabase = createClient();
    console.log('Supabase client created successfully.');
    
    // Check if the projects table exists
    console.log('Checking projects table...');
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (projectsError) {
      console.error('❌ Projects table issue:', projectsError);
      console.error('Schema may not be set up correctly. Please run the SQL commands in schema.sql');
      
      return {
        success: false,
        message: 'Projects table not accessible',
        error: projectsError.message
      };
    } else {
      console.log('✅ Projects table check passed');
    }
    
    // Check if the profiles table exists
    console.log('Checking profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Profiles table issue:', profilesError);
      console.error('Schema may not be set up correctly. Please run the SQL commands in schema.sql');
      
      return {
        success: false,
        message: 'Profiles table not accessible',
        error: profilesError.message
      };
    } else {
      console.log('✅ Profiles table check passed');
    }
    
    // Test auth
    console.log('Checking authentication...');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('Auth check: Not authenticated');
    } else {
      console.log('Auth check: User found:', userData?.user?.id || 'No user ID');
    }
    
    const authenticated = !userError && userData?.user !== null;
    
    const result = {
      success: true,
      message: 'Schema verification passed',
      authenticated: authenticated,
      tables: {
        projects: true,
        profiles: true
      }
    };
    
    console.log('✅ Verification result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error verifying schema:', error);
    return {
      success: false,
      message: 'Error verifying schema',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Run the verification if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  console.log('Running schema verification directly...');
  verifySupabaseSchema()
    .then(result => {
      console.log('Final result:', JSON.stringify(result, null, 2));
      if (!result.success) {
        console.error('❌ Schema verification failed');
        process.exit(1);
      } else {
        console.log('✅ Schema verification successful - database is set up correctly');
        
        // Give instructions for next steps
        console.log('\nNext steps:');
        console.log('1. Restart your Next.js development server if it\'s running:');
        console.log('   pnpm dev');
        console.log('2. Try accessing the projects from your application');
        console.log('3. If still having issues, you may need to create a project for your user');
      }
    })
    .catch(error => {
      console.error('Verification failed with error:', error);
      process.exit(1);
    });
} 