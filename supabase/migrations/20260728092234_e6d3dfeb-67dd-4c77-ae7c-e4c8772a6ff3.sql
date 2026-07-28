ALTER TABLE public.rental_reservations
  ADD COLUMN IF NOT EXISTS amount_paid integer NOT NULL DEFAULT 0;

UPDATE public.rental_reservations SET amount_paid = total WHERE status = 'confirmed' AND amount_paid = 0;

CREATE TABLE IF NOT EXISTS public.rental_amendments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES public.rental_reservations(id) ON DELETE CASCADE,
  reference text NOT NULL UNIQUE,
  added_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  removed_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  amount integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.rental_amendments TO service_role;
GRANT SELECT ON public.rental_amendments TO authenticated;

ALTER TABLE public.rental_amendments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages rental amendments"
  ON public.rental_amendments FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Rental admins can view amendments"
  ON public.rental_amendments FOR SELECT TO authenticated
  USING (app_private.admin_has_section(auth.uid(), 'rentals'));

CREATE INDEX IF NOT EXISTS rental_amendments_reservation_idx ON public.rental_amendments(reservation_id);

CREATE TRIGGER update_rental_amendments_updated_at
  BEFORE UPDATE ON public.rental_amendments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();