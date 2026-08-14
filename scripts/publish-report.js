#!/usr/bin/env node
/**
 * Publishes a report file to the Regulation by Design client portal.
 *
 * Usage:
 *   node scripts/publish-report.js <file> [--slug <slug>]
 *
 * Run from the project root (Human Design + Nervous System/).
 * The slug is derived from the filename by default.
 * The client must already exist in the admin dashboard with that slug.
 */

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

// Load env from portal/portal/.env.local
const envPath = path.join(__dirname, '..', 'portal', '.env.local')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  })
}

if (!process.env.DATABASE_URL) {
  console.error('❌  DATABASE_URL not configured in portal/portal/.env.local')
  process.exit(1)
}

const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node scripts/publish-report.js <file> [--slug <slug>]')
  process.exit(1)
}

const slugFlagIdx = process.argv.indexOf('--slug')
const slugOverride = slugFlagIdx !== -1 ? process.argv[slugFlagIdx + 1] : null

const absolutePath = path.resolve(filePath)
if (!fs.existsSync(absolutePath)) {
  console.error(`❌  File not found: ${absolutePath}`)
  process.exit(1)
}

const slug = slugOverride || path.basename(absolutePath, path.extname(absolutePath))
const content = fs.readFileSync(absolutePath, 'utf8')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

;(async () => {
  console.log(`\nPublishing report for slug: ${slug}`)

  const clientResult = await pool.query(
    'SELECT id, name FROM clients WHERE slug = $1',
    [slug]
  )

  if (clientResult.rows.length === 0) {
    console.error(`❌  No client found with slug "${slug}".`)
    console.error(`   Add this client in the admin dashboard first: /admin`)
    await pool.end()
    process.exit(1)
  }

  const client = clientResult.rows[0]
  console.log(`✓  Client: ${client.name}`)

  const existing = await pool.query(
    'SELECT id FROM reports WHERE client_id = $1',
    [client.id]
  )

  if (existing.rows.length > 0) {
    await pool.query(
      'UPDATE reports SET content = $1, published = true, updated_at = NOW() WHERE client_id = $2',
      [content, client.id]
    )
    console.log(`✓  Report updated and published.`)
  } else {
    await pool.query(
      'INSERT INTO reports (client_id, content, published) VALUES ($1, $2, true)',
      [client.id, content]
    )
    console.log(`✓  Report created and published.`)
  }

  console.log(`\n🌿  ${client.name}'s report is now live.\n`)
  await pool.end()
})().catch(async (err) => {
  console.error('❌  Unexpected error:', err.message)
  await pool.end()
  process.exit(1)
})
