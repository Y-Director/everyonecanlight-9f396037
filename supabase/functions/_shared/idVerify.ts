// Automatic Nigerian government-ID verification.
// Reads the uploaded document with a vision model, then applies the accept/reject
// rules in code (the model only extracts, it never decides).

export type IdKind = 'Passport' | 'Drivers License' | 'NIN'

export interface Extraction {
  documentType: 'passport' | 'drivers_license' | 'nin' | 'other' | 'unreadable'
  country: string | null
  surname: string | null
  givenNames: string | null
  fullNameOnDocument: string | null
  documentNumber: string | null
  expiryDate: string | null // yyyy-mm-dd
  dateOfBirth: string | null
  portraitPresent: boolean
  legible: boolean
  looksLikeSampleOrTemplate: boolean
  screenshotOfScreen: boolean
  confidence: number
  notes: string | null
}

export interface Decision {
  status: 'verified' | 'rejected' | 'pending'
  reason: string | null
  extraction: Extraction | null
  expiryDate: string | null
  confidence: number | null
}

const KIND_LABEL: Record<IdKind, string> = {
  Passport: 'International Passport',
  'Drivers License': "Driver's Licence",
  NIN: 'NIN Slip or NIN Card',
}

const KIND_TO_DOC: Record<IdKind, Extraction['documentType']> = {
  Passport: 'passport',
  'Drivers License': 'drivers_license',
  NIN: 'nin',
}

const DOC_LABEL: Record<string, string> = {
  passport: 'an International Passport',
  drivers_license: "a Driver's Licence",
  nin: 'a NIN slip or card',
  other: 'not a government ID',
  unreadable: 'unreadable',
}

const PROMPT = `You read Nigerian government-issued identity documents and return structured data only.

Supported documents:
- Nigerian International Passport (data page: "FEDERAL REPUBLIC OF NIGERIA", Surname / Given Names, "Date of Expiry / Date d'expiration", passport number like A10774634, MRZ lines at the bottom).
- Nigerian National Driver's Licence (FRSC card: "NATIONAL DRIVERS LICENCE", L/NO number, "D of B", "ISS" issue date and "EXP" expiry date, state and class).
- NIMC National Identification Number Slip or NIN card ("National Identity Management System", Tracking ID, NIN, Surname, First Name, Middle Name, Gender, Address). NIN slips carry NO expiry date.

Return ONLY a JSON object with exactly these keys:
{
  "documentType": "passport" | "drivers_license" | "nin" | "other" | "unreadable",
  "country": string | null,
  "surname": string | null,
  "givenNames": string | null,
  "fullNameOnDocument": string | null,
  "documentNumber": string | null,
  "expiryDate": string | null,
  "dateOfBirth": string | null,
  "portraitPresent": boolean,
  "legible": boolean,
  "looksLikeSampleOrTemplate": boolean,
  "screenshotOfScreen": boolean,
  "confidence": number,
  "notes": string | null
}

Rules:
- Dates must be normalised to yyyy-mm-dd. Nigerian documents use DD-MM-YYYY or "07 AUG / AOU 24" style; for two-digit years on passports assume 20YY.
- For a driver's licence use the EXP date, never the ISS date. For a NIN slip set expiryDate to null.
- "fullNameOnDocument" is the printed name exactly as shown, surname and given names combined.
- looksLikeSampleOrTemplate is true when the document shows words like SAMPLE, SPECIMEN, TEMPLATE, or is an obvious stock/demo card.
- screenshotOfScreen is true when the photo is clearly of a monitor or phone screen.
- confidence is 0 to 1 for how sure you are of the extracted fields.
- No prose, no markdown, JSON only.`

const stripDiacritics = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const tokens = (s: string) =>
  stripDiacritics(String(s ?? '').toLowerCase())
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)

const lev = (a: string, b: string): number => {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1))
      last = tmp
    }
  }
  return prev[b.length]
}

const tokenMatches = (t: string, pool: string[]) =>
  pool.some((p) => p === t || lev(p, t) <= (t.length > 5 ? 2 : 1))

/** Name on the document must contain every name the customer typed (middle names optional). */
export const namesMatch = (typed: string, onDoc: string): boolean => {
  const a = tokens(typed)
  const b = tokens(onDoc)
  if (a.length < 2 || b.length < 2) return false
  const matched = a.filter((t) => tokenMatches(t, b))
  // Surname + at least one given name must line up.
  return matched.length >= 2 && matched.length >= a.length - 1
}

