import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import defaultContent from '../defaultContent'
import { applyTheme, merge } from '../lib/theme'

const pretty = (k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
const blank = (v) => (typeof v === 'string' ? '' : Array.isArray(v) ? [] : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)])))
const btn = 'rounded px-3 py-1 text-sm font-bold'

// Renders any JSON shape as editable fields
function Editor({ value, onChange, label, name }) {
  if (Array.isArray(value))
    return (
      <div className="my-3">
        <h4 className="font-bold">{label}</h4>
        {value.map((v, i) => (
          <div key={i} className="my-2 border-l-4 border-marigold pl-3">
            <Editor value={v} label={`Item ${i + 1}`} onChange={(nv) => onChange(value.map((x, j) => (j === i ? nv : x)))} />
            <button className={`${btn} bg-rose text-white`} onClick={() => onChange(value.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button className={`${btn} bg-teal text-white`} onClick={() => onChange([...value, value.length ? blank(value[0]) : ''])}>Add item</button>
      </div>
    )
  if (value && typeof value === 'object')
    return (
      <div className="my-3 space-y-2">
        {label && <h3 className="font-display text-xl font-bold">{label}</h3>}
        {Object.keys(value).map((k) => <Editor key={k} name={k} label={pretty(k)} value={value[k]} onChange={(nv) => onChange({ ...value, [k]: nv })} />)}
      </div>
    )
  const cls = 'w-full rounded border-2 border-plum/20 bg-white px-3 py-2'
  if (/image$/i.test(name || '')) return <ImageField label={label} value={value} onChange={onChange} cls={cls} />
  if (/^#[0-9a-f]{6}$/i.test(value))
    return (
      <label className="flex items-center gap-3 text-sm">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12" />
        <span className="w-32">{label}</span>
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    )
  return (
    <label className="block text-sm">
      {label}
      {String(value).length > 60
        ? <textarea className={cls} rows="3" value={value} onChange={(e) => onChange(e.target.value)} />
        : <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} />}
    </label>
  )
}

function ImageField({ label, value, onChange, cls }) {
  const [busy, setBusy] = useState(false)
  const upload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBusy(true)
    const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
    const { error } = await supabase.storage.from('invitation').upload(path, file)
    if (error) alert(error.message)
    else onChange(supabase.storage.from('invitation').getPublicUrl(path).data.publicUrl)
    setBusy(false)
  }
  return (
    <div className="space-y-2 text-sm">
      <p>{label}</p>
      {value && <img src={value} alt="" className="h-28 rounded border-2 border-plum/20 bg-white object-contain" />}
      <input type="file" accept="image/*" onChange={upload} />
      {busy && <span> Uploading...</span>}
      <input className={cls} placeholder="or paste an image link" value={value} onChange={(e) => onChange(e.target.value)} />
      {value && <button className={`${btn} bg-rose text-white`} onClick={() => onChange('')}>Remove image</button>}
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [creds, setCreds] = useState({ email: '', password: '' })
  const [content, setContent] = useState(defaultContent)
  const [rsvps, setRsvps] = useState([])
  const [msg, setMsg] = useState('')
  useEffect(() => applyTheme(content.theme), [content.theme]) // live preview of colours and fonts

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const auth = () => ({ Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' })

  useEffect(() => {
    if (!session) return
    fetch('/api/invitation').then((r) => r.json()).then((c) => c && setContent(merge(defaultContent, c)))
    fetch('/api/rsvps', { headers: auth() }).then((r) => r.json()).then((r) => Array.isArray(r) && setRsvps(r))
  }, [session])

  const login = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword(creds)
    setMsg(error ? error.message : '')
  }

  const save = async () => {
    setMsg('Saving...')
    const r = await fetch('/api/invitation', { method: 'PUT', headers: auth(), body: JSON.stringify(content) })
    setMsg(r.ok ? 'Saved. Your invitation is updated.' : 'Could not save. Check that this email is in ADMIN_EMAILS.')
  }

  if (!session)
    return (
      <form onSubmit={login} className="mx-auto mt-24 grid max-w-sm gap-3 p-6">
        <h1 className="font-display text-3xl font-bold">Admin sign in</h1>
        <input className="rounded border-2 border-plum/20 px-3 py-2" type="email" placeholder="Email" onChange={(e) => setCreds({ ...creds, email: e.target.value })} />
        <input className="rounded border-2 border-plum/20 px-3 py-2" type="password" placeholder="Password" onChange={(e) => setCreds({ ...creds, password: e.target.value })} />
        <button className="rounded bg-coral px-4 py-2 font-bold text-white">Sign in</button>
        {msg && <p className="text-rose">{msg}</p>}
      </form>
    )

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-paper py-3">
        <h1 className="mr-auto font-display text-3xl font-bold">Edit invitation</h1>
        <a href="/" className={`${btn} border-2 border-plum`}>View site</a>
        <button onClick={save} className={`${btn} bg-coral text-white`}>Save changes</button>
        <button onClick={() => supabase.auth.signOut()} className={`${btn} border-2 border-plum`}>Sign out</button>
      </div>
      {msg && <p className="mb-4 font-bold text-teal">{msg}</p>}
      <Editor value={content} onChange={setContent} />

      <h2 className="mt-12 font-display text-3xl font-bold">Replies ({rsvps.length})</h2>
      <ul className="mt-3 divide-y divide-plum/15">
        {rsvps.map((r) => (
          <li key={r.id} className="py-2">
            <b>{r.name}</b> {r.attending ? `is coming with ${r.guests}` : 'is not coming'}
            {r.message && <p className="text-sm text-plum/70">{r.message}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
