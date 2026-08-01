// Email hygiene helpers shared by edge functions (mirrored in src/lib/emailHygiene.ts).
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/

const COMMON_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'zoho.com',
  'everyonecanlight.co',
]

const TLD_FIXES: Record<string, string> = {
  con: 'com',
  cmo: 'com',
  cm: 'com',
  comm: 'com',
  ocm: 'com',
  co: 'com',
  vom: 'com',
  xom: 'com',
  net1: 'net',
}

const distance = (a: string, b: string): number => {
  const m = a.length
  const n = b.length
  if (Math.abs(m - n) > 2) return 3
  const prev = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    let last = prev[0]
    prev[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1))
      last = tmp
    }
  }
  return prev[n]
}

export const isValidEmail = (value: string) => EMAIL_RE.test(String(value ?? '').trim())

/** Returns a corrected address when the domain looks like a typo, otherwise null. */
export const suggestEmail = (value: string): string | null => {
  const raw = String(value ?? '').trim().toLowerCase()
  if (!raw.includes('@')) return null
  const at = raw.lastIndexOf('@')
  const local = raw.slice(0, at)
  let domain = raw.slice(at + 1)
  if (!local || !domain) return null

  domain = domain.replace(/\.{2,}/g, '.').replace(/^\.+|\.+$/g, '')

  // Missing dot before a known TLD, e.g. gmailcom
  if (!domain.includes('.')) {
    for (const tld of ['com', 'net', 'org', 'ng', 'co']) {
      if (domain.endsWith(tld) && domain.length > tld.length) {
        domain = `${domain.slice(0, -tld.length)}.${tld}`
        break
      }
    }
  }

  const parts = domain.split('.')
  const tld = parts[parts.length - 1]
  if (TLD_FIXES[tld]) parts[parts.length - 1] = TLD_FIXES[tld]
  domain = parts.join('.')

  let best: string | null = null
  let bestScore = 3
  for (const candidate of COMMON_DOMAINS) {
    const d = distance(domain, candidate)
    if (d > 0 && d < bestScore) {
      best = candidate
      bestScore = d
    }
  }
  const fixed = `${local}@${best && bestScore <= 2 ? best : domain}`
  return fixed !== raw && EMAIL_RE.test(fixed) ? fixed : null
}