const parseDate = (v: string | null): Date | null => {
  if (!v) return null
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const d = new Date(`${v}T12:00:00Z`)
  return isNaN(d.getTime()) ? null : d
}

const pretty = (v: string) =>
  new Date(`${v}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

export const extractId = async (imageDataUrl: string): Promise<Extraction | null> => {
  const key = Deno.env.get('LOVABLE_API_KEY')
  if (!key) {
    console.error('idVerify: LOVABLE_API_KEY missing')
    return null
  }
  try {
    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': key },
      body: JSON.stringify({
        model: 'google/gemini-3.6-flash',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract the fields from this identity document.' },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ],
      }),
    })
    if (!res.ok) {
      console.error('idVerify: gateway error', res.status, await res.text())
      return null
    }
    const payload = await res.json()
    const raw = payload?.choices?.[0]?.message?.content
    if (!raw) return null
    const text = String(raw).replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
    const parsed = JSON.parse(text)
    return {
      documentType: parsed.documentType ?? 'unreadable',
      country: parsed.country ?? null,
      surname: parsed.surname ?? null,
      givenNames: parsed.givenNames ?? null,
      fullNameOnDocument:
        parsed.fullNameOnDocument ??
        [parsed.givenNames, parsed.surname].filter(Boolean).join(' ') ??
        null,
      documentNumber: parsed.documentNumber ?? null,
      expiryDate: parsed.expiryDate ?? null,
      dateOfBirth: parsed.dateOfBirth ?? null,
      portraitPresent: Boolean(parsed.portraitPresent),
      legible: parsed.legible !== false,
      looksLikeSampleOrTemplate: Boolean(parsed.looksLikeSampleOrTemplate),
      screenshotOfScreen: Boolean(parsed.screenshotOfScreen),
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      notes: parsed.notes ?? null,
    }
  } catch (e) {
    console.error('idVerify: extraction failed', e)
    return null
  }
}

/**
 * Applies the accept/reject rules. `lastRentalDay` is the final day of the booking
 * (yyyy-mm-dd) so an ID that expires mid-rental is rejected too.
 */
export const decideId = (
  extraction: Extraction | null,
  selectedType: IdKind,
  typedFullName: string,
  lastRentalDay: string | null,
): Decision => {
  if (!extraction) {
    return { status: 'pending', reason: null, extraction: null, expiryDate: null, confidence: null }
  }

  const base = { extraction, expiryDate: extraction.expiryDate, confidence: extraction.confidence }
  const reject = (reason: string): Decision => ({ status: 'rejected', reason, ...base })

  if (extraction.documentType === 'unreadable' || !extraction.legible) {
    return reject('The image was too unclear to read. Upload a sharper, well-lit photo of your ID.')
  }
  if (extraction.documentType === 'other') {
    return reject('The upload is not a recognised Nigerian government ID.')
  }
  if (extraction.looksLikeSampleOrTemplate) {
    return reject('The document looks like a sample or template rather than a real ID.')
  }
  if (extraction.screenshotOfScreen) {
    return reject('Photos of a screen are not accepted. Upload the original image or a flat scan.')
  }
  if (extraction.documentType !== KIND_TO_DOC[selectedType]) {
    return reject(
      `You selected ${KIND_LABEL[selectedType]} but the upload is ${DOC_LABEL[extraction.documentType]}.`,
    )
  }
  if (!extraction.portraitPresent) {
    return reject('No photograph could be found on the document. Upload the page with your photo.')
  }
  if (extraction.confidence < 0.45) {
    return { status: 'pending', reason: null, ...base }
  }
  if (!extraction.fullNameOnDocument) {
    return { status: 'pending', reason: null, ...base }
  }
  if (!namesMatch(typedFullName, extraction.fullNameOnDocument)) {
    return reject(
      `The name on the ID (${extraction.fullNameOnDocument}) does not match the name you entered.`,
    )
  }

  if (selectedType !== 'NIN') {
    const expiry = parseDate(extraction.expiryDate)
    if (!expiry) return { status: 'pending', reason: null, ...base }
    const cutoff = parseDate(lastRentalDay) ?? new Date()
    if (expiry.getTime() <= cutoff.getTime()) {
      return reject(
        `The ID expired on ${pretty(extraction.expiryDate as string)}. Upload a valid, unexpired document.`,
      )
    }
  }

  return { status: 'verified', reason: null, ...base }
}
