import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { pool } from '@/lib/db'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.email !== process.env.ADMIN_EMAIL) redirect('/dashboard')

  const clientsResult = await pool.query(
    'SELECT id, name, email, slug, created_at FROM clients ORDER BY created_at DESC'
  )
  const reportsResult = await pool.query(
    'SELECT id, client_id, published, updated_at FROM reports'
  )

  return (
    <AdminDashboard
      clients={clientsResult.rows}
      reports={reportsResult.rows}
    />
  )
}
