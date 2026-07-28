DROP POLICY IF EXISTS "Admins can read KYC IDs" ON storage.objects;
CREATE POLICY "Rental admins can read KYC IDs" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'kyc-ids' AND app_private.admin_has_section(auth.uid(), 'rentals'));