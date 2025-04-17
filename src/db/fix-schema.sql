-- Fix missing agents column in projects table
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