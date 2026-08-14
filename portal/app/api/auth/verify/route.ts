import { NextRequest, NextResponse } from 'next/server'
import { verifyMagicToken, signSessionToken } from '@/lib/session'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=invalid', request.url))
  }

  const email = await verifyMagicToken(token)
  if (!email) {
    return NextResponse.redirect(new URL('/login?error=expired', request.url))
  }

  const sessionToken = await signSessionToken(email)
  const response = NextResponse.redirect(new URL('/dashboard', request.url))
  response.cookies.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return response
}
