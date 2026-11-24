import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const app = express()
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const admins = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase())

app.use(cors())
app.use(express.json({ limit: '1mb' }))

async function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  const { data, error } = await db.auth.getUser(token)
  if (error || !admins.includes((data.user?.email || '').toLowerCase()))
    return res.status(401).json({ error: 'Not allowed' })
  next()
}

app.get('/api/invitation', async (_req, res) => {
  const { data, error } = await db.from('invitation').select('content').eq('id', 1).maybeSingle()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data?.content ?? null)
})

app.put('/api/invitation', requireAdmin, async (req, res) => {
  const { error } = await db
    .from('invitation')
    .upsert({ id: 1, content: req.body, updated_at: new Date().toISOString() })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

app.post('/api/rsvp', async (req, res) => {
  const { name, guests, attending, message } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' })
  const { error } = await db.from('rsvps').insert({
    name: name.trim().slice(0, 100),
    guests: Math.min(Number(guests) || 1, 20),
    attending: attending !== false,
    message: (message || '').slice(0, 500),
  })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

app.get('/api/rsvps', requireAdmin, async (_req, res) => {
  const { data, error } = await db.from('rsvps').select('*').order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// Serve the built React app in production
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist')
app.use(express.static(dist))
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))

app.listen(process.env.PORT || 5000, () => console.log('API running'))
