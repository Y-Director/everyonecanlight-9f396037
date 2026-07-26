import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    let reference = url.searchParams.get('reference') ?? ''
    if (!reference && req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      reference = String(body.reference ?? '')
    }
    if (!reference || reference.length > 120) {
      return new Response(JSON.stringify({ error: 'Missing reference' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY')!
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    })
    const data = await res.json()
    const paid = res.ok && data?.status && data?.data?.status === 'success'

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    await supabase.from('masterclass_registrations')
      .update({ status: paid ? 'paid' : 'failed', paid_at: paid ? new Date().toISOString() : null })
      .eq('reference', reference)

    return new Response(JSON.stringify({ paid, status: data?.data?.status ?? 'unknown' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
