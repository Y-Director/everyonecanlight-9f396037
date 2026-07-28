// Resolves the Lighting Operator shown to customers straight from the Team Members
// record (admin dashboard) so name, phone and photo are always in sync.
// deno-lint-ignore no-explicit-any
export const resolveOperator = async (supabase: any, runnerId: string | null | undefined) => {
  if (!runnerId) return null

  const { data: staff } = await supabase
    .from('staff_members')
    .select('full_name, phone, avatar_url, is_light_operator, status')
    .eq('runner_id', runnerId)
    .maybeSingle()

  let name: string | null = staff?.full_name ?? null
  let phone: string | null = staff?.phone ?? null
  let avatar: string | null = staff?.avatar_url ?? null

  if (!name) {
    const { data: runner } = await supabase
      .from('runners')
      .select('name, phone, avatar_url')
      .eq('id', runnerId)
      .maybeSingle()
    if (!runner) return null
    name = runner.name
    phone = runner.phone
    avatar = runner.avatar_url
  }

  let avatar_url: string | null = null
  if (avatar) {
    if (/^https?:\/\//.test(avatar)) {
      avatar_url = avatar
    } else {
      const { data: signed } = await supabase.storage
        .from('staff-avatars')
        .createSignedUrl(avatar, 60 * 60 * 24 * 7)
      avatar_url = signed?.signedUrl ?? null
    }
  }

  return { name, phone, avatar_url }
}
