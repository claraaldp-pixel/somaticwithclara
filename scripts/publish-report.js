#!/usr/bin/env node
/**
 * Publishes a report markdown file to the Regulation by Design client portal.
 *
 * Usage:
 *   node scripts/publish-report.js archive/analyses/sinead-d.md
 *
 * The slug is derived from the filename (e.g. sinead-d).
 * The client must already exist in the admin dashboard with that slug.
 *
 * Requires a .env file in this directory (or parent) with:
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

const fs = require('fs')
const path = require('path')

// Load env from portal/.env.local
const envPath = path.join(__dirname, '..', 'portal', '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY || SUPABASE_URL.startsWith('your_')) {
  console.error('❌  Supabase credentials not configured.')
  console.error('   Add your NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  console.error('   to portal/.env.local before publishing.')
  process.exit(1)
}

const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node scripts/publish-report.js archive/analyses/<slug>.md')
  process.exit(1)
}

const absolutePath = path.resolve(filePath)
if (!fs.existsSync(absolutePath)) {
  console.error(`❌  File not found: ${absolutePath}`)
  process.exit(1)
}

const slug = path.basename(absolutePath, '.md')
const content = fs.readFileSync(absolutePath, 'utf8')

async function post(endpoint, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  return { ok: res.ok, status: res.status, data: text ? JSON.parse(text) : null }
}

async function patch(endpoint, body, match) {
  const params = new URLSearchParams(match)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}?${params}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  return { ok: res.ok, status: res.status, data: text ? JSON.parse(text) : null }
}

async function get(endpoint, match) {
  const params = new URLSearchParams({ ...match, select: '*' })
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}?${params}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  })
  const text = await res.text()
  return { ok: res.ok, data: text ? JSON.parse(text) : [] }
}

;(async () => {
  console.log(`\nPublishing report for slug: ${slug}`)

  // Look up client by slug
  const { data: clients } = await get('clients', { slug: `eq.${slug}` })
  if (!clients || clients.length === 0) {
    console.error(`❌  No client found with slug "${slug}".`)
    console.error(`   Add this client in the admin dashboard first: /admin`)
    process.exit(1)
  }
  const client = clients[0]
  console.log(`✓  Client: ${client.name}`)

  // Check if a report already exists
  const { data: existing } = await get('reports', { client_id: `eq.${client.id}` })

  if (existing && existing.length > 0) {
    const result = await patch(
      'reports',
      { content, published: true, updated_at: new Date().toISOString() },
      { client_id: `eq.${client.id}` }
    )
    if (!result.ok) {
      console.error('❌  Failed to update report:', result.data)
      process.exit(1)
    }
    console.log(`✓  Report updated and published.`)
  } else {
    const result = await post('reports', {
      client_id: client.id,
      content,
      published: true,
    })
    if (!result.ok) {
      console.error('❌  Failed to create report:', result.data)
      process.exit(1)
    }
    console.log(`✓  Report created and published.`)
  }

  console.log(`\n🌿  ${client.name}'s report is now live.\n`)
})()
