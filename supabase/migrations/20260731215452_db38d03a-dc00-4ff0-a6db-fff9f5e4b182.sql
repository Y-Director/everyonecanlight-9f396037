CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  event text NOT NULL,
  title text NOT NULL,
  summary text,
  severity text NOT NULL DEFAULT 'info',
  actor_email text,
  entity_type text,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  notified_emails text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity log"
ON public.activity_log FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.admin_accounts a
  WHERE lower(a.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
    AND a.status = 'active'
));

CREATE POLICY "Service role manages activity log"
ON public.activity_log FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE INDEX activity_log_created_at_idx ON public.activity_log (created_at DESC);
CREATE INDEX activity_log_category_idx ON public.activity_log (category);

CREATE TABLE public.payment_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  provider text NOT NULL DEFAULT 'paystack',
  reference text NOT NULL,
  email text,
  full_name text,
  amount integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  reservation_id uuid REFERENCES public.rental_reservations(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'open',
  details text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  customer_notified_at timestamp with time zone,
  resolved_at timestamp with time zone,
  resolved_by text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX payment_incidents_reference_key ON public.payment_incidents (reference);

GRANT SELECT ON public.payment_incidents TO authenticated;
GRANT ALL ON public.payment_incidents TO service_role;

ALTER TABLE public.payment_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment incidents"
ON public.payment_incidents FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.admin_accounts a
  WHERE lower(a.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
    AND a.status = 'active'
));

CREATE POLICY "Service role manages payment incidents"
ON public.payment_incidents FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE TRIGGER update_payment_incidents_updated_at
BEFORE UPDATE ON public.payment_incidents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();