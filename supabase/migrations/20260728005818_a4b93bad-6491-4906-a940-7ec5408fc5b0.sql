-- 1. masterclass_registrations: explicit admin-only read, deny everyone else
CREATE POLICY "Admins can view masterclass registrations"
ON public.masterclass_registrations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

REVOKE ALL ON public.masterclass_registrations FROM anon;
GRANT SELECT ON public.masterclass_registrations TO authenticated;
GRANT ALL ON public.masterclass_registrations TO service_role;

-- 2. rental_otps: explicit deny for all client roles (server-side only)
CREATE POLICY "No client access to rental otps"
ON public.rental_otps
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

REVOKE ALL ON public.rental_otps FROM anon, authenticated;
GRANT ALL ON public.rental_otps TO service_role;

-- 3. kyc-ids storage: explicit ownership/admin controls for writes
CREATE POLICY "Admins can upload KYC IDs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'kyc-ids' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update KYC IDs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'kyc-ids' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'kyc-ids' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete KYC IDs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'kyc-ids' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 4. has_role: not directly callable by clients; still usable inside RLS policies
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;
