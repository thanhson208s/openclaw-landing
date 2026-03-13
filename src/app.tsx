import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import type { JSX } from 'preact'
import './app.css'
import { FooterBar } from './components/FooterBar'
import { ProfilePanel } from './components/ProfilePanel'
import { StatusPanel } from './components/StatusPanel'
import { commandReplies, evaluateStatus, fallbackStatus, presetCommands } from './lib/status'
import type { CommandKey, PublicStatus, TerminalEntry } from './lib/types'

export function App() {
  const [status, setStatus] = useState<PublicStatus>(evaluateStatus(fallbackStatus))
  const [heartBursts, setHeartBursts] = useState<number[]>([])
  const [input, setInput] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [terminal, setTerminal] = useState<TerminalEntry[]>([
    { id: 1, role: 'output', text: 'type help to see list of command' },
  ])
  const terminalHistoryRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/status.json', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('status fetch failed')
        }
        try {
          return evaluateStatus(await res.json())
        } catch {
          throw new Error('status parse failed')
        }
      })
      .then((data) => {
        if (!cancelled) setStatus(data)
      })
      .catch(() => {
        if (!cancelled) setStatus(evaluateStatus(fallbackStatus))
      })

    return () => {
      cancelled = true
    }
  }, [])

  const themeClass = useMemo(() => `theme-${status.theme ?? 'night'} status-${status.status}`, [status])

  useEffect(() => {
    const el = terminalHistoryRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [terminal])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % presetCommands.length)
    }, 2000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const sendHeart = () => {
    const id = Date.now()
    setHeartBursts((current) => [...current, id])
    setTimeout(() => {
      setHeartBursts((current) => current.filter((item) => item !== id))
    }, 1500)
  }

  const submitCommand = (event?: Event | JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event?.preventDefault?.()
    const raw = input.trim()
    if (!raw) return

    const command = raw.toLowerCase() as CommandKey
    const nextEntries: TerminalEntry[] = [{ id: Date.now(), role: 'input', text: raw }]

    const response = commandReplies[command]
      ? commandReplies[command]()
      : `unknown command: ${raw}`

    if (response) {
      nextEntries.push({ id: Date.now() + 1, role: 'output', text: response })
    }

    setTerminal((current) => [...current.slice(-6), ...nextEntries])
    setInput('')
  }

  const inputPlaceholder = presetCommands[placeholderIndex]

  return (
    <main class={`app-shell ${themeClass}`}>
      <div class="background-grid" />

      <header class="topbar">
        <div class="brandline">
          <span class="topbar-tag">openclaw.gootube.online</span>
          <span class="cursor-blink">_</span>
        </div>
      </header>

      <section class="layout-grid">
        <ProfilePanel
          heartBursts={heartBursts}
          onHeart={sendHeart}
          terminal={terminal}
          terminalHistoryRef={terminalHistoryRef}
          input={input}
          inputPlaceholder={inputPlaceholder}
          setInput={setInput}
          submitCommand={submitCommand}
        />
        <StatusPanel status={status} />
      </section>

      <FooterBar />
    </main>
  )
}
