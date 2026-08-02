import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { normaliseCode, normaliseEmail } from '../_shared/rentalBooking.ts'
import { PERK_THRESHOLD, qualifiesForPerks } from '../_shared/rentalPerks.ts'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const action = String(body.action ?? 'list')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const listProps = async () => {
      const { data } = await supabase
        .from('prop_items')
        .select('id, name, slug, unit_label, image_url, status')
        .order('name', { ascending: true })
        .order('unit_label', { ascending: true })
      return data ?? []
    }

    if (action === 'list') {
      return json({ props: await listProps(), threshold: PERK_THRESHOLD })
    }

    if (action !== 'claim') return json({ error: 'Unknown action' }, 400)

    const bookingCode = normaliseCode(body.bookingCode)
    const email = normaliseEmail(body.email)
    const propIds: string[] = Array.isArray(body.propIds) ? body.propIds.map(String) : []

    if (!/^[A-Z2-9]{6,12}$/.test(bookingCode) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ error: 'Enter a valid booking reference and the email you booked with.' }, 400)
    }

    const { data: reservation } = await supabase
      .from('rental_reservations')
      .select('id, booking_code, contact_email, contact_name, total, status, props')
      .eq('booking_code', bookingCode)
      .maybeSingle()

    if (!reservation || normaliseEmail(reservation.contact_email) !== email) {
      return json({ error: "We couldn't find a booking with those details." }, 404)
    }
    if (reservation.status !== 'confirmed') {
      return json({ error: 'This booking has not been paid for yet.' }, 409)
    }
    if (!qualifiesForPerks(reservation.total)) {
      return json(
        { error: `Props are free on rentals of ₦${PERK_THRESHOLD.toLocaleString('en-NG')} and above.` },
        403,
      )
    }

    const existing = Array.isArray(reservation.props) ? reservation.props : []

    if (propIds.length === 0) {
      return json({ props: await listProps(), booking: { code: bookingCode, props: existing } })
    }

    const { data: wanted } = await supabase
      .from('prop_items')
      .select('id, name, unit_label, image_url, status, reservation_id')
      .in('id', propIds)

    const rows = wanted ?? []
    if (rows.length !== propIds.length) return json({ error: 'Some props are no longer listed.' }, 409)

    const taken = rows.filter((p) => p.status !== 'in_bank' && p.reservation_id !== reservation.id)
    if (taken.length) {
      return json(
        { error: `${taken.map((p) => `${p.name} (${p.unit_label})`).join(', ')} just got rented out.` },
        409,
      )
    }

    const { error: claimError } = await supabase
      .from('prop_items')
      .update({ status: 'rented_out', reservation_id: reservation.id })
      .in('id', propIds)
    if (claimError) throw claimError

    const merged = [
      ...existing.filter((p: { id?: string }) => !propIds.includes(String(p?.id))),
      ...rows.map((p) => ({ id: p.id, name: p.name, unit_label: p.unit_label, image_url: p.image_url })),
    ]

    const { error: resError } = await supabase
      .from('rental_reservations')
      .update({ props: merged })
      .eq('id', reservation.id)
    if (resError) throw resError

    return json({ props: await listProps(), booking: { code: bookingCode, props: merged } })
  } catch (e) {
    console.error('rental-props error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})