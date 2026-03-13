import { NextResponse } from 'next/server'
import {
  hashPin,
  isValidPinFormat,
  getExpectedPinHash,
  createAccesCookieValue,
  COOKIE_NAME,
  COOKIE_MAX_AGE,
} from '@/lib/acces-pin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const pin = typeof body?.pin === 'string' ? body.pin : ''

    if (!isValidPinFormat(pin)) {
      return NextResponse.json(
        { error: 'Le code doit être composé de 6 chiffres.' },
        { status: 400 }
      )
    }

    const expectedHash = getExpectedPinHash()
    const inputHash = hashPin(pin)
    if (inputHash !== expectedHash) {
      return NextResponse.json(
        { error: 'Code PIN incorrect.' },
        { status: 401 }
      )
    }

    const cookieValue = createAccesCookieValue()
    const res = NextResponse.json({ success: true })
    res.cookies.set(COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('Acces verify error:', err)
    return NextResponse.json(
      { error: 'Erreur interne.' },
      { status: 500 }
    )
  }
}
