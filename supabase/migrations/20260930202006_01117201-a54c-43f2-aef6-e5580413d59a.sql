DROP POLICY IF EXISTS "Public read contributor media" ON storage.objects;
CREATE POLICY "Owners and admins read contributor media" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'contributor-media'
  AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_active_admin())
);