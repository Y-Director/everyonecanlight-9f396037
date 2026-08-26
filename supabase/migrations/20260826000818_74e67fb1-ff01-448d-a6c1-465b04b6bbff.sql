CREATE POLICY "Public can read authors of published posts"
ON public.contributor_profiles
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.contributor_posts p
    WHERE p.author_id = contributor_profiles.user_id
      AND p.status = 'published'
  )
);