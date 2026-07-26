require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

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
