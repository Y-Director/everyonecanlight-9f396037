-- 1. email_send_state: scope policy to service_role directly
DROP POLICY IF EXISTS "Service role can manage send state" ON public.email_send_state;
CREATE POLICY "Service role can manage send state"
ON public.email_send_state
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

REVOKE ALL ON public.email_send_state FROM anon, authenticated;
GRANT ALL ON public.email_send_state TO service_role;

-- 2. prop_items: align admin write access with admin_accounts model
DROP POLICY IF EXISTS "Admins manage props" ON public.prop_items;
CREATE POLICY "Admins manage props"
ON public.prop_items
FOR ALL
TO authenticated
USING (
  app_private.is_super_admin(auth.uid())
  OR app_private.admin_has_section(auth.uid(), 'rentals')
)
WITH CHECK (
  app_private.is_super_admin(auth.uid())
  OR app_private.admin_has_section(auth.uid(), 'rentals')
);