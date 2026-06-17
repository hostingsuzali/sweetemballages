import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const scryptAsync = promisify(scrypt)

export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 // 24h in seconds

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${hash.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, storedHash] = stored.split(':')
  if (!salt || !storedHash) return false
  const hash = (await scryptAsync(password, salt, 64)) as Buffer
  const storedHashBuffer = Buffer.from(storedHash, 'hex')
  return timingSafeEqual(hash, storedHashBuffer)
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

export async function requireAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { user: { select: { id: true, email: true } } },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.adminSession.delete({ where: { token } })
    return null
  }

  return session
}
