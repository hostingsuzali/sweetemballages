import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await requireAdminSession()

    if (!session) {
      return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
    }

    return NextResponse.json({ user: session.user })
  } catch (err) {
    console.error('Auth me error:', err)
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 })
  }
}
