ALTER TABLE public.rental_customers
  ADD COLUMN IF NOT EXISTS id_extracted jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS auto_decision text,
  ADD COLUMN IF NOT EXISTS auto_confidence numeric,
  ADD COLUMN IF NOT EXISTS id_expiry_date date,
  ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;

CREATE INDEX IF NOT EXISTS rental_otps_email_idx ON public.rental_otps (lower(email), created_at DESC);