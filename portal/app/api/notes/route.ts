import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { pool } from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clientId = request.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  // Verify the session email owns this clientId
  const ownership = await pool.query(
    'SELECT id FROM clients WHERE id = $1 AND email = $2',
    [clientId, session.email]
  )
  if (ownership.rows.length === 0) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const result = await pool.query(
    'SELECT section_key, content FROM section_notes WHERE client_id = $1',
    [clientId]
  )

  return NextResponse.json(result.rows)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId, sectionKey, content } = await request.json()

  // Verify ownership
  const ownership = await pool.query(
    'SELECT id FROM clients WHERE id = $1 AND email = $2',
    [clientId, session.email]
  )
  if (ownership.rows.length === 0) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await pool.query(
    `INSERT INTO section_notes (client_id, section_key, content, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (client_id, section_key)
     DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`,
    [clientId, sectionKey, content]
  )

  return NextResponse.json({ ok: true })
}
