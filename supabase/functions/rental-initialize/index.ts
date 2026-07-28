import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

// Authoritative day rates (kept server-side so totals cannot be tampered with).
const PRICES: Record<string, number> = {"amaran100ds":10000,"amaran100xs":10000,"amaran200ds":15000,"amaran150c":15000,"amaran300c":20000,"amaranray360c":22000,"amaranray660c":40000,"aputurels300d":25000,"aputurels300x":25000,"aputurels600dpro":35000,"aputurels600xpro":38000,"aputurels600c":40000,"aputure1000c":50000,"aputurels1200d":50000,"aputurelsxt26":120000,"aputurelsxt52":200000,"aputurecs15":120000,"colbor220r":20000,"colbor330r":30000,"godoxmg1200bi":55000,"godoxmg200bi":15000,"godoxmg300bi":25000,"godoxsl100d":10000,"godoxsl150":10000,"godoxsl200":15000,"godoxsl300":20000,"nanliteforza200b":15000,"nanliteforza300":20000,"nanliteforza300b":20000,"nanliteforza500":30000,"nanliteforza500b":30000,"nanliteforza720b":45000,"aputurenovap300c":30000,"aputurenovap600c":45000,"amaranf21cmat2x1ft":20000,"amaranf22cmat2x2ft":25000,"falconeyes24tdxmat2x2ft":25000,"godoxf200mat2x2ft":25000,"godoxf400mat2x4ft":40000,"godoxf600mat4x4ft":50000,"godoxf800mat8x8ft":100000,"amaranpt2crgbwwpixeltube2ft":10000,"amaranpt4crgbwwpixeltube4ft":15000,"amarant2crgbwwtubebar2ft":10000,"amarant4crgbwwtubebar4ft":15000,"godoxtl30rgbtubelight":10000,"godoxtl60rgbtubelight":15000,"nanlitepavotubeii15crgbtube15ft":8000,"nanlitepavotubeii30crgbtube3ft":10000,"nanlitepavotubet87crgbtube4ft":15000,"aputureb7csetof6":50000,"godoxc7rsetof6":50000,"nanlitepavobulbsetof4":40000,"aputurefresnel2xlensmount":8000,"octabox95cm":5000,"octabox55cm":5000,"octabox90cm":5000,"parabolicsoftbox120cm":5000,"parabolicsoftbox150cm":5000,"bulblanternmodifier90cm":5000,"bulblanternmodifier120cm":5000,"aputurespotlightmountse19lens":10000,"aputurespotlightmountse26lens":10000,"aputurespotlightmountse36lens":10000,"fresnellensadapterbowensmountgeneric":8000,"nanlitepjfz60projectionspotlightforforza60":10000,"4x4ftscrimframeblacksolidflag":10000,"4x4ftscrimframefulldiffusion":10000,"4x4ftscrimframehalfdiffusion":10000,"4x4ftscrimframesilverreflector":10000,"5in1collapsiblereflector120cm":5000,"5in1collapsiblereflector80cm":5000,"6x6ftscrimframeblacksolidflag":15000,"6x6ftscrimframefulldiffusion":15000,"6x6ftscrimframehalfdiffusion":15000,"6x6ftscrimframesilvergoldreflector":15000,"8x8ftscrimframeblacksolidflag":20000,"8x8ftscrimframefulldiffusion":20000,"8x8ftscrimframehalfdiffusion":20000,"8x8ftscrimframesilvergoldreflector":20000,"blackwrapcinefoilroll":5000,"foamcorewhitebounceboardlargeandsmall":5000,"boomarmforcstandoverhead":3500,"cstandheavyduty105ftwitharm":5000,"cstandheavyduty20ftwitharm":10000,"combostandturtlebasestand":20000,"gridclampmatthelliniclamp":3000,"lightstandheavyduty13ft":3000,"sandbag10kg":1000,"superclampwithstud":2000,"15ftextensioncable":2000,"vmountbattery":8000}

