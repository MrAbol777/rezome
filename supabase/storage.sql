-- ──────────────────────────────────────────────
-- Supabase Storage Setup: project-images bucket
-- Paste into Supabase SQL Editor
-- ──────────────────────────────────────────────

-- Create the storage bucket (public reads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated admin to upload/update/delete
CREATE POLICY "Admin can upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin can update project images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin can delete project images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-images'
    AND auth.role() = 'authenticated'
  );

-- Public can read project images
CREATE POLICY "Public can read project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');
