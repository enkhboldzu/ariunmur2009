require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const { Pool } = require('pg')

const app = express()

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT || 5432),
  database: process.env.PG_DATABASE || 'ariunmurdb',
  user: process.env.PG_USER || 'node_user',
  password: process.env.PG_PASSWORD,
})

const allowedOrigins = [
  ...(process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean),
]
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// ── API routes ────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/words', async (req, res, next) => {
  try {
    const { level, q } = req.query
    const conditions = []
    const params = []

    if (level) {
      params.push(Number(level))
      conditions.push(`hsk_level = $${params.length}`)
    }
    if (q) {
      params.push(`%${q}%`)
      conditions.push(`(simplified ILIKE $${params.length} OR pinyin ILIKE $${params.length} OR meaning_mn ILIKE $${params.length} OR meaning_en ILIKE $${params.length})`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const sortKey =
      `TRANSLATE(LOWER(pinyin), 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü', 'aaaaeeeeiiiioooouuuuuuuuuu')`
    const { rows } = await pool.query(
      `SELECT id, hsk_level, simplified, pinyin, meaning_mn, meaning_en,
              pos, pos_mn, collocations, sentences, extensions,
              ROW_NUMBER() OVER (PARTITION BY hsk_level ORDER BY ${sortKey}, pinyin, id)::int AS rank
       FROM words ${where}
       ORDER BY hsk_level, ${sortKey}, pinyin, id`,
      params
    )
    res.json({ count: rows.length, words: rows })
  } catch (err) {
    next(err)
  }
})

app.get('/api/words/stats', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT hsk_level, COUNT(*)::int AS count FROM words GROUP BY hsk_level ORDER BY hsk_level`
    )
    res.json({ stats: rows })
  } catch (err) {
    next(err)
  }
})

app.get('/api/words/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, hsk_level, simplified, pinyin, meaning_mn, meaning_en, pos, pos_mn, collocations, sentences, extensions FROM words WHERE id = $1',
      [Number(req.params.id)]
    )
    if (!rows.length) return res.status(404).json({ error: 'Word not found' })
    res.json({ word: rows[0] })
  } catch (err) {
    next(err)
  }
})

// ── SPA catch-all (must be last) ──────────────────────────────────────────────

app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`)
})