const LOCATIONS = ['Lagos Island', 'Lagos Mainland', 'Outside Lagos']

// Unambiguous alphabet (no I, O, 0, 1) for human-readable booking references.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const makeBookingCode = (len = 8) => {
  const bytes = crypto.getRandomValues(new Uint8Array(len))
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const customerId = String(body.customerId ?? '')
    const days = Math.max(1, Math.min(60, parseInt(String(body.days ?? '1'), 10) || 1))
    const location = String(body.location ?? '')
    const callTime = String(body.callTime ?? '')
    const startDate = body.startDate ? String(body.startDate) : null
    const endDate = body.endDate ? String(body.endDate) : null
    const callbackUrl = String(body.callbackUrl ?? '').trim()
    const rawItems = Array.isArray(body.items) ? body.items : []

    if (!customerId || !LOCATIONS.includes(location) || !/^\d{2}:\d{2}$/.test(callTime)) {
      return json({ error: 'Missing or invalid reservation details.' }, 400)
    }

    const items = rawItems
      .map((i: Record<string, unknown>) => {
        const id = String(i?.id ?? '')
        const qty = Math.max(0, Math.min(50, parseInt(String(i?.qty ?? '0'), 10) || 0))
        const price = PRICES[id]
        if (!price || qty < 1) return null
        return { id, name: String(i?.name ?? id).slice(0, 200), qty, price, lineTotal: price * qty * days }
      })
      .filter(Boolean) as { id: string; name: string; qty: number; price: number; lineTotal: number }[]

    if (items.length === 0) return json({ error: 'Your gear list is empty.' }, 400)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: customer } = await supabase
      .from('rental_customers')
      .select('id, email, full_name, phone, kyc_status')
      .eq('id', customerId)
      .maybeSingle()

    if (!customer) return json({ error: 'Customer not found.' }, 404)
    if (customer.kyc_status !== 'verified') {
      return json({ error: 'Your identity verification is still under review.' }, 403)
    }

    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0)
    const total = subtotal
    const reference = `ECLR-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`

    // Booking code, retried on the (very unlikely) unique-index collision.
    let bookingCode = makeBookingCode()
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: clash } = await supabase
        .from('rental_reservations')
        .select('id')
        .eq('booking_code', bookingCode)
        .maybeSingle()
      if (!clash) break
      bookingCode = makeBookingCode()
    }

    // Assign an available runner (round-robin on least recent assignment).
    const { data: runners } = await supabase
      .from('runners')
      .select('id')
      .eq('active', true)
      .order('created_at', { ascending: true })
    const runnerId = runners && runners.length
      ? runners[Math.floor(Math.random() * runners.length)].id
      : null

    const { error: insertError } = await supabase.from('rental_reservations').insert({
      reference,
      booking_code: bookingCode,
      customer_id: customer.id,
      contact_name: customer.full_name,
      contact_email: customer.email,
      contact_phone: customer.phone,
      items,
      days,
      start_date: startDate,
      end_date: endDate,
      location,
      call_time: callTime,
      subtotal,
      total,
      status: 'pending',
      runner_id: runnerId,
    })
    if (insertError) throw insertError

    const secret = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!secret) return json({ error: 'Payment is not configured.' }, 500)

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: customer.email,
        amount: total * 100,
        currency: 'NGN',
        reference,
        callback_url: callbackUrl || undefined,
        metadata: { product: 'ECL Light Bank Rental', days, location, call_time: callTime },
      }),
    })
    const data = await res.json()
    if (!res.ok || !data?.status) {
      console.error('Paystack init failed', res.status, data)
      return json({ error: data?.message ?? 'Could not start payment' }, 502)
    }

    return json({
      authorization_url: data.data.authorization_url,
      reference,
      bookingCode,
      total,
    })
  } catch (e) {
    console.error('rental-initialize error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})