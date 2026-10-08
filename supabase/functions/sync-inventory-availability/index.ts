import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// Admin-only: recounts inventory units marked "rented_out" and publishes the
// per-item totals to public.light_house_availability, which the Light House
// page reads to show how many units of each item are left.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const auth = req.headers.get('Authorization') ?? ''
  const url = Deno.env.get('SUPABASE_URL')!
  const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
  const { data: isAdmin } = await userClient.rpc('is_active_admin')
  if (!isAdmin) return json({ error: 'Forbidden' }, 403)

  const db = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: items, error } = await db.from('inventory_items').select('name, location')
  if (error) return json({ error: error.message }, 500)

  const counts = new Map<string, number>()
  for (const i of items ?? []) {
    if (i.location !== 'rented_out') continue
    const id = norm(String(i.name ?? ''))
    if (!id) continue
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  const rows = [...counts.entries()].map(([item_id, rented_out]) => ({
    item_id,
    rented_out,
    updated_at: new Date().toISOString(),
  }))

  const { error: delErr } = await db.from('light_house_availability').delete().neq('item_id', '')
  if (delErr) return json({ error: delErr.message }, 500)
  if (rows.length) {
    const { error: insErr } = await db.from('light_house_availability').insert(rows)
    if (insErr) return json({ error: insErr.message }, 500)
  }

  return json({ synced: rows.length })
})
