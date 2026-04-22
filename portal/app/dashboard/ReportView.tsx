'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

interface Props {
  name: string
  clientId: string
  content: string
  updatedAt: string
}

const isHtml = (s: string) => s.trimStart().startsWith('<')

export default function ReportView({ name, clientId, content, updatedAt }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    if (!isHtml(content)) return

    async function loadAndSendNotes() {
      const { data: notes } = await supabase
        .from('section_notes')
        .select('section_key, content')
        .eq('client_id', clientId)

      const notesMap = Object.fromEntries(
        (notes ?? []).map((n) => [n.section_key, n.content])
      )

      const iframe = iframeRef.current
      if (!iframe) return

      const send = () =>
        iframe.contentWindow?.postMessage({ type: 'NOTES_LOADED', notes: notesMap }, '*')

      if (iframe.contentDocument?.readyState === 'complete') {
        send()
      } else {
        iframe.addEventListener('load', send, { once: true })
      }
    }

    loadAndSendNotes()

    function handleMessage(e: MessageEvent) {
      if (e.data?.type !== 'SAVE_NOTE') return
      const { sectionKey, content: noteContent } = e.data as {
        sectionKey: string
        content: string
      }

      clearTimeout(saveTimers.current[sectionKey])
      saveTimers.current[sectionKey] = setTimeout(async () => {
        await supabase.from('section_notes').upsert(
          {
            client_id: clientId,
            section_key: sectionKey,
            content: noteContent,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'client_id,section_key' }
        )
      }, 1000)
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [content, clientId])

  if (isHtml(content)) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleSignOut}
          style={{
            position: 'fixed',
            top: 12,
            right: 16,
            zIndex: 1000,
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 6,
            padding: '6px 14px',
            fontSize: 11,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            color: '#666',
          }}
        >
          Sign out
        </button>
        <iframe
          ref={iframeRef}
          srcDoc={content}
          style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
          title={`${name}'s report`}
        />
      </div>
    )
  }

  // Markdown fallback for older reports
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
          <button onClick={handleSignOut} className="text-xs text-stone-400 hover:text-stone-600 transition">
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
