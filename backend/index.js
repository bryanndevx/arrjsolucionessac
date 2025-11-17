import express from 'express'
const app = express()
const PORT = process.env.PORT || 3000

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' })
})

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' })
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
