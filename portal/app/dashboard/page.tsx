import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { pool } from '@/lib/db'
import ReportView from './ReportView'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const clientResult = await pool.query(
    'SELECT id, name FROM clients WHERE email = $1',
    [session.email]
  )
  const client = clientResult.rows[0]

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-light text-stone-800">Report not yet available</h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Your personalised Regulation by Design report is being prepared. You'll receive an email when it's ready.
          </p>
        </div>
      </div>
    )
  }

  const reportResult = await pool.query(
    'SELECT content, updated_at FROM reports WHERE client_id = $1 AND published = true',
    [client.id]
  )
  const report = reportResult.rows[0]

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-light text-stone-800">Your report is on its way</h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Clara is preparing your analysis. You'll receive an email when it's published here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ReportView
      name={client.name}
      clientId={client.id}
      content={report.content}
      updatedAt={report.updated_at}
    />
  )
}
