import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    let reference = url.searchParams.get('reference') ?? ''
    if (!reference && req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      reference = String(body.reference ?? '')
    }
    if (!reference || reference.length > 120) return json({ error: 'Missing reference' }, 400)

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY')!
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` } },
    )
    const data = await res.json()
    const paid = res.ok && data?.status && data?.data?.status === 'success'

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Amendment top-up payments carry their own reference and patch the existing booking.
    if (reference.startsWith('ECLA-')) {
      const { data: amendment } = await supabase
        .from('rental_amendments')
        .select('id, reservation_id, added_items, removed_items, amount, status')
        .eq('reference', reference)
        .maybeSingle()

      if (!amendment) return json({ paid: false, reservation: null })

      if (paid && amendment.status !== 'paid') {
        const { data: booking } = await supabase
          .from('rental_reservations')
          .select('id, items, total, amount_paid')
          .eq('id', amendment.reservation_id)
          .maybeSingle()

        if (booking) {
          type Line = { id: string; name: string; qty: number; price: number; lineTotal: number }
          const merged = new Map<string, Line>()
          for (const i of (booking.items ?? []) as Line[]) merged.set(i.id, { ...i })
          for (const i of (amendment.removed_items ?? []) as Line[]) {
            const cur = merged.get(i.id)
            if (!cur) continue
            const qty = Number(cur.qty) - Number(i.qty)
            if (qty > 0) {
              merged.set(i.id, { ...cur, qty, lineTotal: (Number(cur.lineTotal) / Number(cur.qty)) * qty })
            } else merged.delete(i.id)
          }
          for (const i of (amendment.added_items ?? []) as Line[]) {
            const cur = merged.get(i.id)
            if (cur) {
              merged.set(i.id, {
                ...cur,
                qty: Number(cur.qty) + Number(i.qty),
                lineTotal: Number(cur.lineTotal) + Number(i.lineTotal),
              })
            } else merged.set(i.id, { ...i })
          }
          const items = Array.from(merged.values())
          const newTotal = items.reduce((s, i) => s + (Number(i.lineTotal) || 0), 0)
          await supabase
            .from('rental_reservations')
            .update({
              items,
              subtotal: newTotal,
              total: newTotal,
              amount_paid: (Number(booking.amount_paid) || 0) + (Number(amendment.amount) || 0),
            })
            .eq('id', booking.id)
        }
      }

      await supabase
        .from('rental_amendments')
        .update({ status: paid ? 'paid' : 'failed', paid_at: paid ? new Date().toISOString() : null })
        .eq('id', amendment.id)

      const { data: updated } = await supabase
        .from('rental_reservations')
        .select(
          'reference, booking_code, contact_name, contact_email, contact_phone, items, days, start_date, end_date, location, call_time, total, status, runners(name, phone, avatar_url), rental_customers(full_name, email)',
        )
        .eq('id', amendment.reservation_id)
        .maybeSingle()

      return json({ paid, amendment: true, reservation: updated })
    }

    await supabase
      .from('rental_reservations')
      .update({
        status: paid ? 'confirmed' : 'failed',
        paid_at: paid ? new Date().toISOString() : null,
      })
      .eq('reference', reference)

    if (paid) {
      const { data: row } = await supabase
        .from('rental_reservations')
        .select('id, total')
        .eq('reference', reference)
        .maybeSingle()
      if (row) {
        await supabase
          .from('rental_reservations')
          .update({ amount_paid: row.total })
          .eq('id', row.id)
      }
    }

    const { data: reservation } = await supabase
      .from('rental_reservations')
      .select(
        'reference, booking_code, contact_name, contact_email, contact_phone, items, days, start_date, end_date, location, call_time, total, status, runners(name, phone, avatar_url), rental_customers(full_name, email)',
      )
      .eq('reference', reference)
      .maybeSingle()

    return json({ paid, reservation })
  } catch (e) {
    console.error('rental-verify error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})