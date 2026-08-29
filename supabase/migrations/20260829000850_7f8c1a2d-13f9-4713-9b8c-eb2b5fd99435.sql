CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_accounts
    WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      AND status = 'active'
  )
$$;

CREATE POLICY "Admin accounts read all posts" ON public.contributor_posts
FOR SELECT TO authenticated USING (public.is_active_admin());

CREATE POLICY "Admin accounts review posts" ON public.contributor_posts
FOR UPDATE TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

CREATE OR REPLACE FUNCTION public.contributor_post_admin_notify()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE author_name text;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('in_review','published') THEN
    SELECT display_name INTO author_name FROM public.contributor_profiles WHERE user_id = NEW.author_id;
    INSERT INTO public.activity_log (category, event, title, summary, severity, entity_type, entity_id, metadata)
    VALUES (
      'contributors',
      CASE WHEN NEW.status = 'published' THEN 'post_published' ELSE 'post_submitted' END,
      CASE WHEN NEW.status = 'published' THEN 'Contributor ' || NEW.kind || ' published' ELSE 'New ' || NEW.kind || ' submitted for review' END,
      NEW.title || ' — by ' || COALESCE(author_name, 'contributor'),
      'info',
      'contributor_post',
      NEW.id::text,
      jsonb_build_object('kind', NEW.kind, 'status', NEW.status, 'slug', NEW.slug)
    );
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS contributor_posts_admin_notify ON public.contributor_posts;
CREATE TRIGGER contributor_posts_admin_notify
AFTER UPDATE ON public.contributor_posts
FOR EACH ROW EXECUTE FUNCTION public.contributor_post_admin_notify();