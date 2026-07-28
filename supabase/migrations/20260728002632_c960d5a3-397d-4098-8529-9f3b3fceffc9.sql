-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- One-time email codes
CREATE TABLE public.rental_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  phone text,
  code_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.rental_otps TO service_role;
ALTER TABLE public.rental_otps ENABLE ROW LEVEL SECURITY;
CREATE INDEX rental_otps_email_idx ON public.rental_otps (email, created_at DESC);

CREATE POLICY "Service role manages rental otps"
  ON public.rental_otps FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Booking reference + contact snapshot on reservations
ALTER TABLE public.rental_reservations
  ADD COLUMN IF NOT EXISTS booking_code text,
  ADD COLUMN IF NOT EXISTS contact_name text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS summary_image_path text,
  ADD COLUMN IF NOT EXISTS confirmation_sent_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS rental_reservations_booking_code_key
  ON public.rental_reservations (booking_code) WHERE booking_code IS NOT NULL;

-- Admin read access to rental data for the dashboard
CREATE POLICY "Admins can view reservations"
  ON public.rental_reservations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view rental customers"
  ON public.rental_customers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view runners"
  ON public.runners FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.rental_reservations TO authenticated;
GRANT SELECT ON public.rental_customers TO authenticated;
GRANT SELECT ON public.runners TO authenticated;

-- Lock the private KYC ID bucket to admins only
CREATE POLICY "Admins can read KYC IDs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'kyc-ids' AND public.has_role(auth.uid(), 'admin'));