require('dotenv').config()
const { Client } = require('pg')
const words = require('../data/hsk_words.js')

const DATABASE_URL =
  process.env.DATABASE_URL ||
  `postgres://node_user:${encodeURIComponent(process.env.PG_PASSWORD || '')}@${process.env.PG_HOST || 'localhost'}:5432/${process.env.PG_DATABASE || 'ariunmurdb'}`

async function main() {
  const client = new Client({ connectionString: DATABASE_URL })
  await client.connect()
  console.log('Connected to database')

  const schema = require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'schema.sql'), 'utf8')
  await client.query(schema)
  console.log('Schema ready')

  for (const w of words) {
    await client.query(
      `INSERT INTO words (hsk_level, simplified, pinyin, meaning_mn, meaning_en)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (simplified, pinyin)
       DO UPDATE SET hsk_level = EXCLUDED.hsk_level,
                     meaning_mn = EXCLUDED.meaning_mn,
                     meaning_en = EXCLUDED.meaning_en`,
      [w.hsk_level, w.simplified, w.pinyin, w.meaning_mn, w.meaning_en || null]
    )
  }

  const counts = await client.query('SELECT hsk_level, COUNT(*) FROM words GROUP BY hsk_level ORDER BY hsk_level')
  console.table(counts.rows)
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
