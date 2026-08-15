ALTER TABLE public.prop_items ADD COLUMN IF NOT EXISTS price_naira integer NOT NULL DEFAULT 3000;

UPDATE public.prop_items SET price_naira = 5000 WHERE slug = 'table-lamp';
UPDATE public.prop_items SET price_naira = 12000 WHERE slug = 'standing-lamp';
UPDATE public.prop_items SET price_naira = 3000 WHERE slug IN ('grey-cylindrical-basket','wooden-rectangle-box','woven-rectangle-basket','mini-flower-pot','mini-chest-brown-box','wooden-soap-dispenser','pen-holder');

CREATE OR REPLACE VIEW public.prop_items_public
WITH (security_invoker = true)
AS SELECT id, name, slug, unit_label, image_url, status, price_naira FROM public.prop_items;

GRANT SELECT ON public.prop_items_public TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.prop_charges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id uuid NOT NULL REFERENCES public.rental_reservations(id) ON DELETE CASCADE,
  reference text NOT NULL UNIQUE,
  prop_ids uuid[] NOT NULL DEFAULT '{}',
  amount integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.prop_charges TO service_role;
ALTER TABLE public.prop_charges ENABLE ROW LEVEL SECURITY;