#!/usr/bin/env node

/**
 * Supabase Schema Fix Utility
 * This script helps users fix their Supabase schema to add missing 'agents' column
 */

console.log('\n=== Supabase Schema Fix Utility ===\n');
console.log('This utility helps you fix your Supabase schema to add the missing agents column.');
console.log('The error "Could not find the \'agents\' column of \'projects\'" indicates your database schema is missing this column.\n');

console.log('To fix your schema, you should:');
console.log('1. Log in to your Supabase dashboard at https://app.supabase.com');
console.log('2. Go to the SQL Editor section');
console.log('3. Create a new query and paste the following SQL:\n');

console.log(`-- Fix missing agents column in projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS agents text[] DEFAULT '{}';

-- Verify the column exists with a simple query
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'agents';

-- Make sure all other required columns exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS chat_config jsonb DEFAULT '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 2000, "system_prompt": "You are a helpful AI assistant working on this project.", "tools_enabled": true}';

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS integrations jsonb DEFAULT '{"connected": false, "services": []}';
`);

console.log('4. Run the SQL query to add the missing column');
console.log('5. Restart your application\n');

console.log('This should fix the error: "Could not find the \'agents\' column of \'projects\' in the schema cache"');
console.log('If you continue to have issues, make sure your database user has the necessary permissions to alter tables.\n'); 