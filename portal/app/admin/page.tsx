import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  if (user.email !== process.env.ADMIN_EMAIL) redirect('/dashboard')

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured on the server.')
  }

  const admin = createAdminClient()

  const { data: clients } = await admin
    .from('clients')
    .select('id, name, email, slug, created_at')
    .order('created_at', { ascending: false })

  const { data: reports } = await admin
    .from('reports')
    .select('id, client_id, published, updated_at')

  return <AdminDashboard clients={clients ?? []} reports={reports ?? []} />
}
