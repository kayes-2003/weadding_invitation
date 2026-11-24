import { createContext, useContext, useEffect, useState } from 'react'
import { fade } from '../lib/theme'

const Decor = createContext({})

function useCountdown(date) {
  const calc = () => Math.max(0, new Date(date) - new Date())
  const [ms, setMs] = useState(calc)
  useEffect(() => {
    const t = setInterval(() => setMs(calc()), 1000)
    return () => clearInterval(t)
  }, [date])
  return [['Days', Math.floor(ms / 864e5)], ['Hours', Math.floor(ms / 36e5) % 24], ['Minutes', Math.floor(ms / 6e4) % 60], ['Seconds', Math.floor(ms / 1e3) % 60]]
}

function Divider({ src }) {
  if (src) return <img src={src} alt="" className="mx-auto mb-10 h-10" />
  return (
    <svg viewBox="0 0 200 16" className="mx-auto mb-10 h-4 text-coral" aria-hidden="true">
      <path d="M0 8H80M120 8H200" stroke="currentColor" strokeWidth="1.5" />
      <path d="M100 1L107 8L100 15L93 8Z" fill="currentColor" />
    </svg>
  )
}

const Section = ({ id, title, className = '', children }) => {
  const d = useContext(Decor)
  return (
    <section id={id} className={`relative overflow-hidden px-6 py-20 ${className}`}>
      {d.cornerImage && (
        <>
          <img src={d.cornerImage} alt="" className="pointer-events-none absolute left-0 top-0 w-24 sm:w-36" />
          <img src={d.cornerImage} alt="" className="pointer-events-none absolute right-0 top-0 w-24 -scale-x-100 sm:w-36" />
        </>
      )}
      <div className="relative mx-auto max-w-3xl">
        <h2 className="mb-2 text-center font-script text-5xl sm:text-7xl">{title}</h2>
        <Divider src={d.dividerImage} />
        {children}
      </div>
    </section>
  )
}

function Rsvp() {
  const [f, setF] = useState({ name: '', guests: 1, attending: true, message: '' })
  const [state, setState] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    setState('sending')
    const r = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
    setState(r.ok ? 'done' : 'error')
  }
  if (state === 'done') return <p className="text-center text-xl">Thank you. We have your reply.</p>
  const input = 'w-full rounded border-2 border-plum/20 bg-white px-3 py-2'
  return (
    <form onSubmit={submit} className="mx-auto grid max-w-md gap-4">
      <input className={input} placeholder="Your name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <input className={input} type="number" min="1" max="20" value={f.guests} onChange={(e) => setF({ ...f, guests: e.target.value })} aria-label="Number of guests" />
      <select className={input} value={f.attending} onChange={(e) => setF({ ...f, attending: e.target.value === 'true' })}>
        <option value="true">Joyfully attending</option>
        <option value="false">Regretfully declining</option>
      </select>
      <textarea className={input} rows="3" placeholder="A message for the couple" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      <button disabled={state === 'sending'} className="rounded bg-coral px-6 py-3 font-bold text-white disabled:opacity-60">Send reply</button>
      {state === 'error' && <p className="text-rose">Something went wrong. Please try again.</p>}
    </form>
  )
}

