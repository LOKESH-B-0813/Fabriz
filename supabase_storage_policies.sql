-- ========================================================================
-- FABRIZ: Supabase Storage Configuration & Row Level Security (RLS)
-- Bucket: note-images (STRICTLY PRIVATE)
-- Authentication: Firebase Auth Third-Party JWT Integration. Configure Supabase
-- third-party JWT verification so valid Firebase ID tokens receive `authenticated`.
-- Project: fabriz-task-app (Firebase) -> kteidruvagfxigyzhifz (Supabase)
-- Path Pattern: users/{firebase_uid}/notes/{note_id}/{image_id}.{extension}
-- ========================================================================

-- STEP 1: Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- STEP 2: Create or update the private 'note-images' bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'note-images',
    'note-images',
    false, -- STRICTLY PRIVATE: Access only via authenticated endpoints
    5242880, -- 5 MB limit per image
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- STEP 3: Helper function to extract authenticated Firebase UID from JWT
-- Firebase Auth standard ID token stores the user's UID in the 'sub' claim.
CREATE OR REPLACE FUNCTION storage.get_firebase_uid()
RETURNS text
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(TRIM(COALESCE(
        auth.jwt() ->> 'sub',
        auth.jwt() ->> 'user_id'
    )), '');
$$;

-- STEP 4: Row Level Security Policies on storage.objects

-- 4a. Allow users to upload note images ONLY into their own designated folder
DROP POLICY IF EXISTS "Users can insert their own note images" ON storage.objects;
CREATE POLICY "Users can insert their own note images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'note-images'
    AND storage.get_firebase_uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = storage.get_firebase_uid()
    AND (storage.foldername(name))[3] = 'notes'
    AND array_length(storage.foldername(name), 1) = 4
    AND name ~ '^users/[A-Za-z0-9_-]{1,128}/notes/[A-Za-z0-9_-]{1,128}/[A-Za-z0-9_-]{1,128}\.(jpg|png|webp)$'
);

-- 4b. Allow users to download/read ONLY their own note images
DROP POLICY IF EXISTS "Users can select their own note images" ON storage.objects;
CREATE POLICY "Users can select their own note images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'note-images'
    AND storage.get_firebase_uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = storage.get_firebase_uid()
    AND (storage.foldername(name))[3] = 'notes'
    AND array_length(storage.foldername(name), 1) = 4
    AND name ~ '^users/[A-Za-z0-9_-]{1,128}/notes/[A-Za-z0-9_-]{1,128}/[A-Za-z0-9_-]{1,128}\.(jpg|png|webp)$'
);

-- 4c. Allow users to update ONLY their own note images
DROP POLICY IF EXISTS "Users can update their own note images" ON storage.objects;
CREATE POLICY "Users can update their own note images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'note-images'
    AND storage.get_firebase_uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = storage.get_firebase_uid()
    AND (storage.foldername(name))[3] = 'notes'
    AND array_length(storage.foldername(name), 1) = 4
    AND name ~ '^users/[A-Za-z0-9_-]{1,128}/notes/[A-Za-z0-9_-]{1,128}/[A-Za-z0-9_-]{1,128}\.(jpg|png|webp)$'
)
WITH CHECK (
    bucket_id = 'note-images'
    AND storage.get_firebase_uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = storage.get_firebase_uid()
    AND (storage.foldername(name))[3] = 'notes'
    AND array_length(storage.foldername(name), 1) = 4
    AND name ~ '^users/[A-Za-z0-9_-]{1,128}/notes/[A-Za-z0-9_-]{1,128}/[A-Za-z0-9_-]{1,128}\.(jpg|png|webp)$'
);

-- 4d. Allow users to delete ONLY their own note images
DROP POLICY IF EXISTS "Users can delete their own note images" ON storage.objects;
CREATE POLICY "Users can delete their own note images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'note-images'
    AND storage.get_firebase_uid() IS NOT NULL
    AND (storage.foldername(name))[1] = 'users'
    AND (storage.foldername(name))[2] = storage.get_firebase_uid()
    AND (storage.foldername(name))[3] = 'notes'
    AND array_length(storage.foldername(name), 1) = 4
    AND name ~ '^users/[A-Za-z0-9_-]{1,128}/notes/[A-Za-z0-9_-]{1,128}/[A-Za-z0-9_-]{1,128}\.(jpg|png|webp)$'
);
