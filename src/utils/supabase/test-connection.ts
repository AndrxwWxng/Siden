/**
 * Utility to test Supabase connection
 */
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// Function to test Supabase connection
async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');

  // Get Supabase configuration from env variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing. Check your .env file');
    return false;
  }

  // Test Supabase client connection
  try {
    console.log('Testing Supabase API connection...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test by getting version
    const { data: authData } = await supabase.auth.getSession();
    console.log('Auth session test:', authData ? 'Success' : 'No session');
    
    // Check if we can access the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase API connection error:', error.message);
    } else {
      console.log('✅ Supabase API connection successful');
      console.log('Profiles count query result:', data);
    }
    
    // Test PostgreSQL direct connection if DATABASE_URL is provided
    if (databaseUrl) {
      console.log('\nTesting PostgreSQL direct connection...');
      const client = new Client({ connectionString: databaseUrl });
      
      try {
        await client.connect();
        const result = await client.query('SELECT NOW()');
        console.log('✅ PostgreSQL connection successful');
        console.log('Database timestamp:', result.rows[0].now);
        
        // Test if the profiles table exists
        const tableCheck = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = 'profiles'
          );
        `);
        
        console.log('Profiles table exists:', tableCheck.rows[0].exists);
        
        if (tableCheck.rows[0].exists) {
          const profilesCount = await client.query('SELECT COUNT(*) FROM profiles');
          console.log('Number of profiles:', profilesCount.rows[0].count);
        }
        
        await client.end();
        return true;
      } catch (pgError) {
        console.error('PostgreSQL connection error:', pgError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

// Run the test
testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('\nAll connection tests passed!');
      process.exit(0);
    } else {
      console.error('\nConnection tests failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 