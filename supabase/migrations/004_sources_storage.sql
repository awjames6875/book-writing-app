-- Create storage bucket for source files (PDFs, images, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('sources', 'sources', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can upload sources to their own projects
CREATE POLICY "Users can upload sources to own projects"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'sources' AND
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = (storage.foldername(name))[1]::uuid
    AND projects.user_id = auth.uid()
  )
);

-- Policy: Users can read their own project sources
CREATE POLICY "Users can read own project sources"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'sources' AND
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = (storage.foldername(name))[1]::uuid
    AND projects.user_id = auth.uid()
  )
);

-- Policy: Users can delete their own project sources
CREATE POLICY "Users can delete own project sources"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'sources' AND
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = (storage.foldername(name))[1]::uuid
    AND projects.user_id = auth.uid()
  )
);
