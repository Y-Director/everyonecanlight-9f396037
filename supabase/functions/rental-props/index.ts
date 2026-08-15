import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { normaliseCode, normaliseEmail } from '../_shared/rentalBooking.ts'
import { FREE_PROP_LIMIT, PERK_THRESHOLD, qualifiesForPerks } from '../_shared/rentalPerks.ts'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

type PropRow = {
  id: string
  name: string
  unit_label: string
  image_url: string
  status: string
  price_naira: number
  reservation_id: string | null
}

type ClaimedProp = { id: string; name: string; unit_label: string; image_url: string; free?: boolean; price?: number }

/** Free slots go to the most expensive props first, so the customer keeps the biggest saving. */
const splitFreeAndPaid = (rows: PropRow[], freeSlots: number) => {
  const byValue = [...rows].sort((a, b) => Number(b.price_naira) - Number(a.price_naira))
  const free = byValue.slice(0, Math.max(0, freeSlots))
  const paid = byValue.slice(Math.max(0, freeSlots))
  const amount = paid.reduce((s, p) => s + Number(p.price_naira || 0), 0)
  return { free, paid, amount }
}

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
        .select('id, name, slug, unit_label, image_url, status, price_naira')
        .order('name', { ascending: true })
        .order('unit_label', { ascending: true })
      return data ?? []
    }

    if (action === 'list') {
      return json({ props: await listProps(), threshold: PERK_THRESHOLD, freeLimit: FREE_PROP_LIMIT })
    }

    if (action !== 'claim' && action !== 'confirm') return json({ error: 'Unknown action' }, 400)

    // --- Payment confirmation for paid extra props -------------------------
    if (action === 'confirm') {
      const reference = String(body.reference ?? '').trim()
      if (!reference) return json({ error: 'Missing payment reference.' }, 400)

      const { data: charge } = await supabase
        .from('prop_charges')
        .select('id, reservation_id, reference, prop_ids, amount, status')
        .eq('reference', reference)
        .maybeSingle()
      if (!charge) return json({ error: 'Payment reference not found.' }, 404)

      if (charge.status !== 'paid') {
        const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
        if (!secret) return json({ error: 'Payment is not configured.' }, 500)
        const verifyRes = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
          { headers: { Authorization: `Bearer ${secret}` } },
        )
        const verify = await verifyRes.json()
        if (!verifyRes.ok || verify?.data?.status !== 'success') {
          return json({ error: 'This prop payment has not gone through yet.' }, 402)
        }
        await supabase
          .from('prop_charges')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('id', charge.id)
      }

      const { data: reservation } = await supabase
        .from('rental_reservations')
        .select('id, booking_code, props')
        .eq('id', charge.reservation_id)
        .maybeSingle()
      if (!reservation) return json({ error: 'Booking not found.' }, 404)

      const propIds = (charge.prop_ids ?? []).map(String)
      const existing = (Array.isArray(reservation.props) ? reservation.props : []) as ClaimedProp[]
      const freeUsed = existing.filter((p) => p?.free).length

      const { data: rows } = await supabase
        .from('prop_items')
        .select('id, name, unit_label, image_url, status, price_naira, reservation_id')
        .in('id', propIds)
      const wanted = (rows ?? []) as PropRow[]

      const { free } = splitFreeAndPaid(wanted, FREE_PROP_LIMIT - freeUsed)
      const freeIds = new Set(free.map((p) => p.id))

      await supabase
        .from('prop_items')
        .update({ status: 'rented_out', reservation_id: reservation.id })
        .in('id', propIds)

      const merged: ClaimedProp[] = [
        ...existing.filter((p) => !propIds.includes(String(p?.id))),
        ...wanted.map((p) => ({
          id: p.id,
          name: p.name,
          unit_label: p.unit_label,
          image_url: p.image_url,
          free: freeIds.has(p.id),
          price: freeIds.has(p.id) ? 0 : Number(p.price_naira || 0),
        })),
      ]

      await supabase.from('rental_reservations').update({ props: merged }).eq('id', reservation.id)

      return json({
        paid: true,
        props: await listProps(),
        booking: { code: reservation.booking_code, props: merged },
      })
    }

    const bookingCode = normaliseCode(body.bookingCode)
    const email = normaliseEmail(body.email)
    const propIds: string[] = Array.isArray(body.propIds) ? body.propIds.map(String) : []
    const callbackUrl = String(body.callbackUrl ?? '').trim()

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
      .select('id, name, unit_label, image_url, status, price_naira, reservation_id')
      .in('id', propIds)

    const rows = (wanted ?? []) as PropRow[]
    if (rows.length !== propIds.length) return json({ error: 'Some props are no longer listed.' }, 409)

    const taken = rows.filter((p) => p.status !== 'in_bank' && p.reservation_id !== reservation.id)
    if (taken.length) {
      return json(
        { error: `${taken.map((p) => `${p.name} (${p.unit_label})`).join(', ')} just got rented out.` },
        409,
      )
    }

    const freeUsed = (existing as ClaimedProp[]).filter((p) => p?.free).length
    const { free, paid, amount } = splitFreeAndPaid(rows, FREE_PROP_LIMIT - freeUsed)
    const freeIds = new Set(free.map((p) => p.id))

    // Extra props beyond the free allowance are paid for before they are held.
    if (amount > 0) {
      const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
      if (!secret) return json({ error: 'Payment is not configured.' }, 500)

      const reference = `ECLP-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
      const { error: chargeError } = await supabase.from('prop_charges').insert({
        reservation_id: reservation.id,
        reference,
        prop_ids: propIds,
        amount,
        status: 'pending',
      })
      if (chargeError) throw chargeError

      const payRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: reservation.contact_email,
          amount: amount * 100,
          currency: 'NGN',
          reference,
          callback_url: callbackUrl || undefined,
          metadata: { product: 'ECL Light Bank Props', booking_code: bookingCode },
        }),
      })
      const payData = await payRes.json()
      if (!payRes.ok || !payData?.status) {
        console.error('Paystack props init failed', payRes.status, payData)
        return json({ error: payData?.message ?? 'Could not start payment' }, 502)
      }

      return json({
        requiresPayment: true,
        amount,
        reference,
        authorization_url: payData.data.authorization_url,
        freeCount: free.length,
        paidCount: paid.length,
      })
    }

    const { error: claimError } = await supabase
      .from('prop_items')
      .update({ status: 'rented_out', reservation_id: reservation.id })
      .in('id', propIds)
    if (claimError) throw claimError

    const merged = [
      ...existing.filter((p: { id?: string }) => !propIds.includes(String(p?.id))),
      ...rows.map((p) => ({
        id: p.id,
        name: p.name,
        unit_label: p.unit_label,
        image_url: p.image_url,
        free: freeIds.has(p.id),
        price: freeIds.has(p.id) ? 0 : Number(p.price_naira || 0),
      })),
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