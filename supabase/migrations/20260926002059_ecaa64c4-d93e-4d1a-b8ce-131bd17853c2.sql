CREATE OR REPLACE FUNCTION public.rental_rented_out_counts()
RETURNS TABLE(item_id text, qty integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT i->>'id' AS item_id, SUM(COALESCE((i->>'qty')::int, 0))::int AS qty
  FROM public.rental_reservations r, jsonb_array_elements(r.items) i
  WHERE r.fulfilment_status = 'rented_out'
  GROUP BY i->>'id'
$$;
GRANT EXECUTE ON FUNCTION public.rental_rented_out_counts() TO anon, authenticated;