'use client'

import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

interface Props {
  name: string
  content: string
  updatedAt: string
}

export default function ReportView({ name, content, updatedAt }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const formattedDate = new Date(updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-100 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400">Regulation by Design</p>
            <p className="text-sm text-stone-600 mt-0.5">{name}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-stone-400 hover:text-stone-600 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xs text-stone-400 mb-10">Last updated {formattedDate}</p>
        <div className="prose prose-stone prose-sm max-w-none
          prose-headings:font-light prose-headings:tracking-wide
          prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-12 prose-h3:text-base
          prose-p:leading-relaxed prose-p:text-stone-700
          prose-li:text-stone-700 prose-li:leading-relaxed
          prose-strong:font-medium prose-strong:text-stone-800
          prose-hr:border-stone-100">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </main>
    </div>
  )
}
