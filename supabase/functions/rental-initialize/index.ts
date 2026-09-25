import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { qualifiesForPerks } from '../_shared/rentalPerks.ts'

import { PRICES } from '../_shared/rentalPrices.ts'

const LOCATIONS = ['Lagos Island', 'Lagos Mainland', 'Outside Lagos']

// Unambiguous alphabet (no I, O, 0, 1) for human-readable booking references.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const makeBookingCode = (len = 8) => {
  const bytes = crypto.getRandomValues(new Uint8Array(len))
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const customerId = String(body.customerId ?? '')
    const days = Math.max(1, Math.min(60, parseInt(String(body.days ?? '1'), 10) || 1))
    const location = String(body.location ?? '')
    const callTime = String(body.callTime ?? '')
    const startDate = body.startDate ? String(body.startDate) : null
    const endDate = body.endDate ? String(body.endDate) : null
    const callbackUrl = String(body.callbackUrl ?? '').trim()
    const rawItems = Array.isArray(body.items) ? body.items : []

    if (!customerId || !LOCATIONS.includes(location) || !/^\d{2}:\d{2}$/.test(callTime)) {
      return json({ error: 'Missing or invalid reservation details.' }, 400)
    }

    const items = rawItems
      .map((i: Record<string, unknown>) => {
        const id = String(i?.id ?? '')
        const qty = Math.max(0, Math.min(50, parseInt(String(i?.qty ?? '0'), 10) || 0))
        const price = PRICES[id]
        if (!price || qty < 1) return null
        return { id, name: String(i?.name ?? id).slice(0, 200), qty, price, lineTotal: price * qty * days }
      })
      .filter(Boolean) as { id: string; name: string; qty: number; price: number; lineTotal: number }[]

    if (items.length === 0) return json({ error: 'Your gear list is empty.' }, 400)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: customer } = await supabase
      .from('rental_customers')
      .select('id, email, full_name, phone, kyc_status')
      .eq('id', customerId)
      .maybeSingle()

    if (!customer) return json({ error: 'Customer not found.' }, 404)
    if (customer.kyc_status !== 'verified') {
      return json({ error: 'Your identity verification is still under review.' }, 403)
    }

    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0)
    const total = subtotal
    const reference = `ECLR-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`

    // Booking code, retried on the (very unlikely) unique-index collision.
    let bookingCode = makeBookingCode()
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: clash } = await supabase
        .from('rental_reservations')
        .select('id')
        .eq('booking_code', bookingCode)
        .maybeSingle()
      if (!clash) break
      bookingCode = makeBookingCode()
    }

    // Lighting Operators only follow the gear once the rental qualifies for perks.
    let runnerId: string | null = null
    if (qualifiesForPerks(total)) {
      // Only assign operators that exist as active Lighting Operators in Team Members.
      const { data: operators } = await supabase
        .from('staff_members')
        .select('runner_id')
        .eq('is_light_operator', true)
        .eq('status', 'active')
        .not('runner_id', 'is', null)
        .order('created_at', { ascending: true })
      runnerId = operators && operators.length
        ? operators[Math.floor(Math.random() * operators.length)].runner_id
        : null
    }

    const { error: insertError } = await supabase.from('rental_reservations').insert({
      reference,
      booking_code: bookingCode,
      customer_id: customer.id,
      contact_name: customer.full_name,
      contact_email: customer.email,
      contact_phone: customer.phone,
      items,
      days,
      start_date: startDate,
      end_date: endDate,
      location,
      call_time: callTime,
      subtotal,
      total,
      status: 'pending',
      runner_id: runnerId,
      terms_accepted_at: new Date().toISOString(),
    })
    if (insertError) throw insertError

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!secret) return json({ error: 'Payment is not configured.' }, 500)

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: customer.email,
        amount: total * 100,
        currency: 'NGN',
        reference,
        callback_url: callbackUrl || undefined,
        metadata: { product: 'ECL Light Bank Rental', days, location, call_time: callTime },
      }),
    })
    const data = await res.json()
    if (!res.ok || !data?.status) {
      console.error('Paystack init failed', res.status, data)
      return json({ error: data?.message ?? 'Could not start payment' }, 502)
    }

    return json({
      authorization_url: data.data.authorization_url,
      reference,
      bookingCode,
      total,
    })
  } catch (e) {
    console.error('rental-initialize error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})