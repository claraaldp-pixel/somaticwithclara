'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { pool } from '@/lib/db'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.email !== process.env.ADMIN_EMAIL) redirect('/login')
}

export async function addClient(formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const slug = formData.get('slug') as string ||
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  await pool.query(
    'INSERT INTO clients (name, email, slug) VALUES ($1, $2, $3)',
    [name, email.toLowerCase().trim(), slug]
  )
}

export async function saveReport(clientId: string, content: string, publish: boolean) {
  await requireAdmin()

  const existing = await pool.query(
    'SELECT id FROM reports WHERE client_id = $1',
    [clientId]
  )

  if (existing.rows.length > 0) {
    await pool.query(
      'UPDATE reports SET content = $1, published = $2, updated_at = NOW() WHERE client_id = $3',
      [content, publish, clientId]
    )
  } else {
    await pool.query(
      'INSERT INTO reports (client_id, content, published) VALUES ($1, $2, $3)',
      [clientId, content, publish]
    )
  }
}

export async function togglePublish(reportId: string, current: boolean) {
  await requireAdmin()
  await pool.query(
    'UPDATE reports SET published = $1 WHERE id = $2',
    [!current, reportId]
  )
}

export async function loadReportContent(clientId: string): Promise<string> {
  await requireAdmin()
  const result = await pool.query(
    'SELECT content FROM reports WHERE client_id = $1',
    [clientId]
  )
  return result.rows[0]?.content ?? ''
}
