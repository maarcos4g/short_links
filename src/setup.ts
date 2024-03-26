import { sql } from '@/lib/postgres'

async function setup() {
  try {
    await sql/*sql*/`
      CREATE TABLE IF NOT EXISTS short_links (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE,
        original_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('🔥 Setup done successfully!')
  } catch (error) {
    console.error('Error during setup:', error)
  } finally {
    await sql.end()
  }
}

setup();