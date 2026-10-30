DROP POLICY "Admins can view payment incidents" ON public.payment_incidents;
CREATE POLICY "Admins can view payment incidents" ON public.payment_incidents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admin_accounts a
    WHERE lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      AND a.status = 'active'
      AND (
        a.is_super
        OR public.payment_incidents.created_at >= coalesce(a.partner_since, a.created_at::date)::timestamptz
      )
  )
);