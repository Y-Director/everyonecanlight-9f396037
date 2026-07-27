
CREATE TABLE public.runners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  avatar_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.runners TO service_role;
ALTER TABLE public.runners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages runners" ON public.runners FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.rental_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  id_type text,
  id_image_path text,
  kyc_status text NOT NULL DEFAULT 'pending',
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.rental_customers TO service_role;
ALTER TABLE public.rental_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages rental customers" ON public.rental_customers FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.rental_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.rental_customers(id) ON DELETE SET NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  days integer NOT NULL DEFAULT 1,
  start_date date,
  end_date date,
  location text NOT NULL,
  call_time text NOT NULL,
  subtotal integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  runner_id uuid REFERENCES public.runners(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.rental_reservations TO service_role;
ALTER TABLE public.rental_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages rental reservations" ON public.rental_reservations FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER update_runners_updated_at BEFORE UPDATE ON public.runners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rental_customers_updated_at BEFORE UPDATE ON public.rental_customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rental_reservations_updated_at BEFORE UPDATE ON public.rental_reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.runners (name, phone) VALUES
  ('Tunde Alabi', '+2348012345671'),
  ('Chinedu Okafor', '+2348012345672'),
  ('Grace Adeyemi', '+2348012345673');
