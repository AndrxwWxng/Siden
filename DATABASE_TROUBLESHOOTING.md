# Database Troubleshooting Guide

This guide helps you fix common database issues with the Supabase integration.

## "Projects table not accessible" Error

If you encounter this error, it typically means one of the following:

1. The table doesn't exist in your Supabase database
2. Row Level Security (RLS) policies are preventing access
3. Authentication issues with your Supabase client

### Quick Fix

Run the verification script to check your database setup:

```bash
npx tsx src/utils/supabase/verify-schema.ts
```

If the script shows issues, you can fix them automatically by running:

```bash
node setup-projects-table.js
```

### Manual Steps to Fix

If you need to manually fix the issue:

1. Make sure your `.env.local` file contains the required Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL=your-direct-connection-string
   ```

2. Create the projects table in your Supabase database:

   ```sql
   CREATE TABLE IF NOT EXISTS projects (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT,
     status TEXT DEFAULT 'active',
     agents JSONB DEFAULT '[]'::JSONB,
     team_settings JSONB DEFAULT '{}'::JSONB,
     chat_config JSONB DEFAULT '{
       "model": "gpt-4",
       "temperature": 0.7,
       "max_tokens": 2000,
       "system_prompt": "You are a helpful AI assistant working on this project.",
       "tools_enabled": true
     }'::JSONB,
     integrations JSONB DEFAULT '{
       "connected": false,
       "services": []
     }'::JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     last_active TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );
   ```

3. Enable Row Level Security:

   ```sql
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   ```

4. Create RLS policies:

   ```sql
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
   ```

5. Restart your development server:
   ```bash
   pnpm dev
   ```

## Authentication Issues

If you're unable to access the projects table even after it exists, there might be authentication issues:

1. Make sure you're signed in to your account
2. Verify that your projects have the correct `user_id` matching your authenticated user
3. Check RLS policies are correctly set up

You can use the service role key to bypass RLS policies for debugging:

```js
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

> ⚠️ **Warning**: Never use the service role key in client-side code or expose it publicly.

## Common Errors and Fixes

### "ReferenceError: document is not defined"

This happens when trying to use browser-specific code in Node.js environments. The fix is to detect the environment and use the appropriate client:

```js
// In src/utils/supabase/client.ts
export const createClient = () => {
  const isBrowser =
    typeof window !== "undefined" && typeof document !== "undefined";

  if (isBrowser) {
    // Browser-specific client with cookie handling
    return createBrowserClient(/* ... */);
  } else {
    // Node.js client without cookie handling
    return createSupabaseClient(supabaseConfig.url, supabaseConfig.anonKey);
  }
};
```

### "Error: permission denied for table projects"

This indicates an RLS policy issue. Make sure:

1. You're authenticated
2. Your user ID matches the `user_id` in the projects table
3. The RLS policies are correctly set up

## Need More Help?

If you continue to experience issues, try:

1. Checking the Supabase dashboard for table structure and RLS policies
2. Running SQL queries directly through the Supabase dashboard
3. Verifying your authentication is working correctly
4. Clearing browser cookies and cache

For more information, refer to:

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
