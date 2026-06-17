import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE } from '@/lib/auth'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (token) {
      await prisma.adminSession.deleteMany({ where: { token } })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' })
    return res
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 })
  }
}
