'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
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
