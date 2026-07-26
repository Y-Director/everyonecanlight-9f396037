import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const AMOUNT_NGN = 250000

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const fullName = String(body.fullName ?? '').trim()
    const whatsapp = String(body.whatsapp ?? '').trim()
    const email = String(body.email ?? '').trim()
    const background = String(body.background ?? '').trim()
    const experience = String(body.experience ?? '').trim()
    const callbackUrl = String(body.callbackUrl ?? '').trim()

    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
    if (!fullName || fullName.length > 200 || !whatsapp || whatsapp.length > 30 || !emailOk ||
        !background || background.length > 100 || !experience || experience.length > 100) {
      return new Response(JSON.stringify({ error: 'Invalid registration details' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Payment not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const reference = `STL2-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { error: insertError } = await supabase.from('masterclass_registrations').insert({
      full_name: fullName, whatsapp, email, background, experience,
      reference, amount: AMOUNT_NGN, currency: 'NGN', status: 'pending',
    })
    if (insertError) throw insertError

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: AMOUNT_NGN * 100,
        currency: 'NGN',
        reference,
        callback_url: callbackUrl || undefined,
        metadata: { full_name: fullName, whatsapp, background, experience, product: 'Shift The Light 2 — Creator Residency' },
      }),
    })
    const data = await res.json()
    if (!res.ok || !data?.status) {
      console.error('Paystack init failed', data)
      return new Response(JSON.stringify({ error: data?.message ?? 'Could not start payment' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ authorization_url: data.data.authorization_url, reference }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
