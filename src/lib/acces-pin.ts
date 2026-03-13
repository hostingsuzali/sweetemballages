import { createHash, createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'acces_verified'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours
const COOKIE_SECRET = process.env.ACCES_COOKIE_SECRET || 'acces-default-secret-change-in-production'

/** Fixed default PIN for /acces (not stored in DB, not changeable). */
const DEFAULT_PIN = '007008'

/** Hash a 6-digit PIN (SHA-256). */
export function hashPin(pin: string): string {
  return createHash('sha256').update(pin.trim()).digest('hex')
}

/** Hash of the fixed PIN used for verification (no DB). */
export function getExpectedPinHash(): string {
  const pin = process.env.ACCES_PIN || DEFAULT_PIN
  return hashPin(pin)
}

/** Validate format: exactly 6 digits. */
export function isValidPinFormat(pin: string): boolean {
  return /^\d{6}$/.test((pin || '').trim())
}

/** Create signed cookie value (so client cannot forge). */
export function createAccesCookieValue(): string {
  const payload = `ok:${Date.now() + COOKIE_MAX_AGE * 1000}`
  const sig = createHmac('sha256', COOKIE_SECRET).update(payload).digest('hex')
  return `${payload}:${sig}`
}

/** Verify cookie value and return true if valid and not expired. */
export function verifyAccesCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue || !cookieValue.includes(':')) return false
  const parts = cookieValue.split(':')
  if (parts.length < 3) return false
  const exp = parseInt(parts[1], 10)
  if (Number.isNaN(exp) || Date.now() > exp) return false
  const payload = `${parts[0]}:${parts[1]}`
  const expectedSig = createHmac('sha256', COOKIE_SECRET).update(payload).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(expectedSig, 'hex'), Buffer.from(parts[2], 'hex'))
  } catch {
    return false
  }
}

export { COOKIE_NAME, COOKIE_MAX_AGE }
