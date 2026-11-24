import { db, isAdmin } from './_db.js'

export default async function handler(req, res) {
  if (!(await isAdmin(req))) return res.status(401).json({ error: 'Not allowed' })
  const { data, error } = await db.from('rsvps').select('*').order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}