import { db, isAdmin } from './_db.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await db.from('invitation').select('content').eq('id', 1).maybeSingle()
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data?.content ?? null)
  }
  if (req.method === 'PUT') {
    if (!(await isAdmin(req))) return res.status(401).json({ error: 'Not allowed' })
    const { error } = await db
      .from('invitation')
      .upsert({ id: 1, content: req.body, updated_at: new Date().toISOString() })
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }
  res.status(405).end()
}