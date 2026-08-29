ALTER TABLE public.contributor_profiles
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS suspended_at timestamptz,
  ADD COLUMN IF NOT EXISTS suspension_reason text;

ALTER TABLE public.contributor_profiles
  ADD CONSTRAINT contributor_profiles_status_check CHECK (status IN ('active','suspended'));

CREATE POLICY "Admin accounts read all contributor profiles"
ON public.contributor_profiles FOR SELECT TO authenticated
USING (public.is_active_admin());

CREATE POLICY "Admin accounts manage contributor profiles"
ON public.contributor_profiles FOR UPDATE TO authenticated
USING (public.is_active_admin())
WITH CHECK (public.is_active_admin());

CREATE OR REPLACE FUNCTION public.contributor_is_active(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT status FROM public.contributor_profiles WHERE user_id = _user_id), 'active') = 'active'
$$;

REVOKE ALL ON FUNCTION public.contributor_is_active(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.contributor_is_active(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Authors create own posts" ON public.contributor_posts;
CREATE POLICY "Authors create own posts"
ON public.contributor_posts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = author_id AND public.contributor_is_active(auth.uid()));

DROP POLICY IF EXISTS "Authors update own posts" ON public.contributor_posts;
CREATE POLICY "Authors update own posts"
ON public.contributor_posts FOR UPDATE TO authenticated
USING (auth.uid() = author_id AND public.contributor_is_active(auth.uid()))
WITH CHECK (auth.uid() = author_id AND public.contributor_is_active(auth.uid()));