CREATE TABLE public.prop_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  unit_label text,
  image_url text,
  status text NOT NULL DEFAULT 'in_bank' CHECK (status IN ('in_bank','rented_out')),
  reservation_id uuid REFERENCES public.rental_reservations(id) ON DELETE SET NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.prop_items TO anon;
GRANT SELECT ON public.prop_items TO authenticated;
GRANT ALL ON public.prop_items TO service_role;

ALTER TABLE public.prop_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Props catalogue is publicly viewable"
ON public.prop_items FOR SELECT
USING (true);

CREATE POLICY "Admins manage props"
ON public.prop_items FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_prop_items_updated_at
BEFORE UPDATE ON public.prop_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.rental_reservations
  ADD COLUMN IF NOT EXISTS terms_accepted_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS props jsonb NOT NULL DEFAULT '[]'::jsonb;