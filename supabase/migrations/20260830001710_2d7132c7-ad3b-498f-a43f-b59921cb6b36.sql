CREATE UNIQUE INDEX IF NOT EXISTS contributor_profiles_display_name_unique
  ON public.contributor_profiles (lower(display_name));

CREATE OR REPLACE FUNCTION public.contributor_display_name_available(_name text, _exclude_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.contributor_profiles
    WHERE lower(display_name) = lower(btrim(_name))
      AND (_exclude_user_id IS NULL OR user_id <> _exclude_user_id)
  )
$$;

REVOKE ALL ON FUNCTION public.contributor_display_name_available(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.contributor_display_name_available(text, uuid) TO anon, authenticated, service_role;