import type { Metadata } from 'next'
import { Bricolage_Grotesque, Hanken_Grotesk, Newsreader } from 'next/font/google'

// The report's three faces. Scoping them to this route rather than the root
// layout is deliberate: /dashboard renders client reports inside an iframe
// that carries its own fonts, and /login is not part of this surface.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const body = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The field — Regulation by Design',
  description: 'The Sun-gate window you are currently standing in.',
}

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  // Two classes here are load-bearing rather than decorative. `rbd-fonts`
  // re-declares the theme's font tokens in the same scope as the next/font
  // variables — see the comment on it in globals.css, without which this route
  // renders entirely in Arial. `font-body` then beats the `font-family: Arial`
  // that globals.css sets on `body`, left over from the Next scaffold.
  return (
    <div
      className={`${display.variable} ${body.variable} ${serif.variable} rbd-fonts font-body min-h-screen bg-rbd-bg text-rbd-text antialiased`}
    >
      {children}
    </div>
  )
}
