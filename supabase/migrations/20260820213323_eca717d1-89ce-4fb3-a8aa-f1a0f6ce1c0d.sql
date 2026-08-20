DROP POLICY IF EXISTS "Public can view prop catalogue fields" ON public.prop_items;

REVOKE ALL ON public.prop_items FROM anon, authenticated;
GRANT ALL ON public.prop_items TO service_role;

DROP VIEW IF EXISTS public.prop_items_public;
CREATE VIEW public.prop_items_public
WITH (security_invoker = off) AS
  SELECT id, name, slug, unit_label, image_url, status, price_naira
  FROM public.prop_items;

GRANT SELECT ON public.prop_items_public TO anon, authenticated;
GRANT ALL ON public.prop_items_public TO service_role;