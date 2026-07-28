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

    await supabase
      .from('rental_reservations')
      .update({
        status: paid ? 'confirmed' : 'failed',
        paid_at: paid ? new Date().toISOString() : null,
      })
      .eq('reference', reference)

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