CREATE TABLE public.admin_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_super boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  sections text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_accounts TO authenticated;
GRANT ALL ON public.admin_accounts TO service_role;
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.course_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text,
  course_name text NOT NULL,
  amount integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  reference text,
  status text NOT NULL DEFAULT 'paid',
  purchased_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_purchases TO authenticated;
GRANT ALL ON public.course_purchases TO service_role;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER admin_accounts_updated_at BEFORE UPDATE ON public.admin_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER course_purchases_updated_at BEFORE UPDATE ON public.course_purchases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION app_private.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, app_private, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_accounts a
    JOIN auth.users u ON lower(u.email) = lower(a.email)
    WHERE u.id = _user_id AND a.is_super AND a.status = 'active'
  )
$$;

CREATE OR REPLACE FUNCTION app_private.admin_has_section(_user_id uuid, _section text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, app_private, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_accounts a
    JOIN auth.users u ON lower(u.email) = lower(a.email)
    WHERE u.id = _user_id
      AND a.status = 'active'
      AND (a.is_super OR _section = ANY(a.sections))
  )
$$;

CREATE POLICY "Super admin manages admin accounts" ON public.admin_accounts
FOR ALL TO authenticated
USING (app_private.is_super_admin(auth.uid()))
WITH CHECK (app_private.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view their own admin account" ON public.admin_accounts
FOR SELECT TO authenticated
USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

CREATE POLICY "Service role manages admin accounts" ON public.admin_accounts
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Course admins can view purchases" ON public.course_purchases
FOR SELECT TO authenticated
USING (app_private.admin_has_section(auth.uid(), 'courses'));

CREATE POLICY "Service role manages course purchases" ON public.course_purchases
FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view reservations" ON public.rental_reservations;
CREATE POLICY "Rental admins can view reservations" ON public.rental_reservations
FOR SELECT TO authenticated
USING (app_private.admin_has_section(auth.uid(), 'rentals'));

DROP POLICY IF EXISTS "Admins can view rental customers" ON public.rental_customers;
CREATE POLICY "Rental admins can view rental customers" ON public.rental_customers
FOR SELECT TO authenticated
USING (app_private.admin_has_section(auth.uid(), 'rentals'));

DROP POLICY IF EXISTS "Admins can update rental customers" ON public.rental_customers;
CREATE POLICY "Rental admins can update rental customers" ON public.rental_customers
FOR UPDATE TO authenticated
USING (app_private.admin_has_section(auth.uid(), 'rentals'))
WITH CHECK (app_private.admin_has_section(auth.uid(), 'rentals'));

DROP POLICY IF EXISTS "Admins can view runners" ON public.runners;
CREATE POLICY "Rental admins can view runners" ON public.runners
FOR SELECT TO authenticated
USING (app_private.admin_has_section(auth.uid(), 'rentals'));

DROP POLICY IF EXISTS "Admins can view masterclass registrations" ON public.masterclass_registrations;
CREATE POLICY "Masterclass admins can view registrations" ON public.masterclass_registrations
FOR SELECT TO authenticated
USING (app_private.admin_has_section(auth.uid(), 'masterclass'));

INSERT INTO public.admin_accounts (email, is_super, status, sections)
VALUES ('everyonecanlight@gmail.com', true, 'active', ARRAY['rentals','masterclass','courses'])
ON CONFLICT (email) DO UPDATE SET is_super = true, status = 'active';