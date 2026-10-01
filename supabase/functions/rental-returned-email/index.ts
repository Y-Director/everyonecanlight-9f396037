import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendTemplate } from '../_shared/activity.ts'

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const auth = req.headers.get('Authorization') ?? ''
  const url = Deno.env.get('SUPABASE_URL')!
  const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
  const { data: isAdmin } = await userClient.rpc('is_active_admin')
  if (!isAdmin) return json({ error: 'Forbidden' }, 403)

  let id: string
  try {
    id = String((await req.json()).reservationId ?? '')
  } catch { return json({ error: 'Invalid body' }, 400) }
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'reservationId required' }, 400)

  const db = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: row, error } = await db
    .from('rental_reservations')
    .select('id, booking_code, reference, items, contact_email, contact_name, fulfilment_status, rental_customers(email, full_name)')
    .eq('id', id)
    .maybeSingle()
  if (error || !row) return json({ error: 'Not found' }, 404)
  if (row.fulfilment_status !== 'returned') return json({ error: 'Rental is not marked returned' }, 400)
  // deno-lint-ignore no-explicit-any
  const cust = (row as any).rental_customers
  const to = String(row.contact_email ?? cust?.email ?? '').trim().toLowerCase()
  if (!to) return json({ error: 'No renter email' }, 400)

  const sent = await sendTemplate('rental-returned', to, `rental-returned-${row.id}`, {
    customerName: row.contact_name ?? cust?.full_name ?? undefined,
    bookingCode: row.booking_code ?? row.reference,
    items: (Array.isArray(row.items) ? row.items : []).map((i: { name?: string; qty?: number }) => ({ name: i.name, qty: i.qty })),
    returnedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  })
  return json({ sent })
})
