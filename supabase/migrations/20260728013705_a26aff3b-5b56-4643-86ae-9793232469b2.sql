CREATE SCHEMA IF NOT EXISTS app_private;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT USAGE ON SCHEMA app_private TO service_role;
REVOKE ALL ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO service_role;

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view reservations" ON public.rental_reservations;
CREATE POLICY "Admins can view reservations"
ON public.rental_reservations
FOR SELECT
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view rental customers" ON public.rental_customers;
CREATE POLICY "Admins can view rental customers"
ON public.rental_customers
FOR SELECT
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update rental customers" ON public.rental_customers;
CREATE POLICY "Admins can update rental customers"
ON public.rental_customers
FOR UPDATE
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view runners" ON public.runners;
CREATE POLICY "Admins can view runners"
ON public.runners
FOR SELECT
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view masterclass registrations" ON public.masterclass_registrations;
CREATE POLICY "Admins can view masterclass registrations"
ON public.masterclass_registrations
FOR SELECT
TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can read KYC IDs" ON storage.objects;
CREATE POLICY "Admins can read KYC IDs"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'kyc-ids' AND app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can upload KYC IDs" ON storage.objects;
CREATE POLICY "Admins can upload KYC IDs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'kyc-ids' AND app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update KYC IDs" ON storage.objects;
CREATE POLICY "Admins can update KYC IDs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'kyc-ids' AND app_private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'kyc-ids' AND app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete KYC IDs" ON storage.objects;
CREATE POLICY "Admins can delete KYC IDs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'kyc-ids' AND app_private.has_role(auth.uid(), 'admin'::public.app_role));

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;