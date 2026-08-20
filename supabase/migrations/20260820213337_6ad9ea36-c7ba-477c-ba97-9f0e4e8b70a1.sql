DROP VIEW IF EXISTS public.prop_items_public;
CREATE VIEW public.prop_items_public
WITH (security_invoker = on) AS
  SELECT id, name, slug, unit_label, image_url, status, price_naira
  FROM public.prop_items;

GRANT SELECT ON public.prop_items_public TO anon, authenticated;
GRANT ALL ON public.prop_items_public TO service_role;

GRANT SELECT (id, name, slug, unit_label, image_url, status, price_naira) ON public.prop_items TO anon, authenticated;

CREATE POLICY "Public can view prop catalogue columns"
  ON public.prop_items FOR SELECT
  USING (true);