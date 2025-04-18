const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testSupabaseAccess() {
  console.log('Testing Supabase projects table access...');
  
  // Get Supabase configuration from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Supabase configuration missing. Check your .env.local file');
    return false;
  }
  
  console.log('Creating Supabase client with anon key...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Check if we can access the projects table
    console.log('Trying to access projects table...');
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .limit(5);
    
    if (error) {
      console.error('❌ Error accessing projects table with anon key:', error.message);
      
      if (serviceRoleKey) {
        console.log('\nTrying with service role key instead...');
        const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
        
        const { data: adminData, error: adminError } = await adminSupabase
          .from('projects')
          .select('id, name, user_id')
          .limit(5);
        
        if (adminError) {
          console.error('❌ Error accessing projects table with service role key:', adminError.message);
          return false;
        }
        
        console.log('✅ Successfully accessed projects table with service role key');
        console.log(`Found ${adminData.length} projects`);
        
        // If we can access with service role but not anon key, it's likely an RLS issue
        console.log('\n⚠️ You can access the table with service role key but not anon key.');
        console.log('This indicates a Row Level Security (RLS) policy issue.');
        console.log('Possible solutions:');
        console.log('1. Make sure you are authenticated when trying to access projects');
        console.log('2. Check that your RLS policies are correctly set up');
        console.log('3. Verify that the user_id in your projects matches your authenticated user');
        
        // Get current user to help debug
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          console.log('\nCurrent user ID:', userData.user.id);
          console.log('Check if this ID matches user_id in your projects table');
          
          // Check if any projects belong to this user
          const { data: userProjects } = await adminSupabase
            .from('projects')
            .select('id, name')
            .eq('user_id', userData.user.id);
          
          if (userProjects && userProjects.length > 0) {
            console.log(`User has ${userProjects.length} projects in the database:`);
            userProjects.forEach(project => {
              console.log(`- ${project.name} (${project.id})`);
            });
          } else {
            console.log('User has no projects in the database');
            console.log('You may need to create projects for this user first');
          }
        } else {
          console.log('\nNo authenticated user found - you need to sign in first');
        }
      } else {
        console.log('\n⚠️ No SUPABASE_SERVICE_ROLE_KEY found in .env.local');
        console.log('Add this key to help debug the issue');
      }
      
      return false;
    }
    
    console.log('✅ Successfully accessed projects table');
    console.log(`Found ${data.length} projects`);
    
    // List the first few projects
    if (data.length > 0) {
      console.log('\nProjects:');
      data.forEach(project => {
        console.log(`- ${project.name} (ID: ${project.id}, User: ${project.user_id})`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the test
testSupabaseAccess()
  .then(success => {
    console.log('\nTest result:', success ? '✅ SUCCESS' : '❌ FAILED');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed with error:', error);
    process.exit(1);
  }); 