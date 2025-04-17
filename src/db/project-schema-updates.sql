-- Update the projects table to ensure team_members column exists and other schema changes
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::JSONB;

-- Update the notification_settings field if it doesn't match the new structure
UPDATE projects
SET notification_settings = '{
  "email_notifications": true,
  "daily_summary": true,
  "agent_activity_alerts": false
}'::JSONB
WHERE notification_settings::text NOT LIKE '%email_notifications%';

-- Create updated project_access_policy to handle team members
DROP POLICY IF EXISTS "Users can view their own projects or projects they are a team member of" ON projects;
CREATE POLICY "Users can view their own projects or projects they are a team member of" 
ON projects 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT jsonb_path_query(team_members, '$[*].id')::text 
    FROM projects 
    WHERE id = projects.id
  )
);

-- Update RLS policies for other operations to respect team member roles
-- Only owners or editors can update projects
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
CREATE POLICY "Users can update their own projects" 
ON projects 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  (
    auth.uid() IN (
      SELECT jsonb_path_query(team_members, '$[*].id')::text 
      FROM projects 
      WHERE id = projects.id AND 
      EXISTS (
        SELECT 1 
        FROM jsonb_array_elements(team_members) AS member 
        WHERE member->>'id' = auth.uid()::text AND 
              (member->>'role' = 'owner' OR member->>'role' = 'editor')
      )
    )
  )
);

-- Only owners can delete projects
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
CREATE POLICY "Users can delete their own projects" 
ON projects 
FOR DELETE 
USING (
  auth.uid() = user_id OR 
  (
    EXISTS (
      SELECT 1 
      FROM jsonb_array_elements(team_members) AS member 
      WHERE member->>'id' = auth.uid()::text AND member->>'role' = 'owner'
    )
  )
);

-- Add email column to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Create a trigger to keep email in sync with auth.users
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET email = NEW.email 
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the trigger already exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'sync_email_on_auth_user_update' 
  ) THEN
    CREATE TRIGGER sync_email_on_auth_user_update
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.email IS DISTINCT FROM NEW.email)
    EXECUTE FUNCTION sync_user_email();
  END IF;
END $$;

-- Run initial email sync for existing users
UPDATE profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE profiles.id = auth.users.id AND profiles.email IS NULL; 