import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { isValidEmail, suggestEmail } from '../_shared/emailHygiene.ts'
import { decideId, extractId, type IdKind } from '../_shared/idVerify.ts'
import { logActivity, sendTemplate } from '../_shared/activity.ts'

const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const normalizePhone = (raw: string) => {
  const digits = String(raw ?? '').replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('0')) return `+234${digits.slice(1)}`
  return `+${digits}`
}

const ID_TYPES: IdKind[] = ['Passport', 'Drivers License', 'NIN']
const OTP_TTL_MINUTES = 10
const VERIFICATION_WINDOW_HOURS = 12

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const constantEquals = (a: string, b: string) => {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// deno-lint-ignore no-explicit-any
const emailIsVerified = async (supabase: any, email: string) => {
  const since = new Date(Date.now() - VERIFICATION_WINDOW_HOURS * 3600 * 1000).toISOString()
  const { data } = await supabase
    .from('rental_otps')
    .select('id')
    .eq('email', email)
    .not('consumed_at', 'is', null)
    .gte('consumed_at', since)
    .limit(1)
  return Boolean(data && data.length > 0)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const action = String(body.action ?? '')
    const supabase = admin()

    // ---------------------------------------------------------------- OTP send
    if (action === 'otp-send') {
      const email = String(body.email ?? '').trim().toLowerCase()
      if (!isValidEmail(email)) {
        return json({ error: 'Enter a valid email address.', suggestion: suggestEmail(email) }, 400)
      }

      const hourAgo = new Date(Date.now() - 3600 * 1000).toISOString()
      const { count } = await supabase
        .from('rental_otps')
        .select('id', { count: 'exact', head: true })
        .eq('email', email)
        .gte('created_at', hourAgo)
      if ((count ?? 0) >= 5) {
        return json({ error: 'Too many codes requested. Please try again in an hour.' }, 429)
      }

      const code = String(Math.floor(100000 + Math.random() * 900000))
      const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString()
      const { error } = await supabase.from('rental_otps').insert({
        email,
        phone: body.phone ? normalizePhone(body.phone) : null,
        code_hash: await sha256(code),
        expires_at: expiresAt,
      })
      if (error) throw error

      const sent = await sendTemplate('rental-otp', email, `rental-otp-${email}-${Date.now()}`, {
        code,
        minutes: OTP_TTL_MINUTES,
      })
      if (!sent) return json({ error: 'We could not send the code. Please try again.' }, 502)

      return json({ sent: true, expiresAt, minutes: OTP_TTL_MINUTES })
    }

    // -------------------------------------------------------------- OTP verify
    if (action === 'otp-verify') {
      const email = String(body.email ?? '').trim().toLowerCase()
      const code = String(body.code ?? '').replace(/\D/g, '')
      if (!isValidEmail(email) || code.length !== 6) {
        return json({ error: 'Enter the 6-digit code we emailed you.' }, 400)
      }

      const { data: rows } = await supabase
        .from('rental_otps')
        .select('id, code_hash, attempts, expires_at, consumed_at')
        .eq('email', email)
        .is('consumed_at', null)
        .order('created_at', { ascending: false })
        .limit(1)

      const row = rows?.[0]
      if (!row) return json({ error: 'Request a new code to continue.' }, 400)
      if (new Date(row.expires_at).getTime() < Date.now()) {
        return json({ error: 'That code has expired. Request a new one.' }, 400)
      }
      if ((row.attempts ?? 0) >= 5) {
        return json({ error: 'Too many wrong attempts. Request a new code.' }, 429)
      }

      const hash = await sha256(code)
      if (!constantEquals(hash, String(row.code_hash))) {
        await supabase
          .from('rental_otps')
          .update({ attempts: (row.attempts ?? 0) + 1 })
          .eq('id', row.id)
        return json({ error: 'That code is not correct. Check your email and try again.' }, 400)
      }

      const now = new Date().toISOString()
      await supabase.from('rental_otps').update({ consumed_at: now }).eq('id', row.id)
      await supabase
        .from('rental_customers')
        .update({ email_verified_at: now })
        .ilike('email', email)

      return json({ verified: true })
    }

    if (action === 'check') {
      const rawEmail = String(body.email ?? '').trim().toLowerCase()
      if (rawEmail) {
        if (!isValidEmail(rawEmail)) return json({ error: 'Invalid email' }, 400)
        if (!(await emailIsVerified(supabase, rawEmail))) {
          return json({ error: 'Verify this email address first.' }, 403)
        }
        const { data } = await supabase
          .from('rental_customers')
          .select('id, full_name, phone, kyc_status, rejection_reason')
          .ilike('email', rawEmail)
          .maybeSingle()
        return json({
          returning: Boolean(data),
          verified: data?.kyc_status === 'verified',
          status: data?.kyc_status ?? null,
          rejectionReason: data?.rejection_reason ?? null,
          customerId: data?.id ?? null,
          fullName: data?.full_name ?? null,
          phone: data?.phone ?? null,
        })
      }
      const phone = normalizePhone(body.phone)
      if (phone.length < 8 || phone.length > 20) return json({ error: 'Invalid phone number' }, 400)
      const { data } = await supabase
        .from('rental_customers')
        .select('id, full_name, kyc_status')
        .eq('phone', phone)
        .maybeSingle()
      return json({
        returning: Boolean(data),
        verified: data?.kyc_status === 'verified',
        fullName: data?.full_name ?? null,
      })
    }

    if (action === 'status') {
      const email = String(body.email ?? '').trim().toLowerCase()
      if (!isValidEmail(email)) return json({ error: 'Invalid email' }, 400)
      if (!(await emailIsVerified(supabase, email))) {
        return json({ error: 'Verify this email address first.' }, 403)
      }
      const { data } = await supabase
        .from('rental_customers')
        .select('id, kyc_status, rejection_reason')
        .ilike('email', email)
        .maybeSingle()
      return json({
        customerId: data?.id ?? null,
        status: data?.kyc_status ?? null,
        rejectionReason: data?.rejection_reason ?? null,
      })
    }

    if (action === 'submit') {
      const fullName = String(body.fullName ?? '').trim()
      const email = String(body.email ?? '').trim()
      const phone = normalizePhone(body.phone)
      const idType = body.idType ? (String(body.idType).trim() as IdKind) : null
      const idImage = body.idImage ? String(body.idImage) : null // data URL
      const endDate = body.endDate ? String(body.endDate) : null

      if (!isValidEmail(email) || !fullName || fullName.length > 200 || phone.length < 8 || phone.length > 20) {
        return json({ error: 'Please check your name, phone number and email.' }, 400)
      }
      if (!(await emailIsVerified(supabase, email.toLowerCase()))) {
        return json({ error: 'Verify your email address before continuing.' }, 403)
      }

      const { data: existing } = await supabase
        .from('rental_customers')
        .select('id, kyc_status, id_image_path, id_type')
        .eq('phone', phone)
        .maybeSingle()

      const isFirstTime = !existing
      let idImagePath: string | null = existing?.id_image_path ?? null
      let decision = null as ReturnType<typeof decideId> | null

      if (isFirstTime) {
        if (!idType || !ID_TYPES.includes(idType)) {
          return json({ error: 'Select a valid government ID type.' }, 400)
        }
        if (!idImage || !idImage.startsWith('data:image/')) {
          return json({ error: 'Upload a clear image of your ID.' }, 400)
        }
        const match = idImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
        if (!match) return json({ error: 'Unsupported image format.' }, 400)
        const contentType = match[1]
        const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0))
        if (bytes.byteLength > 8 * 1024 * 1024) return json({ error: 'Image must be under 8MB.' }, 400)
        const ext = contentType.split('/')[1].replace('jpeg', 'jpg')
        idImagePath = `${phone.replace(/\D/g, '')}/${crypto.randomUUID()}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('kyc-ids')
          .upload(idImagePath, bytes, { contentType, upsert: true })
        if (upErr) throw upErr

        const extraction = await extractId(idImage)
        decision = decideId(extraction, idType, fullName, endDate)
      }

      const nowIso = new Date().toISOString()
      const status = isFirstTime ? (decision?.status ?? 'pending') : (existing?.kyc_status ?? 'pending')

      const payload: Record<string, unknown> = {
        phone,
        full_name: fullName,
        email,
        id_type: idType ?? existing?.id_type ?? null,
        id_image_path: idImagePath,
        kyc_status: status,
        submitted_at: nowIso,
        email_verified_at: nowIso,
      }
      if (isFirstTime) {
        payload.rejection_reason = decision?.reason ?? null
        payload.id_extracted = decision?.extraction ?? {}
        payload.auto_decision = decision?.status ?? 'pending'
        payload.auto_confidence = decision?.confidence ?? null
        payload.id_expiry_date = decision?.expiryDate ?? null
        payload.reviewed_at = decision && decision.status !== 'pending' ? nowIso : null
        payload.verified_at = decision?.status === 'verified' ? nowIso : null
      }

      const { data: saved, error } = await supabase
        .from('rental_customers')
        .upsert(payload, { onConflict: 'phone' })
        .select('id, kyc_status, rejection_reason')
        .single()
      if (error) throw error

      if (isFirstTime && decision && decision.status !== 'pending') {
        const firstName = fullName.split(/\s+/)[0]
        if (decision.status === 'verified') {
          await sendTemplate('identity-approved', email, `id-approved-${saved.id}`, {
            customerName: firstName,
          }).catch(() => null)
        } else {
          await sendTemplate('identity-rejected', email, `id-rejected-${saved.id}-${Date.now()}`, {
            customerName: firstName,
            reason: decision.reason ?? 'Identity concerns',
          }).catch(() => null)
        }

        const ex = decision.extraction
        await logActivity(supabase, {
          category: 'identity',
          event: `auto_${decision.status}`,
          title:
            decision.status === 'verified'
              ? `ID automatically approved — ${fullName}`
              : `ID automatically rejected — ${fullName}`,
          summary: decision.reason ?? `${idType} passed every automatic check.`,
          severity: decision.status === 'verified' ? 'info' : 'warning',
          actorEmail: null,
          entityType: 'rental_customer',
          entityId: saved.id,
          lines: [
            { label: 'Selected ID type', value: String(idType) },
            { label: 'Detected document', value: String(ex?.documentType ?? 'unknown') },
            { label: 'Name on document', value: ex?.fullNameOnDocument ?? '—' },
            { label: 'Expiry date', value: ex?.expiryDate ?? 'n/a' },
            { label: 'Confidence', value: ex ? `${Math.round((ex.confidence ?? 0) * 100)}%` : '—' },
            { label: 'Customer email', value: email },
          ],
          metadata: { decision: decision.status, reason: decision.reason, extraction: ex },
        }).catch(() => null)
      }

      return json({
        customerId: saved.id,
        status: saved.kyc_status,
        rejectionReason: saved.rejection_reason ?? null,
        returning: !isFirstTime,
        automatic: Boolean(isFirstTime && decision && decision.status !== 'pending'),
      })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    console.error('rental-kyc error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})
