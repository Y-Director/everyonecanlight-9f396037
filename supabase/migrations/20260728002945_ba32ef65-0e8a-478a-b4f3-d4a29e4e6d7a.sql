GRANT SELECT ON public.rental_reservations TO authenticated;
GRANT SELECT ON public.rental_customers TO authenticated;
GRANT SELECT ON public.runners TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.rental_reservations TO service_role;
GRANT ALL ON public.rental_customers TO service_role;
GRANT ALL ON public.runners TO service_role;
GRANT ALL ON public.user_roles TO service_role;