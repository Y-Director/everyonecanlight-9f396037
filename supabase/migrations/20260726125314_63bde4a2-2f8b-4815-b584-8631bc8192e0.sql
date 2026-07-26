CREATE TABLE public.masterclass_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  whatsapp text NOT NULL,
  email text NOT NULL,
  background text NOT NULL,
  experience text NOT NULL,
  reference text NOT NULL UNIQUE,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.masterclass_registrations TO service_role;

ALTER TABLE public.masterclass_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages registrations"
ON public.masterclass_registrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_masterclass_registrations_updated_at
BEFORE UPDATE ON public.masterclass_registrations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();