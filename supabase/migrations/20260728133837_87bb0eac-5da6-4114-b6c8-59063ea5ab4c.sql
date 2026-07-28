-- Reassign bookings held by placeholder operators to a real light operator (if any exists)
UPDATE public.rental_reservations res
SET runner_id = (
  SELECT s.runner_id FROM public.staff_members s
  WHERE s.runner_id IS NOT NULL AND s.is_light_operator AND s.status = 'active'
  ORDER BY s.created_at LIMIT 1
)
WHERE res.runner_id IS NOT NULL
  AND res.runner_id NOT IN (SELECT runner_id FROM public.staff_members WHERE runner_id IS NOT NULL);

-- Remove placeholder operators that are not linked to a team member
DELETE FROM public.runners r
WHERE r.id NOT IN (SELECT runner_id FROM public.staff_members WHERE runner_id IS NOT NULL);

-- Keep operator contact details in sync with the team member record
UPDATE public.runners r
SET name = s.full_name,
    phone = s.phone,
    active = (s.status = 'active' AND s.is_light_operator),
    updated_at = now()
FROM public.staff_members s
WHERE s.runner_id = r.id;