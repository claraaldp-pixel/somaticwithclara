import { NextRequest, NextResponse } from 'next/server'
import { signMagicToken } from '@/lib/session'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const token = await signMagicToken(email.toLowerCase().trim())
  const link = `${process.env.AUTH_URL}/api/auth/verify?token=${token}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.AUTH_EMAIL_FROM,
      to: email,
      subject: 'Your sign-in link — Regulation by Design',
      html: `
        <p>Hello,</p>
        <p>Click the link below to access your Regulation by Design report. This link expires in 1 hour.</p>
        <p><a href="${link}">Sign in to your report →</a></p>
        <p style="color:#999;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Resend error:', res.status, body)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
