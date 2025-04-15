# Authentication Setup

## Important: Authentication Service Conflict

This project currently has configuration for both Supabase Auth and Clerk Auth in the `.env.local` file. This can cause authentication conflicts. You should choose one auth provider:

### Using Supabase Auth (Recommended)

If you want to use Supabase Auth (as implemented in the codebase), remove these lines from your `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cGxlYXNpbmctbWFjYXctNTIuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_oe0egvMEs5NQ2xO3oQjXqSPiLbI5JAddBMEcJ56wf7
```

### File Structure

The Supabase auth implementation follows the recommended architecture for Next.js App Router:

- `middleware.ts` - Handles session refreshing and protected routes
- `utils/supabase/middleware.ts` - Provides the `updateSession` function
- `utils/supabase/server.ts` - Creates a Supabase client for server components
- `utils/supabase/client.ts` - Creates a Supabase client for client components
- `utils/supabase/config.ts` - Configuration values for Supabase
- `app/auth/callback/route.ts` - Handles auth callbacks (OAuth, email verification)
- `app/auth/signout/route.ts` - Handles signing out
- `app/auth/reset-password/page.tsx` - Password reset form
- `app/signin/page.tsx` - Sign in form
- `app/signup/page.tsx` - Sign up form

## Troubleshooting

If you're having issues with authentication:

1. Make sure you're using only one auth provider (Supabase or Clerk)
2. Check the Supabase project URL and anon key in `.env.local`
3. Verify that email verification is properly set up in Supabase dashboard
4. Check that the database trigger for new users is correctly created

For persistent issues:

1. Clear browser cookies and local storage
2. Try signing in with a different browser or incognito mode
3. Check browser console for errors
4. Verify network requests to Supabase are successful
