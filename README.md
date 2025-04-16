# Next.js + Supabase Integration

This project integrates Next.js with Supabase for authentication, user profiles, settings, and project management.

## Fixed Issues

1. **Authentication Persistence**: Sessions now persist across tabs and refreshes
2. **Project Fetching Errors**: Fixed error handling in project service
3. **Improved Auth Callback Handling**: Better error handling and user onboarding
4. **Route Protection**: Middleware now properly protects dashboard routes
5. **Enhanced User Experience**: Added loading states and better error messages

## Setup Steps

### 1. Set Up Database Schema

Run the SQL commands in `src/db/schema.sql` in your Supabase SQL Editor to create:

- Profiles table
- Projects table
- User settings table
- Required RLS policies
- Auto-creation triggers for new users

### 2. Set Up Storage for Avatars

Follow the instructions in `src/storage-setup.md` to:

- Create an 'avatars' bucket
- Set up RLS policies for the bucket
- Configure access controls

### 3. Environment Variables

Ensure your Supabase URL and Anon Key are properly configured in `src/utils/supabase/config.ts`.

For local development, you can also use a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

## Features

### Authentication

- User signup and signin
- Password reset flow
- Email verification
- Persistent sessions across tabs
- Protected routes

### User Profiles

- Custom usernames
- Profile pictures (with upload)
- Personal websites and metadata

### User Settings

- Theme preferences
- Email notification preferences

### Projects

- Create, read, update, delete operations
- Project filtering and searching
- Project permissions based on ownership

## Usage

The authentication flow is now seamless:

1. **Sign Up**: Creates a new user and automatically creates profile/settings
2. **Sign In**: Persists session across tabs and page refreshes
3. **Account Management**: Update profile, avatar, and settings
4. **Project Management**: Create and manage projects with proper permissions

## Key Files

- `src/utils/supabase/client.ts` - Client-side Supabase client
- `src/utils/supabase/server.ts` - Server-side Supabase client
- `src/utils/supabase/middleware.ts` - Session refresh middleware
- `src/middleware.ts` - Route protection and auth redirects
- `src/services/userService.ts` - User profile and settings operations
- `src/services/projectService.ts` - Project CRUD operations
- `src/app/auth/callback/route.ts` - Auth callback handler for OAuth/email verification
- `src/app/dashboard/account/page.tsx` - Account settings page
- `src/app/dashboard/settings/page.tsx` - User settings page
- `src/app/signin/page.tsx` and `src/app/signup/page.tsx` - Auth pages

## Troubleshooting

If you encounter authentication issues:

1. Check browser console for errors
2. Verify your Supabase project URL and anon key are correct
3. Ensure SQL migrations have been applied correctly
4. Clear cookies and local storage if testing auth flows
5. Check Supabase authentication logs in the dashboard

For project-related errors:

1. Verify RLS policies are correctly set up
2. Check that the user has appropriate permissions
3. Confirm the database tables exist with correct schema
4. Review Supabase database logs for query errors
