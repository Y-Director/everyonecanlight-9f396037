import { resolveOperator } from './operator.ts'
import { sendTemplate } from './activity.ts'

// Sends the rental confirmation email once per reservation.
// deno-lint-ignore no-explicit-any
export const sendConfirmationEmail = async (supabase: any, reservationId: string) => {
  try {
    const { data: r } = await supabase
      .from('rental_reservations')
      .select(
        'id, reference, booking_code, contact_name, contact_email, items, days, start_date, end_date, location, call_time, total, confirmation_sent_at, runner_id, rental_customers(full_name, email)',
      )
      .eq('id', reservationId)
      .maybeSingle()

    if (!r || r.confirmation_sent_at) return false

    const to = String(r.contact_email ?? r.rental_customers?.email ?? '').trim().toLowerCase()
    if (!to) {
      console.error('No recipient email on reservation', reservationId)
      return false
    }

    const operator = await resolveOperator(supabase, r.runner_id)

    const ok = await sendTemplate('booking-confirmation', to, `booking-confirmation-${r.id}`, {
      customerName: r.contact_name ?? r.rental_customers?.full_name ?? null,
      bookingCode: r.booking_code,
      reference: r.reference,
      items: r.items ?? [],
      days: r.days,
      startDate: r.start_date,
      endDate: r.end_date,
      location: r.location,
      callTime: r.call_time,
      total: r.total,
      operatorName: operator?.name ?? null,
      operatorPhone: operator?.phone ?? null,
    })
    if (!ok) return false

    await supabase
      .from('rental_reservations')
      .update({ confirmation_sent_at: new Date().toISOString() })
      .eq('id', r.id)
    return true
  } catch (e) {
    console.error('sendConfirmationEmail error', e)
    return false
  }
}