import { db } from './_db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, guests, attending, message } = req.body || {}
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' })
  const { error } = await db.from('rsvps').insert({
    name: name.trim().slice(0, 100),
    guests: Math.min(Number(guests) || 1, 20),
    attending: attending !== false,
    message: (message || '').slice(0, 500),
  })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
}