export default function Invitation({ c }) {
  const time = useCountdown(c.couple.date)
  const decor = c.decor
  const d = new Date(c.couple.date)
  const dateText = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Decor.Provider value={decor}>
    <main style={decor.patternImage ? { backgroundImage: `url(${decor.patternImage})`, backgroundSize: '380px' } : undefined}>
      <header className="text-center">
        {decor.headerImage && <img src={decor.headerImage} alt="" className="mx-auto w-full max-w-3xl" style={fade('bottom')} />}
        <div className="-mt-6 px-6 sm:-mt-16">
          <p className="font-script text-6xl text-coral sm:text-7xl">{decor.welcomeText}</p>
          <p className="mx-auto mt-6 max-w-xs font-display text-2xl sm:text-3xl">{decor.inviteText}</p>
          <h1 className="my-8 font-display text-4xl font-bold text-coral sm:text-6xl">{c.couple.names}</h1>
          <div className="mx-auto grid max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-5">
            <div>
              <p className="font-display text-2xl">Date &amp; Time</p>
              <p className="mt-1 font-bold text-coral">{d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold text-coral">{d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
            </div>
            <span className="h-16 w-0.5 bg-coral" />
            <div>
              <p className="font-display text-2xl">Venue</p>
              <p className="mt-1 font-bold text-coral">{c.couple.venue}</p>
              <p className="font-bold text-coral">{c.couple.city}</p>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-md">{c.couple.tagline}</p>
        </div>
        {decor.footerImage && <img src={decor.footerImage} alt="" className="mx-auto mt-6 w-full max-w-3xl" style={fade('top')} />}
      </header>

      <Section id="countdown" title="Counting down" className="bg-marigold">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {time.map(([label, n]) => (
            <div key={label} className="rounded bg-paper py-6 text-center">
              <div className="font-display text-5xl font-bold tabular-nums">{String(n).padStart(2, '0')}</div>
              <div className="mt-1 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="story" title="Our story">
        <ol className="space-y-8 border-l-4 border-coral pl-6">
          {c.story.map((s, i) => (
            <li key={i}>
              <p className="font-display text-2xl text-rose">{s.year}</p>
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="mt-1 max-w-prose leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="celebration" title="The celebration" className="bg-teal text-paper">
        <div className="grid gap-5 sm:grid-cols-3">
          {c.celebration.map((e, i) => (
            <article key={i} className="rounded bg-paper p-5 text-plum">
              <h3 className="font-display text-2xl font-bold">{e.title}</h3>
              <p className="mt-2 font-bold text-coral">{e.time}</p>
              <p className="text-sm">{e.place}</p>
              <p className="mt-3 leading-relaxed">{e.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="day" title="The day">
        <ul className="divide-y divide-plum/15">
          {c.theDay.map((t, i) => (
            <li key={i} className="flex gap-6 py-4"><span className="w-24 shrink-0 font-bold text-rose">{t.time}</span><span>{t.title}</span></li>
          ))}
        </ul>
      </Section>

      <Section id="dress" title="Dress code" className="bg-plum text-paper">
        <p className="mx-auto max-w-prose text-center text-lg leading-relaxed">{c.dressCode.text}</p>
        <div className="mt-8 flex justify-center gap-4">
          {c.dressCode.colors.map((col) => <span key={col} title={col} className="h-14 w-14 rounded-full border-2 border-paper/40" style={{ background: col }} />)}
        </div>
      </Section>

      <Section id="stay" title="Where to stay">
        <div className="grid gap-5 sm:grid-cols-2">
          {c.stay.map((h, i) => (
            <article key={i} className="rounded border-2 border-teal p-5">
              <h3 className="font-display text-2xl font-bold">{h.name}</h3>
              <p className="text-teal">{h.distance}</p>
              <p className="mt-2">{h.note}</p>
              {h.link && <a href={h.link} target="_blank" rel="noreferrer" className="mt-3 inline-block font-bold text-coral underline">View hotel</a>}
            </article>
          ))}
        </div>
      </Section>

      <Section id="gifts" title="Wedding gift" className="bg-marigold">
        <p className="mx-auto max-w-prose text-center text-lg leading-relaxed">{c.gifts.text}</p>
        <ul className="mx-auto mt-6 max-w-sm space-y-2">
          {c.gifts.items.map((g, i) => <li key={i} className="flex justify-between rounded bg-paper px-4 py-3"><b>{g.label}</b><span>{g.detail}</span></li>)}
        </ul>
      </Section>

      <Section id="rsvp" title="Will you join us?"><Rsvp /></Section>

      <footer className="bg-plum py-10 text-center font-display text-xl text-paper">{c.footer}</footer>
    </main>
    </Decor.Provider>
  )
}
