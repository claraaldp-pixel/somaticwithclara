import { Pool } from 'pg'

const globalForPg = global as typeof global & { _pgPool?: Pool }

if (!globalForPg._pgPool) {
  globalForPg._pgPool = new Pool({ connectionString: process.env.DATABASE_URL })
}

export const pool = globalForPg._pgPool
