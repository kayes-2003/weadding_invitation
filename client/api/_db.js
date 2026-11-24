import { createClient } from '@supabase/supabase-js'

export const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

export async function isAdmin(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  const { data, error } = await db.auth.getUser(token)
  const admins = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase())
  return !error && admins.includes((data.user?.email || '').toLowerCase())
}