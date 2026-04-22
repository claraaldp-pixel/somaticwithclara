'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addClient, saveReport, togglePublish, loadReportContent } from './actions'

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

  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [addingClient, setAddingClient] = useState(false)

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [reportContent, setReportContent] = useState('')
  const [savingReport, setSavingReport] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [error, setError] = useState('')

  const reportMap = Object.fromEntries(reports.map((r) => [r.client_id, r]))

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault()
    setAddingClient(true)
    setError('')
    const form = new FormData()
    form.append('name', newName)
    form.append('email', newEmail)
    form.append('slug', newSlug)
    try {
      await addClient(form)
      setNewName(''); setNewEmail(''); setNewSlug('')
      setStatusMsg('Client added.')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add client.')
    }
    setAddingClient(false)
  }

  async function handleSelectClient(clientId: string) {
    setSelectedClientId(clientId)
    setStatusMsg('')
    setError('')
    const content = await loadReportContent(clientId)
    setReportContent(content)
  }

  async function handleSaveReport(publish: boolean) {
    if (!selectedClientId) return
    setSavingReport(true)
    setStatusMsg('')
    setError('')
    try {
      await saveReport(selectedClientId, reportContent, publish)
      setStatusMsg(publish ? 'Report published — client can now see it.' : 'Draft saved.')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save report.')
    }
    setSavingReport(false)
  }

  async function handleTogglePublish(clientId: string) {
    const report = reportMap[clientId]
    if (!report) return
    try {
      await togglePublish(report.id, report.published)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to toggle.')
    }
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
                  onClick={() => handleSelectClient(c.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-800 text-sm font-medium">{c.name}</p>
                      <p className="text-stone-400 text-xs mt-0.5">slug: {c.slug}</p>
                    </div>
                    {report && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleTogglePublish(c.id) }}
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

          <details className="group">
            <summary className="text-xs text-stone-400 cursor-pointer hover:text-stone-600 transition list-none">
              + Add new client
            </summary>
            <form onSubmit={handleAddClient} className="mt-3 space-y-2">
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

          {error && <p className="text-xs text-red-500">{error}</p>}
          {statusMsg && <p className="text-xs text-stone-500">{statusMsg}</p>}
        </div>

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
                  onClick={() => handleSaveReport(false)}
                  disabled={savingReport}
                  className="flex-1 py-2 border border-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-100 transition disabled:opacity-50"
                >
                  Save draft
                </button>
                <button
                  onClick={() => handleSaveReport(true)}
                  disabled={savingReport}
                  className="flex-1 py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-700 transition disabled:opacity-50"
                >
                  Publish
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
