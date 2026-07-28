import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { PRICES } from '../_shared/rentalPrices.ts'
import { EDIT_CUTOFF_HOURS, isEditable, normaliseCode, normaliseEmail } from '../_shared/rentalBooking.ts'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

type Line = { id: string; name: string; qty: number; price: number; lineTotal: number }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const bookingCode = normaliseCode(body.bookingCode)
    const email = normaliseEmail(body.email)
    const callbackUrl = String(body.callbackUrl ?? '').trim()
    const rawItems = Array.isArray(body.items) ? body.items : []

    if (!/^[A-Z2-9]{6,12}$/.test(bookingCode) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ error: 'Invalid booking details.' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: reservation } = await supabase
      .from('rental_reservations')
      .select('id, reference, booking_code, contact_email, items, days, start_date, call_time, total, amount_paid, status')
      .eq('booking_code', bookingCode)
      .maybeSingle()

    if (!reservation || normaliseEmail(reservation.contact_email) !== email) {
      return json({ error: "We couldn't find a booking with those details." }, 404)
    }
    if (reservation.status !== 'confirmed') return json({ error: 'This booking is not confirmed.' }, 409)
    if (!isEditable(reservation.start_date, reservation.call_time)) {
      return json({ error: `Changes close ${EDIT_CUTOFF_HOURS} hours before your call time.` }, 403)
    }

    const days = Math.max(1, Number(reservation.days) || 1)

    const desired = rawItems
      .map((i: Record<string, unknown>) => {
        const id = String(i?.id ?? '')
        const qty = Math.max(0, Math.min(50, parseInt(String(i?.qty ?? '0'), 10) || 0))
        const price = PRICES[id]
        if (!price || qty < 1) return null
        return { id, name: String(i?.name ?? id).slice(0, 200), qty, price, lineTotal: price * qty * days }
      })
      .filter(Boolean) as Line[]

    if (desired.length === 0) return json({ error: 'Your gear list is empty.' }, 400)

    const original = (reservation.items ?? []) as Line[]
    const originalTotal = original.reduce((s, i) => s + (Number(i.lineTotal) || 0), 0)
    const newTotal = desired.reduce((s, i) => s + i.lineTotal, 0)

    const originalMap = new Map(original.map((i) => [i.id, i]))
    const desiredMap = new Map(desired.map((i) => [i.id, i]))

    const addedItems: Line[] = []
    const removedItems: Line[] = []
    for (const item of desired) {
      const before = originalMap.get(item.id)
      const deltaQty = item.qty - (before ? Number(before.qty) || 0 : 0)
      if (deltaQty > 0) {
        addedItems.push({ ...item, qty: deltaQty, lineTotal: item.price * deltaQty * days })
      }
    }
    for (const item of original) {
      const after = desiredMap.get(item.id)
      const deltaQty = (Number(item.qty) || 0) - (after ? after.qty : 0)
      if (deltaQty > 0) {
        const price = PRICES[item.id] ?? Number(item.price) ?? 0
        removedItems.push({ ...item, qty: deltaQty, price, lineTotal: price * deltaQty * days })
      }
    }

    if (addedItems.length === 0 && removedItems.length === 0) {
      return json({ error: 'Nothing has changed on this booking.' }, 400)
    }

    // Paid items cannot be dropped for a refund: any swap must be equal or higher value.
    if (newTotal < originalTotal) {
      return json(
        {
          error:
            'Swaps must be for gear of equal or higher value — paid items cannot be removed or refunded.',
        },
        400,
      )
    }

    const difference = newTotal - originalTotal
    const reference = `ECLA-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`

    const { error: insertError } = await supabase.from('rental_amendments').insert({
      reservation_id: reservation.id,
      reference,
      added_items: addedItems,
      removed_items: removedItems,
      amount: difference,
      status: difference === 0 ? 'paid' : 'pending',
      paid_at: difference === 0 ? new Date().toISOString() : null,
    })
    if (insertError) throw insertError

    // Equal-value swap: apply immediately, no payment needed.
    if (difference === 0) {
      const { error: updateError } = await supabase
        .from('rental_reservations')
        .update({ items: desired, subtotal: newTotal, total: newTotal })
        .eq('id', reservation.id)
      if (updateError) throw updateError
      return json({ applied: true, difference: 0, reference })
    }

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!secret) return json({ error: 'Payment is not configured.' }, 500)

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: reservation.contact_email,
        amount: difference * 100,
        currency: 'NGN',
        reference,
        callback_url: callbackUrl || undefined,
        metadata: { product: 'ECL Light Bank Rental — booking change', booking_code: bookingCode },
      }),
    })
    const data = await res.json()
    if (!res.ok || !data?.status) {
      console.error('Paystack amend init failed', res.status, data)
      return json({ error: data?.message ?? 'Could not start payment' }, 502)
    }

    // Stash the desired list so verification can apply it atomically after payment.
    await supabase
      .from('rental_amendments')
      .update({ added_items: addedItems, removed_items: removedItems })
      .eq('reference', reference)
    await supabase.from('rental_reservations').update({ updated_at: new Date().toISOString() }).eq('id', reservation.id)

    return json({
      authorization_url: data.data.authorization_url,
      reference,
      difference,
      newTotal,
    })
  } catch (e) {
    console.error('rental-amend-initialize error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})
