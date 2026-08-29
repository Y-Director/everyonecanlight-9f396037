REVOKE ALL ON FUNCTION public.contributor_post_admin_notify() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.is_active_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;