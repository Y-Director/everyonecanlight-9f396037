// Shared helpers for booking lookup + amendment rules.
export const EDIT_CUTOFF_HOURS = 12

export const pickupAt = (startDate: string | null, callTime: string | null): Date | null => {
  if (!startDate) return null
  const [h, m] = String(callTime ?? '07:00').split(':')
  // Lagos is UTC+1 year round.
  return new Date(`${startDate}T${(h ?? '07').padStart(2, '0')}:${(m ?? '00').padStart(2, '0')}:00+01:00`)
}

export const isEditable = (startDate: string | null, callTime: string | null): boolean => {
  const pickup = pickupAt(startDate, callTime)
  if (!pickup) return true
  return pickup.getTime() - Date.now() > EDIT_CUTOFF_HOURS * 3600 * 1000
}

export const normaliseEmail = (v: unknown) => String(v ?? '').trim().toLowerCase()
export const normaliseCode = (v: unknown) => String(v ?? '').trim().toUpperCase().replace(/\s+/g, '')
