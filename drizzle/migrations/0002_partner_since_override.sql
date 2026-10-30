ALTER TABLE public.admin_accounts ADD COLUMN partner_since date;
COMMENT ON COLUMN public.admin_accounts.partner_since IS 'Optional cutoff date for rental partners: bookings before this date are hidden. Falls back to the account signup date when NULL.';

CREATE OR REPLACE FUNCTION app_private.partner_since(_uid uuid)
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app_private
AS $$
  SELECT COALESCE(
    (SELECT (aa.partner_since::timestamptz)
       FROM public.admin_accounts aa
       JOIN auth.users u ON lower(u.email) = lower(aa.email)
      WHERE u.id = _uid AND aa.partner_since IS NOT NULL),
    (SELECT u.created_at FROM auth.users u WHERE u.id = _uid)
  )
$$;