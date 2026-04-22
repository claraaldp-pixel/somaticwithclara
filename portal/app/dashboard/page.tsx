import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import ReportView from './ReportView'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: client } = await supabase
    .from('clients')
    .select('id, name')
    .eq('email', user.email)
    .single()

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

  const { data: report } = await supabase
    .from('reports')
    .select('content, updated_at')
    .eq('client_id', client.id)
    .eq('published', true)
    .single()

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

  return <ReportView name={client.name} clientId={client.id} content={report.content} updatedAt={report.updated_at} />
}
