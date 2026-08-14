'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const expired = searchParams.get('error') === 'expired'

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/send-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      setError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-light text-stone-800 tracking-wide">Check your inbox</h1>
          <p className="text-stone-500 leading-relaxed">
            We sent a link to <span className="text-stone-700 font-medium">{email}</span>.
            Click it to open your report.
          </p>
          <p className="text-sm text-stone-400">The link expires in 1 hour.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-widest text-stone-400">Regulation by Design</p>
          <h1 className="text-3xl font-light text-stone-800 tracking-wide">Your Report</h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Enter your email to receive a sign-in link.
          </p>
        </div>

        {expired && (
          <p className="text-center text-sm text-amber-600">
            That link has expired. Request a new one below.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-stone-200 rounded-lg bg-white text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 transition"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-800 text-white rounded-lg text-sm tracking-wide hover:bg-stone-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send sign-in link'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
