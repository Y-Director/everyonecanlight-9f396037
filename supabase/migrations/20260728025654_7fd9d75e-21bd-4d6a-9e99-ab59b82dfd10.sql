CREATE TABLE public.staff_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  emergency_contact_name text,
  emergency_contact_phone text,
  unit text NOT NULL DEFAULT 'General Operations & Admin',
  position text NOT NULL DEFAULT 'Member',
  status text NOT NULL DEFAULT 'active',
  date_joined date NOT NULL DEFAULT CURRENT_DATE,
  avatar_url text,
  is_light_operator boolean NOT NULL DEFAULT false,
  runner_id uuid REFERENCES public.runners(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_members TO authenticated;
GRANT ALL ON public.staff_members TO service_role;

ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages staff members"
  ON public.staff_members FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Team admins can view staff members"
  ON public.staff_members FOR SELECT TO authenticated
  USING (app_private.is_super_admin(auth.uid()) OR app_private.admin_has_section(auth.uid(), 'team'));

CREATE POLICY "Super admin manages staff members"
  ON public.staff_members FOR ALL TO authenticated
  USING (app_private.is_super_admin(auth.uid()))
  WITH CHECK (app_private.is_super_admin(auth.uid()));

CREATE TRIGGER update_staff_members_updated_at
  BEFORE UPDATE ON public.staff_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.rental_reservations
  ADD COLUMN IF NOT EXISTS job_outcome text,
  ADD COLUMN IF NOT EXISTS damages_recorded boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS damages_notes text;

CREATE POLICY "Rental admins can update reservations outcome"
  ON public.rental_reservations FOR UPDATE TO authenticated
  USING (app_private.admin_has_section(auth.uid(), 'rentals'))
  WITH CHECK (app_private.admin_has_section(auth.uid(), 'rentals'));

WITH r AS (
  INSERT INTO public.runners (name, phone, active)
  VALUES ('Adeyinka Ibidapo', '+2348000000000', true)
  RETURNING id
)
INSERT INTO public.staff_members (full_name, email, phone, unit, position, status, is_light_operator, runner_id)
SELECT 'Adeyinka Ibidapo', 'adeyinka@everyonecanlight.com', '+2348000000000', 'Light Operations', 'Light Sultan', 'active', true, r.id FROM r;