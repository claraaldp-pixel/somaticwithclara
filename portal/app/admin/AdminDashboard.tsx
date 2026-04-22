'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  name: string
  email: string
  slug: string
  created_at: string
}

interface Report {
  id: string
  client_id: string
  published: boolean
  updated_at: string
}

interface Props {
  clients: Client[]
  reports: Report[]
}

export default function AdminDashboard({ clients, reports }: Props) {
  const router = useRouter()
  const supabase = createClient()

  // New client form
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [addingClient, setAddingClient] = useState(false)

  // Report editor
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [reportContent, setReportContent] = useState('')
  const [savingReport, setSavingReport] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const reportMap = Object.fromEntries(reports.map((r) => [r.client_id, r]))

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  async function addClient(e: React.FormEvent) {
    e.preventDefault()
    setAddingClient(true)
    const { error } = await supabase.from('clients').insert({
      name: newName,
      email: newEmail,
      slug: newSlug || autoSlug(newName),
    })
    if (error) {
      setStatusMsg('Error adding client: ' + error.message)
    } else {
      setNewName(''); setNewEmail(''); setNewSlug('')
      setStatusMsg('Client added.')
      router.refresh()
    }
    setAddingClient(false)
  }

  async function loadReport(clientId: string) {
    setSelectedClientId(clientId)
    const { data } = await supabase
      .from('reports')
      .select('content')
      .eq('client_id', clientId)
      .single()
    setReportContent(data?.content ?? '')
  }

  async function saveReport(publish: boolean) {
    if (!selectedClientId) return
    setSavingReport(true)
    setStatusMsg('')

    const existing = reportMap[selectedClientId]
    if (existing) {
      await supabase.from('reports').update({
        content: reportContent,
        published: publish,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('reports').insert({
        client_id: selectedClientId,
        content: reportContent,
        published: publish,
      })
    }

    setStatusMsg(publish ? 'Report published — client can now see it.' : 'Draft saved.')
    setSavingReport(false)
    router.refresh()
  }

  async function togglePublish(clientId: string) {
    const report = reportMap[clientId]
    if (!report) return
    await supabase.from('reports').update({ published: !report.published }).eq('id', report.id)
    router.refresh()
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId)

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <p className="text-xs uppercase tracking-widest text-stone-400">Regulation by Design</p>
          <h1 className="text-lg font-light text-stone-800 mt-0.5">Admin</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Left: client list + add */}
        <div className="space-y-6">
          <h2 className="text-sm uppercase tracking-widest text-stone-400">Clients</h2>

          <ul className="space-y-2">
            {clients.map((c) => {
              const report = reportMap[c.id]
              return (
                <li
                  key={c.id}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedClientId === c.id
                      ? 'border-stone-400 bg-white'
                      : 'border-stone-100 bg-white hover:border-stone-200'
                  }`}
                  onClick={() => loadReport(c.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-800 text-sm font-medium">{c.name}</p>
                      <p className="text-stone-400 text-xs mt-0.5">slug: {c.slug}</p>
                    </div>
                    {report && (
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePublish(c.id) }}
                        className={`text-xs px-2 py-1 rounded-full border transition ${
                          report.published
                            ? 'border-green-200 text-green-600 bg-green-50'
                            : 'border-stone-200 text-stone-400'
                        }`}
                      >
                        {report.published ? 'Live' : 'Draft'}
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Add client */}
          <details className="group">
            <summary className="text-xs text-stone-400 cursor-pointer hover:text-stone-600 transition list-none">
              + Add new client
            </summary>
            <form onSubmit={addClient} className="mt-3 space-y-2">
              <input
                required
                placeholder="Full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
              <input
                placeholder="Slug (auto-generated if blank)"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
              <button
                type="submit"
                disabled={addingClient}
                className="w-full py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-700 transition disabled:opacity-50"
              >
                {addingClient ? 'Adding…' : 'Add client'}
              </button>
            </form>
          </details>
        </div>

        {/* Right: report editor */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-stone-400">
            {selectedClient ? `Report — ${selectedClient.name}` : 'Select a client'}
          </h2>

          {selectedClientId && (
            <>
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                rows={22}
                placeholder="Paste or edit the markdown report here…"
                className="w-full px-4 py-3 text-sm border border-stone-200 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => saveReport(false)}
                  disabled={savingReport}
                  className="flex-1 py-2 border border-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-100 transition disabled:opacity-50"
                >
                  Save draft
                </button>
                <button
                  onClick={() => saveReport(true)}
                  disabled={savingReport}
                  className="flex-1 py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-700 transition disabled:opacity-50"
                >
                  Publish
                </button>
              </div>
              {statusMsg && (
                <p className="text-xs text-stone-500">{statusMsg}</p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
