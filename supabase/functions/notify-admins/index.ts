import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { logActivity, sendTemplate, type Severity } from '../_shared/activity.ts'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const CUSTOMER_TEMPLATES = ['identity-approved', 'identity-rejected', 'payment-issue']

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return json({ error: 'Unauthorized' }, 401)

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Either an internal service-role call, or a signed-in active admin.
    let actorEmail: string | null = null
    const isService = token === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!isService) {
      const { data, error } = await admin.auth.getClaims(token)
      const email = (data?.claims as { email?: string } | undefined)?.email
      if (error || !email) return json({ error: 'Unauthorized' }, 401)
      const { data: account } = await admin
        .from('admin_accounts')
        .select('email, status')
        .ilike('email', email)
        .maybeSingle()
      if (!account || account.status !== 'active') return json({ error: 'Forbidden' }, 403)
      actorEmail = account.email
    }

    const body = await req.json().catch(() => ({}))
    const category = String(body.category ?? '').trim().slice(0, 40)
    const event = String(body.event ?? '').trim().slice(0, 60)
    const title = String(body.title ?? '').trim().slice(0, 160)
    if (!category || !event || !title) return json({ error: 'category, event and title are required' }, 400)

    const severity = (['info', 'warning', 'critical'].includes(String(body.severity))
      ? String(body.severity)
      : 'info') as Severity

    const rawLines = Array.isArray(body.lines) ? body.lines.slice(0, 12) : []
    const lines = rawLines
      .map((l: Record<string, unknown>) => ({
        label: String(l?.label ?? '').slice(0, 60),
        value: String(l?.value ?? '').slice(0, 200),
      }))
      .filter((l: { label: string }) => l.label)

    const logId = await logActivity(admin, {
      category,
      event,
      title,
      summary: body.summary ? String(body.summary).slice(0, 600) : null,
      severity,
      actorEmail: actorEmail ?? (body.actorEmail ? String(body.actorEmail) : null),
      entityType: body.entityType ? String(body.entityType).slice(0, 40) : null,
      entityId: body.entityId ? String(body.entityId).slice(0, 80) : null,
      lines,
      metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : {},
    })

    // Optional customer-facing email (identity decisions, payment issues).
    let customerEmailed = false
    const customer = body.customer
    if (customer && typeof customer === 'object') {
      const to = String(customer.email ?? '').trim().toLowerCase()
      const templateName = String(customer.templateName ?? '')
      const ok =
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to) && CUSTOMER_TEMPLATES.includes(templateName)
      if (ok) {
        customerEmailed = await sendTemplate(
          templateName,
          to,
          String(customer.idempotencyKey ?? `${templateName}-${logId ?? crypto.randomUUID()}`),
          typeof customer.templateData === 'object' && customer.templateData
            ? customer.templateData
            : {},
        )
      }
    }

    return json({ ok: true, logId, customerEmailed })
  } catch (e) {
    console.error('notify-admins error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})