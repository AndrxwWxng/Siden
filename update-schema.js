#!/usr/bin/env node

/**
 * Supabase Schema Update Utility
 * This script helps users update their Supabase schema to support chat configuration
 * and integrations for projects.
 */

console.log('\n=== Supabase Schema Update Utility ===\n');
console.log('This utility helps you update your Supabase schema to support new features like:');
console.log('- Chat configuration for projects');
console.log('- Integration connections for external services\n');

console.log('To update your schema, you should:');
console.log('1. Log in to your Supabase dashboard at https://app.supabase.com');
console.log('2. Go to the SQL Editor section');
console.log('3. Create a new query and paste the following SQL:\n');

console.log(`-- Add chat_config and integrations columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS chat_config jsonb DEFAULT '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 2000, "system_prompt": "You are a helpful AI assistant working on this project.", "tools_enabled": true}';

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS integrations jsonb DEFAULT '{"connected": false, "services": []}';
`);

console.log('4. Run the SQL query to update your schema');
console.log('5. Restart your application\n');

console.log('If you need to create the entire projects table, use this SQL instead:\n');

console.log(`-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  agents text[] DEFAULT '{}',
  chat_config jsonb DEFAULT '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 2000, "system_prompt": "You are a helpful AI assistant working on this project.", "tools_enabled": true}',
  integrations jsonb DEFAULT '{"connected": false, "services": []}',
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for projects - users can CRUD only their own projects
CREATE POLICY "Users can view their own projects" 
ON projects FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON projects FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON projects FOR DELETE 
USING (auth.uid() = user_id);
`);

console.log('\nFor more information, see the README.md file or the docs at /src/db/schema.sql.\n'); 