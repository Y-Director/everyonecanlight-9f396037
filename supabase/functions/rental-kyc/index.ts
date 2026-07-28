import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const action = String(body.action ?? '')
    const supabase = admin()

    if (action === 'check') {
      const rawEmail = String(body.email ?? '').trim().toLowerCase()
      if (rawEmail) {
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawEmail)) return json({ error: 'Invalid email' }, 400)
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
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'Invalid email' }, 400)
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
      const idType = body.idType ? String(body.idType).trim() : null
      const idImage = body.idImage ? String(body.idImage) : null // data URL

      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
      if (!fullName || fullName.length > 200 || !emailOk || phone.length < 8 || phone.length > 20) {
        return json({ error: 'Please check your name, phone number and email.' }, 400)
      }

      const { data: existing } = await supabase
        .from('rental_customers')
        .select('id, kyc_status, id_image_path, id_type')
        .eq('phone', phone)
        .maybeSingle()

      const isFirstTime = !existing
      let idImagePath: string | null = existing?.id_image_path ?? null

      if (isFirstTime) {
        if (!idType || !['Passport', 'Drivers License'].includes(idType)) {
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
      }

      const payload = {
        phone,
        full_name: fullName,
        email,
        id_type: idType ?? existing?.id_type ?? null,
        id_image_path: idImagePath,
        kyc_status: isFirstTime ? 'pending' : (existing?.kyc_status ?? 'pending'),
        rejection_reason: isFirstTime ? null : undefined,
        submitted_at: new Date().toISOString(),
      }

      const { data: saved, error } = await supabase
        .from('rental_customers')
        .upsert(payload, { onConflict: 'phone' })
        .select('id, kyc_status, rejection_reason')
        .single()
      if (error) throw error

      return json({
        customerId: saved.id,
        status: saved.kyc_status,
        rejectionReason: saved.rejection_reason ?? null,
        returning: !isFirstTime,
      })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    console.error('rental-kyc error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})