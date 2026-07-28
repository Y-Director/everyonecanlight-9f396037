ALTER TABLE public.rental_reservations
  ADD COLUMN IF NOT EXISTS fulfilment_status text NOT NULL DEFAULT 'awaiting_pickup',
  ADD COLUMN IF NOT EXISTS checked_out_at timestamptz,
  ADD COLUMN IF NOT EXISTS returned_at timestamptz;

ALTER TABLE public.rental_reservations
  DROP CONSTRAINT IF EXISTS rental_reservations_fulfilment_status_check;

ALTER TABLE public.rental_reservations
  ADD CONSTRAINT rental_reservations_fulfilment_status_check
  CHECK (fulfilment_status IN ('awaiting_pickup','rented_out','returned','attention_needed'));

CREATE INDEX IF NOT EXISTS rental_reservations_fulfilment_status_idx
  ON public.rental_reservations (fulfilment_status);