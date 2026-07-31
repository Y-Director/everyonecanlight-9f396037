import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { resolveOperator } from '../_shared/operator.ts'
import { logActivity, sendTemplate } from '../_shared/activity.ts'
import { sendConfirmationEmail } from '../_shared/bookingEmail.ts'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

// Paid-but-broken bookings: flag them, tell the customer, alert the admins.
// deno-lint-ignore no-explicit-any
const raiseIncident = async (
  // deno-lint-ignore no-explicit-any
  supabase: any,
  args: {
    reference: string
    kind: string
    details: string
    amount: number
    email?: string | null
    fullName?: string | null
    reservationId?: string | null
  },
) => {
  try {
    const { data: existing } = await supabase
      .from('payment_incidents')
      .select('id, customer_notified_at')
      .eq('reference', args.reference)
      .maybeSingle()

    const { data: incident } = await supabase
      .from('payment_incidents')
      .upsert(
        {
          kind: args.kind,
          reference: args.reference,
          email: args.email ?? null,
          full_name: args.fullName ?? null,
          amount: args.amount,
          reservation_id: args.reservationId ?? null,
          status: 'open',
          details: args.details,
        },
        { onConflict: 'reference' },
      )
      .select('id')
      .single()

    if (args.email && !existing?.customer_notified_at) {
      const sent = await sendTemplate('payment-issue', args.email, `payment-issue-${args.reference}`, {
        customerName: args.fullName ?? null,
        reference: args.reference,
        amount: args.amount,
      })
      if (sent && incident?.id) {
        await supabase
          .from('payment_incidents')
          .update({ customer_notified_at: new Date().toISOString() })
          .eq('id', incident.id)
      }
    }

    await logActivity(supabase, {
      category: 'payments',
      event: 'payment_issue',
      title: 'Payment received but booking did not complete',
      summary: args.details,
      severity: 'critical',
      entityType: 'payment_incident',
      entityId: incident?.id ?? null,
      lines: [
        { label: 'Payment reference', value: args.reference },
        { label: 'Customer', value: `${args.fullName ?? '—'} · ${args.email ?? 'no email'}` },
        { label: 'Amount', value: `NGN ${Number(args.amount).toLocaleString('en-NG')}` },
      ],
    })
  } catch (e) {
    console.error('raiseIncident failed', e)
  }
}

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
          'reference, booking_code, contact_name, contact_email, contact_phone, items, days, start_date, end_date, location, call_time, total, status, runner_id, rental_customers(full_name, email)',
        )
        .eq('id', amendment.reservation_id)
        .maybeSingle()

      const amendOperator = updated ? await resolveOperator(supabase, updated.runner_id) : null

      return json({
        paid,
        amendment: true,
        reservation: updated ? { ...updated, runner_id: undefined, runners: amendOperator } : updated,
      })
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
        .select('id, total, booking_code, contact_email, contact_name')
        .eq('reference', reference)
        .maybeSingle()
      if (row) {
        await supabase
          .from('rental_reservations')
          .update({ amount_paid: row.total })
          .eq('id', row.id)
        const emailed = await sendConfirmationEmail(supabase, row.id)
        if (!emailed) {
          await raiseIncident(supabase, {
            reference,
            kind: 'confirmation_email_failed',
            details:
              'Payment succeeded and the booking is confirmed, but the confirmation email could not be delivered.',
            amount: Math.round(Number(data?.data?.amount ?? row.total * 100) / 100),
            email: row.contact_email,
            fullName: row.contact_name,
            reservationId: row.id,
          })
        } else {
          await logActivity(supabase, {
            category: 'rentals',
            event: 'booking_confirmed',
            title: `Rental booking confirmed — ${row.booking_code ?? reference}`,
            summary: `${row.contact_name ?? 'A customer'} paid NGN ${Number(row.total).toLocaleString('en-NG')}.`,
            entityType: 'rental_reservation',
            entityId: row.id,
            lines: [
              { label: 'Booking reference', value: String(row.booking_code ?? reference) },
              { label: 'Customer', value: `${row.contact_name ?? '—'} · ${row.contact_email ?? '—'}` },
            ],
          })
        }
      } else {
        // Money in, no reservation row: the customer must not be left in the dark.
        const payer = data?.data?.customer
        await raiseIncident(supabase, {
          reference,
          kind: 'paid_without_reservation',
          details:
            'Paystack confirmed this payment but no rental reservation exists for the reference. Needs manual booking.',
          amount: Math.round(Number(data?.data?.amount ?? 0) / 100),
          email: payer?.email ?? null,
          fullName: [payer?.first_name, payer?.last_name].filter(Boolean).join(' ') || null,
        })
      }
    }

    const { data: reservation } = await supabase
      .from('rental_reservations')
      .select(
        'reference, booking_code, contact_name, contact_email, contact_phone, items, days, start_date, end_date, location, call_time, total, status, runner_id, rental_customers(full_name, email)',
      )
      .eq('reference', reference)
      .maybeSingle()

    const operator = reservation ? await resolveOperator(supabase, reservation.runner_id) : null

    return json({
      paid,
      reservation: reservation ? { ...reservation, runner_id: undefined, runners: operator } : reservation,
    })
  } catch (e) {
    console.error('rental-verify error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})