CREATE TABLE public.contributor_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.contributor_profiles TO authenticated;
GRANT ALL ON public.contributor_profiles TO service_role;
ALTER TABLE public.contributor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contributors read own profile" ON public.contributor_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contributors insert own profile" ON public.contributor_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Contributors update own profile" ON public.contributor_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.contributor_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'article' CHECK (kind IN ('article','course')),
  slug TEXT UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','needs_revision')),
  review_note TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX contributor_posts_author_idx ON public.contributor_posts(author_id);
CREATE INDEX contributor_posts_status_idx ON public.contributor_posts(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contributor_posts TO authenticated;
GRANT SELECT ON public.contributor_posts TO anon;
GRANT ALL ON public.contributor_posts TO service_role;
ALTER TABLE public.contributor_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published posts" ON public.contributor_posts FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Authors read own posts" ON public.contributor_posts FOR SELECT TO authenticated USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors create own posts" ON public.contributor_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own posts" ON public.contributor_posts FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Admins update any post" ON public.contributor_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors delete own posts" ON public.contributor_posts FOR DELETE TO authenticated USING (auth.uid() = author_id AND status <> 'published');

CREATE TABLE public.contributor_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX contributor_notifications_user_idx ON public.contributor_notifications(user_id, created_at DESC);
GRANT SELECT, UPDATE ON public.contributor_notifications TO authenticated;
GRANT ALL ON public.contributor_notifications TO service_role;
ALTER TABLE public.contributor_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON public.contributor_notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.contributor_notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM anon, authenticated;

CREATE TRIGGER contributor_posts_touch BEFORE UPDATE ON public.contributor_posts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER contributor_profiles_touch BEFORE UPDATE ON public.contributor_profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.increment_post_view(_slug TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.contributor_posts
  SET view_count = view_count + 1
  WHERE slug = _slug AND status = 'published';
END; $$;
REVOKE ALL ON FUNCTION public.increment_post_view(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_post_view(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.contributor_post_notify()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'published' THEN
      INSERT INTO public.contributor_notifications(user_id, kind, title, body)
      VALUES (NEW.author_id, 'published', 'Article published', NEW.title || ' is now live on Everyone Can Light.');
    ELSIF NEW.status = 'in_review' THEN
      INSERT INTO public.contributor_notifications(user_id, kind, title, body)
      VALUES (NEW.author_id, 'review', 'Submitted for review', NEW.title || ' is queued for editorial review.');
    ELSIF NEW.status = 'needs_revision' THEN
      INSERT INTO public.contributor_notifications(user_id, kind, title, body)
      VALUES (NEW.author_id, 'revision', 'Article needs review', COALESCE(NEW.review_note, 'An editor requested changes on ' || NEW.title));
    END IF;
  END IF;
  IF NEW.view_count >= 100 AND OLD.view_count < 100 THEN
    INSERT INTO public.contributor_notifications(user_id, kind, title, body)
    VALUES (NEW.author_id, 'milestone', '100 view milestone', NEW.title || ' just passed 100 views.');
  END IF;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.contributor_post_notify() FROM anon, authenticated;

CREATE TRIGGER contributor_posts_notify AFTER UPDATE ON public.contributor_posts
FOR EACH ROW EXECUTE FUNCTION public.contributor_post_notify();

CREATE POLICY "Public read contributor media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'contributor-media');
CREATE POLICY "Contributors upload own media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'contributor-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Contributors update own media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'contributor-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Contributors delete own media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'contributor-media' AND (storage.foldername(name))[1] = auth.uid()::text);