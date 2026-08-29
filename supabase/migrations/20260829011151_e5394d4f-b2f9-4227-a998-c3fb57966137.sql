DROP POLICY IF EXISTS "Authors delete own posts" ON public.contributor_posts;
CREATE POLICY "Authors delete own posts" ON public.contributor_posts
FOR DELETE TO authenticated
USING (auth.uid() = author_id);