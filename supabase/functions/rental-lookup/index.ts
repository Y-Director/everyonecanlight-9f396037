import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { EDIT_CUTOFF_HOURS, isEditable, normaliseCode, normaliseEmail, pickupAt } from '../_shared/rentalBooking.ts'
import { resolveOperator } from '../_shared/operator.ts'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const bookingCode = normaliseCode(body.bookingCode)
    const email = normaliseEmail(body.email)

    if (!/^[A-Z2-9]{6,12}$/.test(bookingCode) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ error: 'Enter a valid booking reference and the email you booked with.' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: reservation } = await supabase
      .from('rental_reservations')
      .select(
        'id, reference, booking_code, contact_name, contact_email, contact_phone, items, days, start_date, end_date, location, call_time, subtotal, total, amount_paid, status, paid_at, runner_id',
      )
      .eq('booking_code', bookingCode)
      .maybeSingle()

    if (!reservation || normaliseEmail(reservation.contact_email) !== email) {
      return json({ error: "We couldn't find a booking with those details." }, 404)
    }
    if (reservation.status !== 'confirmed') {
      return json({ error: 'This booking has not been paid for yet.' }, 409)
    }

    const { data: amendments } = await supabase
      .from('rental_amendments')
      .select('reference, added_items, removed_items, amount, status, paid_at, created_at')
      .eq('reservation_id', reservation.id)
      .eq('status', 'paid')
      .order('created_at', { ascending: true })

    const pickup = pickupAt(reservation.start_date, reservation.call_time)
    const operator = await resolveOperator(supabase, reservation.runner_id)

    return json({
      reservation: { ...reservation, id: undefined, runner_id: undefined, runners: operator },
      amendments: amendments ?? [],
      pickupAt: pickup ? pickup.toISOString() : null,
      editable: isEditable(reservation.start_date, reservation.call_time),
      cutoffHours: EDIT_CUTOFF_HOURS,
    })
  } catch (e) {
    console.error('rental-lookup error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})
