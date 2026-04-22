import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Only allow Clara's admin email
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/dashboard')

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, email, slug, created_at')
    .order('created_at', { ascending: false })

  const { data: reports } = await supabase
    .from('reports')
    .select('id, client_id, published, updated_at')

  return <AdminDashboard clients={clients ?? []} reports={reports ?? []} />
}
