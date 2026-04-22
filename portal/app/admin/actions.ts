'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/login')
  return user
}

export async function addClient(formData: FormData) {
  await requireAdmin()
  const admin = createAdminClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const slug = formData.get('slug') as string || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const { error } = await admin.from('clients').insert({ name, email, slug })
  if (error) throw new Error(error.message)
}

export async function saveReport(clientId: string, content: string, publish: boolean) {
  await requireAdmin()
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('reports')
    .select('id')
    .eq('client_id', clientId)
    .single()

  if (existing) {
    const { error } = await admin.from('reports').update({
      content,
      published: publish,
      updated_at: new Date().toISOString(),
    }).eq('id', existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await admin.from('reports').insert({
      client_id: clientId,
      content,
      published: publish,
    })
    if (error) throw new Error(error.message)
  }
}

export async function togglePublish(reportId: string, current: boolean) {
  await requireAdmin()
  const admin = createAdminClient()
  const { error } = await admin.from('reports').update({ published: !current }).eq('id', reportId)
  if (error) throw new Error(error.message)
}

export async function loadReportContent(clientId: string): Promise<string> {
  await requireAdmin()
  const admin = createAdminClient()
  const { data } = await admin.from('reports').select('content').eq('client_id', clientId).single()
  return data?.content ?? ''
}
