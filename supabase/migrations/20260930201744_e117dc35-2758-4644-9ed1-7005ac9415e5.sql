CREATE OR REPLACE FUNCTION app_private.partner_since(_uid uuid)
RETURNS timestamptz LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, auth AS $$
  SELECT created_at FROM auth.users WHERE id = _uid
$$;
REVOKE ALL ON FUNCTION app_private.partner_since(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION app_private.partner_since(uuid) TO authenticated;

DROP POLICY IF EXISTS "Rental partners view paid reservations" ON public.rental_reservations;
CREATE POLICY "Rental partners view paid reservations" ON public.rental_reservations
FOR SELECT TO authenticated
USING (
  status = 'confirmed'
  AND app_private.admin_has_section(auth.uid(), 'rentals_partner')
  AND COALESCE(paid_at, created_at) >= app_private.partner_since(auth.uid())
);