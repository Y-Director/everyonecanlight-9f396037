CREATE OR REPLACE FUNCTION public.rental_next_available()
RETURNS TABLE(item_id text, available_from date)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT i->>'id' AS item_id,
         (MIN(COALESCE(r.end_date, r.start_date + GREATEST(r.days,1) - 1, CURRENT_DATE)) + 1)::date AS available_from
  FROM public.rental_reservations r, jsonb_array_elements(r.items) i
  WHERE r.fulfilment_status = 'rented_out'
     OR (r.status = 'confirmed' AND r.fulfilment_status NOT IN ('returned')
         AND r.start_date <= CURRENT_DATE AND COALESCE(r.end_date, r.start_date) >= CURRENT_DATE)
  GROUP BY i->>'id'
$$;
GRANT EXECUTE ON FUNCTION public.rental_next_available() TO anon, authenticated;