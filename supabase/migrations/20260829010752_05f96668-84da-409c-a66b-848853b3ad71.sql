DROP POLICY IF EXISTS "Contributors read own profile" ON public.contributor_profiles;
CREATE POLICY "Contributors read own profile" ON public.contributor_profiles
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR app_private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Authors read own posts" ON public.contributor_posts;
CREATE POLICY "Authors read own posts" ON public.contributor_posts
FOR SELECT TO authenticated
USING (auth.uid() = author_id OR app_private.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins update any post" ON public.contributor_posts;
CREATE POLICY "Admins update any post" ON public.contributor_posts
FOR UPDATE TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (app_private.has_role(auth.uid(), 'admin'::app_role));