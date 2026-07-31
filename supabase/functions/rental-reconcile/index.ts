import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { logActivity, sendTemplate } from '../_shared/activity.ts'
import { sendConfirmationEmail } from '../_shared/bookingEmail.ts'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

// deno-lint-ignore no-explicit-any
const verifyPaystack = async (reference: string): Promise<{ paid: boolean; data: any }> => {
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
  if (!secret) return { paid: false, data: null }
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` } },
  )
  const data = await res.json().catch(() => null)
  return { paid: Boolean(res.ok && data?.status && data?.data?.status === 'success'), data }
}

// deno-lint-ignore no-explicit-any
const confirmReservation = async (supabase: any, reference: string, actorEmail: string | null) => {
  const { data: row } = await supabase
    .from('rental_reservations')
    .select('id, reference, booking_code, contact_email, contact_name, total, status')
    .eq('reference', reference)
    .maybeSingle()
  if (!row) return { fixed: false, reason: 'no_reservation' as const }

  if (row.status !== 'confirmed') {
    await supabase
      .from('rental_reservations')
      .update({ status: 'confirmed', paid_at: new Date().toISOString(), amount_paid: row.total })
      .eq('id', row.id)
  }
  const emailed = await sendConfirmationEmail(supabase, row.id)

  await supabase
    .from('payment_incidents')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: actorEmail ?? 'system',
      reservation_id: row.id,
    })
    .eq('reference', reference)

  return { fixed: true as const, emailed, reservationId: row.id, bookingCode: row.booking_code }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '').trim()
    if (!token) return json({ error: 'Unauthorized' }, 401)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    let actorEmail: string | null = null
    if (token !== Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
      const { data, error } = await supabase.auth.getClaims(token)
      const email = (data?.claims as { email?: string } | undefined)?.email
      if (error || !email) return json({ error: 'Unauthorized' }, 401)
      const { data: account } = await supabase
        .from('admin_accounts')
        .select('email, status, is_super, sections')
        .ilike('email', email)
        .maybeSingle()
      const allowed =
        account && account.status === 'active' &&
        (account.is_super || (account.sections ?? []).includes('rentals'))
      if (!allowed) return json({ error: 'Forbidden' }, 403)
      actorEmail = account.email
    }

    const body = await req.json().catch(() => ({}))
    const action = String(body.action ?? 'scan')

    if (action === 'scan') {
      const since = new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString()
      const { data: pending } = await supabase
        .from('rental_reservations')
        .select('id, reference, contact_email, contact_name, total, status, created_at')
        .neq('status', 'confirmed')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(40)

      let recovered = 0
      let flagged = 0

      for (const r of pending ?? []) {
        const { paid, data } = await verifyPaystack(r.reference)
        if (!paid) continue

        await supabase.from('payment_incidents').upsert(
          {
            kind: 'paid_booking_not_confirmed',
            reference: r.reference,
            email: r.contact_email,
            full_name: r.contact_name,
            amount: Math.round(Number(data?.data?.amount ?? r.total * 100) / 100),
            reservation_id: r.id,
            status: 'open',
            details: 'Paystack reports this payment as successful but the booking was not confirmed.',
          },
          { onConflict: 'reference' },
        )
        flagged++

        const fix = await confirmReservation(supabase, r.reference, actorEmail)
        if (fix.fixed) recovered++
      }

      if (flagged) {
        await logActivity(supabase, {
          category: 'payments',
          event: 'reconcile_scan',
          title: `Payment reconciliation recovered ${recovered} booking(s)`,
          summary: `${flagged} successful payment(s) had unconfirmed bookings. ${recovered} were repaired automatically.`,
          severity: recovered === flagged ? 'warning' : 'critical',
          actorEmail,
        })
      }

      const { data: incidents } = await supabase
        .from('payment_incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)

      return json({ scanned: (pending ?? []).length, flagged, recovered, incidents: incidents ?? [] })
    }

    if (action === 'fix') {
      const reference = String(body.reference ?? '').trim()
      if (!reference || reference.length > 120) return json({ error: 'Missing reference' }, 400)
      const { paid } = await verifyPaystack(reference)
      if (!paid) return json({ error: 'Paystack does not report this payment as successful.' }, 400)
      const fix = await confirmReservation(supabase, reference, actorEmail)
      if (!fix.fixed) return json({ error: 'No booking exists for this reference.' }, 404)
      await logActivity(supabase, {
        category: 'payments',
        event: 'incident_fixed',
        title: 'Payment issue resolved manually',
        summary: `Booking ${fix.bookingCode ?? reference} was confirmed and the customer notified.`,
        severity: 'info',
        actorEmail,
        entityType: 'rental_reservation',
        entityId: fix.reservationId,
        lines: [{ label: 'Payment reference', value: reference }],
      })
      return json({ ok: true, ...fix })
    }

    if (action === 'notify') {
      const id = String(body.incidentId ?? '')
      const { data: incident } = await supabase
        .from('payment_incidents')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (!incident?.email) return json({ error: 'No customer email on this issue.' }, 400)
      const ok = await sendTemplate('payment-issue', incident.email, `payment-issue-${incident.id}`, {
        customerName: incident.full_name,
        reference: incident.reference,
        amount: incident.amount,
      })
      if (!ok) return json({ error: 'Could not send the email.' }, 502)
      await supabase
        .from('payment_incidents')
        .update({ customer_notified_at: new Date().toISOString() })
        .eq('id', incident.id)
      return json({ ok: true })
    }

    if (action === 'resolve') {
      const id = String(body.incidentId ?? '')
      const { error } = await supabase
        .from('payment_incidents')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: actorEmail ?? 'system',
        })
        .eq('id', id)
      if (error) return json({ error: 'Could not update this issue.' }, 500)
      return json({ ok: true })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    console.error('rental-reconcile error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})