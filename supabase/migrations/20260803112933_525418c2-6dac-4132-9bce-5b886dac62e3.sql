DROP POLICY IF EXISTS "Props catalogue is publicly viewable" ON public.prop_items;

CREATE OR REPLACE VIEW public.prop_items_public
WITH (security_invoker = on) AS
  SELECT id, name, slug, unit_label, image_url, status
  FROM public.prop_items;

CREATE POLICY "Public can view prop catalogue fields"
  ON public.prop_items FOR SELECT
  USING (true);

REVOKE ALL ON public.prop_items FROM anon, authenticated;
GRANT SELECT (id, name, slug, unit_label, image_url, status) ON public.prop_items TO anon, authenticated;
GRANT ALL ON public.prop_items TO service_role;
GRANT SELECT ON public.prop_items_public TO anon, authenticated;
GRANT ALL ON public.prop_items_public TO service_role;