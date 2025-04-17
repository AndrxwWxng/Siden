/**
 * Supabase Schema Update Utility
 * This script helps users update their Supabase schema to support new features.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper function to display instructions
function displayInstructions() {
  console.log('\n=== Supabase Schema Update Utility ===\n');
  console.log('This utility helps you update your Supabase schema to support new features like:');
  console.log('- Chat configuration for projects');
  console.log('- Integration connections for external services\n');
  
  console.log('To update your schema, you should:');
  console.log('1. Log in to your Supabase dashboard at https://app.supabase.com');
  console.log('2. Go to the SQL Editor section');
  console.log('3. Create a new query and paste the following SQL:\n');
  
  // Read the schema.sql file and output the projects table definition
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Extract the projects table definition
  const projectsTableMatch = schemaContent.match(/-- Create projects table[\s\S]*?;/);
  
  if (projectsTableMatch) {
    console.log(projectsTableMatch[0]);
  } else {
    console.log('Could not find projects table definition in schema.sql');
  }
  
  console.log('\nIf you already have a projects table, you can run this SQL instead to add the new columns:\n');
  console.log(`
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS chat_config jsonb DEFAULT '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 2000, "system_prompt": "You are a helpful AI assistant working on this project.", "tools_enabled": true}';

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS integrations jsonb DEFAULT '{"connected": false, "services": []}';
  `);
  
  console.log('\n4. Run the SQL query to update your schema');
  console.log('5. Restart your application\n');
}

// Main function
function main() {
  displayInstructions();
  
  console.log('Environment Variables:');
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}\n`);
  
  console.log('For more information, see the README.md file.\n');
}

// Run the main function
main(); 