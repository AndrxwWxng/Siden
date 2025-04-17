-- No additional schema changes are needed for the current implementation.
-- The existing schema already includes:
--   - projects table with:
--     - id
--     - user_id
--     - name
--     - description
--     - agents (JSONB array)
--     - chat_config (JSONB)
--     - integrations (JSONB)
--     - team_settings (JSONB)
--     - status
--     - created_at
--     - updated_at
--     - last_active

-- However, if you want to add notification preferences per project,
-- you could consider adding this:

-- Add notification_settings column if it doesn't exist yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND column_name = 'notification_settings'
  ) THEN
    ALTER TABLE projects
    ADD COLUMN notification_settings JSONB DEFAULT '{
      "email_notifications": true,
      "daily_summary": true,
      "agent_activity_alerts": false
    }'::JSONB;
  END IF;
END $$; 