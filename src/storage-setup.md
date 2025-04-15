# Supabase Storage Setup

This document outlines the steps needed to set up storage in your Supabase project for user avatar uploads.

## 1. Create the Avatars Bucket

1. Log in to your Supabase dashboard
2. Navigate to 'Storage' in the left sidebar
3. Click 'New Bucket'
4. Enter 'avatars' as the bucket name
5. Set the bucket to 'Private' (access will be controlled via RLS)
6. Click 'Create Bucket'

## 2. Set up RLS (Row Level Security) Policies

Add the following RLS policies to your 'avatars' bucket to control access:

### Allow users to select (view) their own avatars:

```sql
CREATE POLICY "Users can view own avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### Allow any user to view avatars (if you want avatars to be publicly visible):

```sql
CREATE POLICY "Avatars are publicly viewable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Allow authenticated users to upload their own avatars:

```sql
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### Allow users to update their own avatars:

```sql
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### Allow users to delete their own avatars:

```sql
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

## 3. Update File Structure (Optional)

If you're organizing avatars by user ID, you can modify the `uploadAvatar` method in `UserService` to use folders:

```typescript
// Upload the avatar to a user-specific folder
const fileName = `${user.id}/${Date.now()}.${fileExt}`;
```

## 4. Testing

Once your storage setup is complete, you can test avatar uploads from the account settings page. The system will:

1. Upload the avatar to Supabase Storage
2. Get the public URL for the uploaded file
3. Update the user's profile with the new avatar URL

## Troubleshooting

If you encounter issues with avatar uploads:

1. Check the browser console for error messages
2. Ensure the 'avatars' bucket exists in Supabase
3. Verify your RLS policies are correctly set up
4. Make sure you're signed in as an authenticated user
5. Confirm the file size is not exceeding Supabase limits

For detailed storage logs, check the Supabase dashboard under Storage > Logs.
