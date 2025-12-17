-- Create storage bucket for audio recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('recordings', 'recordings', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can upload recordings to their own projects
CREATE POLICY "Users can upload recordings to own projects"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'recordings' AND
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = (storage.foldername(name))[1]::uuid
    AND projects.user_id = auth.uid()
  )
);

-- Policy: Users can read their own project recordings
CREATE POLICY "Users can read own project recordings"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'recordings' AND
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = (storage.foldername(name))[1]::uuid
    AND projects.user_id = auth.uid()
  )
);

-- Policy: Users can delete their own project recordings
CREATE POLICY "Users can delete own project recordings"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'recordings' AND
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = (storage.foldername(name))[1]::uuid
    AND projects.user_id = auth.uid()
  )
);
