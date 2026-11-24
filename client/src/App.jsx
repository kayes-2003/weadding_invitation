import { useEffect, useState } from 'react'
import Envelope from './components/Envelope'
import Invitation from './components/Invitation'
import defaultContent from './defaultContent'
import { applyTheme, merge } from './lib/theme'

export default function App() {
  const [content, setContent] = useState(defaultContent)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    fetch('/api/invitation').then((r) => r.json()).then((c) => c && setContent(merge(defaultContent, c))).catch(() => {})
  }, [])
  useEffect(() => applyTheme(content.theme), [content.theme])

  return (
    <>
      <Invitation c={content} />
      {!opened && <Envelope c={content} onDone={() => setOpened(true)} />}
    </>
  )
}
