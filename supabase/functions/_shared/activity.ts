import { createClient } from 'npm:@supabase/supabase-js@2'
import { sendTemplateEmail } from './transactional-email-templates/send-email.ts'

// Shared activity-log + admin notification helper used by edge functions.
// Writes one row to public.activity_log and emails every active super admin
// (plus the acting admin, when there is one) using the admin-activity template.

export type Severity = 'info' | 'warning' | 'critical'

export interface ActivityEntry {
  category: string
  event: string
  title: string
  summary?: string | null
  severity?: Severity
  actorEmail?: string | null
  entityType?: string | null
  entityId?: string | null
  lines?: { label: string; value: string }[]
  // deno-lint-ignore no-explicit-any
  metadata?: Record<string, any>
  notify?: boolean
}

export const sendTemplate = async (
  templateName: string,
  recipientEmail: string,
  idempotencyKey: string,
  // deno-lint-ignore no-explicit-any
  templateData: Record<string, any>,
) => {
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const log = async (status: 'sent' | 'suppressed' | 'failed', error_message?: string) => {
    const { error } = await db.from('email_send_log').insert({
      message_id: null,
      template_name: templateName,
      recipient_email: recipientEmail,
      status,
      error_message: error_message ?? null,
    })
    if (error) console.error('email_send_log insert failed', error.code, error.message)
  }
  try {
    const result = await sendTemplateEmail(templateName, recipientEmail, { templateData, idempotencyKey })
    if (result.sent) {
      await log('sent')
      return true
    }
    await log('suppressed')
    return false
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('email failed', templateName, msg)
    await log('failed', msg.slice(0, 1000))
    return false
  }
}

// deno-lint-ignore no-explicit-any
export const logActivity = async (supabase: any, entry: ActivityEntry) => {
  const severity = entry.severity ?? 'info'
  const actor = entry.actorEmail ? String(entry.actorEmail).trim().toLowerCase() : null
  let recipients: string[] = []

  try {
    const { data: admins } = await supabase
      .from('admin_accounts')
      .select('email, is_super, status, sections')
      .eq('status', 'active')

    const all = (admins ?? []) as { email: string; is_super: boolean; sections: string[] | null }[]
    const supers = all.filter((a) => a.is_super).map((a) => a.email.toLowerCase())
    // Light House partners only hear about paid, confirmed rental bookings.
    const partners = entry.category === 'rentals' && entry.event === 'booking_confirmed'
      ? all.filter((a) => (a.sections ?? []).includes('rentals_partner')).map((a) => a.email.toLowerCase())
      : []
    const actorIsAdmin = actor && all.some((a) => a.email.toLowerCase() === actor)
    recipients = Array.from(new Set([...supers, ...partners, ...(actorIsAdmin ? [actor as string] : [])]))
  } catch (e) {
    console.error('logActivity: could not resolve admins', e)
  }

  let logId: string | null = null
  try {
    const { data } = await supabase
      .from('activity_log')
      .insert({
        category: entry.category,
        event: entry.event,
        title: entry.title,
        summary: entry.summary ?? null,
        severity,
        actor_email: actor,
        entity_type: entry.entityType ?? null,
        entity_id: entry.entityId ?? null,
        metadata: entry.metadata ?? {},
        notified_emails: entry.notify === false ? [] : recipients,
      })
      .select('id')
      .single()
    logId = data?.id ?? null
  } catch (e) {
    console.error('logActivity: insert failed', e)
  }

  if (entry.notify === false) return logId

  const occurredAt = new Date().toISOString().replace('T', ' ').slice(0, 16)
  await Promise.all(
    recipients.map((to) =>
      sendTemplate('admin-activity', to, `activity-${logId ?? crypto.randomUUID()}-${to}`, {
        title: entry.title,
        summary: entry.summary ?? null,
        category: entry.category,
        severity,
        actorEmail: actor ?? 'System',
        occurredAt,
        lines: entry.lines ?? [],
      }).catch((e) => console.error('activity email failed', to, e)),
    ),
  )

  return logId
}