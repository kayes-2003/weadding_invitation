const rgb = (h) => { const n = parseInt(h.slice(1), 16); return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}` }

export function applyTheme(t = {}) {
  const s = document.documentElement.style
  const colors = { bg: 'bg', ink: 'ink', accent: 'accent', accent2: 'accent2', band: 'band', band2: 'band2' }
  for (const k in colors) if (/^#[0-9a-f]{6}$/i.test(t[k] || '')) s.setProperty(`--${colors[k]}`, rgb(t[k]))
  if (t.scriptFont) s.setProperty('--f-script', `"${t.scriptFont}"`)
  if (t.displayFont) s.setProperty('--f-display', `"${t.displayFont}"`)
  if (t.bodyFont) s.setProperty('--f-body', `"${t.bodyFont}"`)
}

// Saved content may be older than the code: fill in any missing keys from the defaults
export function merge(d, s) {
  if (s === undefined || s === null) return d
  if (d && typeof d === 'object' && !Array.isArray(d)) {
    const out = { ...d }
    for (const k of Object.keys(s)) out[k] = merge(d[k], s[k])
    return out
  }
  return s
}

// Soft edge so a cropped decoration blends into the page
export const fade = (dir) => {
  const m = `linear-gradient(to ${dir}, #000 60%, transparent)`
  return { maskImage: m, WebkitMaskImage: m }
}
