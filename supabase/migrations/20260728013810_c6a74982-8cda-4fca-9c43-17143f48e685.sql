GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT ON public.rental_reservations TO authenticated;
GRANT ALL ON public.rental_reservations TO service_role;

GRANT SELECT, UPDATE ON public.rental_customers TO authenticated;
GRANT ALL ON public.rental_customers TO service_role;

GRANT SELECT ON public.runners TO authenticated;
GRANT ALL ON public.runners TO service_role;

GRANT SELECT ON public.masterclass_registrations TO authenticated;
GRANT ALL ON public.masterclass_registrations TO service_role;