/**
 * Script to configure Supabase Auth settings to disable email confirmation
 * 
 * To use:
 * 1. Add your SUPABASE_SERVICE_ROLE_KEY to .env.local
 * 2. Run: node update-supabase-auth.js
 */

const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function updateSupabaseAuthSettings() {
  console.log('Updating Supabase auth settings to disable email confirmation...');

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env.local');
    return false;
  }

  const adminApiUrl = `${SUPABASE_URL}/auth/v1/config`;

  try {
    // First, get current settings
    const currentSettings = await fetch(adminApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    }).then(res => res.json());

    console.log('Current email confirmation setting:', 
      currentSettings.MAILER_AUTOCONFIRM ? 'Disabled (auto-confirm enabled)' : 'Enabled');

    // Update settings to disable email confirmation
    const response = await fetch(adminApiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        MAILER_AUTOCONFIRM: true,
        MAILER_OTP_EXP: 86400
      })
    });

    if (response.ok) {
      console.log('✅ Successfully updated auth settings - email confirmation is now disabled');
      console.log('✅ New users will be automatically confirmed without email verification');
      return true;
    } else {
      const errorData = await response.json();
      console.error('Error updating auth settings:', errorData);
      
      if (response.status === 403 || response.status === 401) {
        console.error('Authentication error: Make sure your SUPABASE_SERVICE_ROLE_KEY is correct');
        console.error('You can find this key in your Supabase dashboard under Project Settings > API');
      }
      
      return false;
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the function
updateSupabaseAuthSettings()
  .then(success => {
    if (success) {
      console.log('\nNext steps:');
      console.log('1. Restart your Next.js development server');
      console.log('2. Try signing up with a new account - no email confirmation should be required');
    } else {
      console.error('\nFailed to update Supabase auth settings');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Script execution failed:', error);
    process.exit(1);
  }); 