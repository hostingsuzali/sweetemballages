import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 })
    }

    const token = generateSessionToken()
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

    await prisma.adminSession.create({ data: { token, userId: user.id, expiresAt } })

    const res = NextResponse.json({ success: true })
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 })
  }
}
