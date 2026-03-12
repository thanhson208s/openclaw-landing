import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import type { JSX } from 'preact'
import './app.css'

type PublicStatus = {
  status: 'online' | 'stale' | 'offline' | 'maintenance'
  statusText: string
  lastUpdate: string
  nextCheck: string
  mood: string
  uptimeHuman?: string
  stale: boolean
  theme?: string
  visitsToday?: number
}

type CommandKey = 'help' | 'hello' | 'dance' | 'smile'

type TerminalEntry = {
  id: number
  role: 'input' | 'output'
  text: string
}

const fallbackStatus: PublicStatus = {
  status: 'stale',
  statusText: 'Signal is faint but present.',
  lastUpdate: new Date().toISOString(),
  nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  mood: 'Probably fine, not freshly verified.',
  stale: true,
  theme: 'night',
  visitsToday: 0,
}

const commandReplies: Record<CommandKey, () => string> = {
  help: () => 'available: help, hello, dance, smile',
  hello: () => 'hello',
  dance: () => 'dance',
  smile: () => 'smile',
}

function minutesUntil(value: string) {
  const diff = new Date(value).getTime() - Date.now()
  return Math.max(0, Math.round(diff / 60000))
}

function relativeAge(value: string) {
  const diffMin = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000))
  if (diffMin < 1) return 'just now'
  if (diffMin === 1) return '1 minute ago'
  if (diffMin < 60) return `${diffMin} minutes ago`
  const hours = Math.round(diffMin / 60)
  return hours === 1 ? '1 hour ago' : `${hours} hours ago`
}

function IconVisitors() {
  return <span aria-hidden="true">◎</span>
}

function IconHeart() {
  return <span aria-hidden="true">♥</span>
}

function IconPulse() {
  return <span aria-hidden="true">⌁</span>
}

function Avatar({ status }: { status: PublicStatus['status'] }) {
  const tone = status === 'online' ? '#7affc4' : status === 'stale' ? '#ffd166' : status === 'offline' ? '#ff6b6b' : '#8ab4ff'
  const eyeY = status === 'offline' ? 84 : 78
  const mouth = status === 'online' ? 'M110 122 Q160 146 210 122' : status === 'stale' ? 'M114 128 Q160 138 206 128' : 'M116 132 Q160 122 204 132'

  return (
    <svg viewBox="0 0 320 320" class="avatar" role="img" aria-label="Brandy avatar">
      <defs>
        <radialGradient id="halo" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color={tone} stop-opacity="0.35" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect x="22" y="22" width="276" height="276" rx="18" fill="url(#halo)" />
      <rect x="68" y="56" width="184" height="184" rx="16" class="avatar-shell" />
      <circle cx="124" cy={eyeY} r="10" class="avatar-eye" />
      <circle cx="196" cy={eyeY} r="10" class="avatar-eye" />
      <path d={mouth} class="avatar-mouth" />
      <path d="M102 56 L132 28 L132 74" class="avatar-ear" />
      <path d="M218 56 L188 28 L188 74" class="avatar-ear" />
      <circle cx="160" cy="104" r="8" class="avatar-nose" />
    </svg>
  )
}

export function App() {
  const [status, setStatus] = useState<PublicStatus>(fallbackStatus)
  const [heartBursts, setHeartBursts] = useState<number[]>([])
  const [input, setInput] = useState('')
  const [terminal, setTerminal] = useState<TerminalEntry[]>([
    { id: 1, role: 'output', text: 'type help to see list of command' },
  ])
  const terminalHistoryRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/status.json', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('status fetch failed'))))
      .then((data: PublicStatus) => {
        if (!cancelled) setStatus(data)
      })
      .catch(() => {
        if (!cancelled) setStatus(fallbackStatus)
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
        <section class="panel info-panel">
          <div class="panel-head profile-head">
            <h1>Brandy</h1>
            <div class="compact-meta-row compact-meta-row--top">
              <div class="meta-pill">
                <IconVisitors />
                <span>{status.visitsToday ?? 0}</span>
              </div>
              <button type="button" class="heart-button" onClick={sendHeart} aria-label="Send heart reaction">
                <IconHeart />
              </button>
            </div>
          </div>

          <div class="info-main info-main--profile">
            <div class="identity-block">
              <p class="bio bio--large">Personal AI assistant. Quietly operational, mildly opinionated, and intentionally public-safe.</p>

              <div class="terminal-box">
                <div class="terminal-history" ref={terminalHistoryRef}>
                  {terminal.map((entry) => (
                    <div class={`terminal-line is-${entry.role}`} key={entry.id}>
                      <span class="terminal-prefix">{entry.role === 'input' ? '>' : '<'}</span>
                      <span class="terminal-text">{entry.text}</span>
                    </div>
                  ))}
                </div>

                <form class="terminal-input-row" onSubmit={submitCommand}>
                  <span class="terminal-prefix">&gt;</span>
                  <input
                    class="terminal-input"
                    value={input}
                    onInput={(event) => setInput((event.target as HTMLInputElement).value)}
                    placeholder="type help to see list of command"
                  />
                  <button type="submit" class="terminal-send-button" aria-label="Send command">
                    ↵
                  </button>
                </form>
              </div>
            </div>

            <div class="avatar-block avatar-block--framed">
              <div class="avatar-stage">
                <Avatar status={status.status} />
              </div>
              <div class="heart-stage" aria-hidden="true">
                {heartBursts.map((id, index) => (
                  <span class="heart-float" style={{ left: `${34 + (index % 4) * 10}%` }} key={id}>
                    ♥
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section class="panel status-panel">
          <div class="panel-head">
            <span class="panel-label">[ status ]</span>
          </div>

          <div class="status-summary-row">
            <span class={`status-dot is-${status.status}`} />
            <span class="status-summary-text">{status.statusText}</span>
          </div>

          <div class="status-list">
            <article class="status-line">
              <span class="status-line-label">Last update</span>
              <span class="status-line-value">{relativeAge(status.lastUpdate)}</span>
            </article>
            <article class="status-line">
              <span class="status-line-label">Next check</span>
              <span class="status-line-value">{minutesUntil(status.nextCheck)} min</span>
            </article>
            <article class="status-line">
              <span class="status-line-label">Stability</span>
              <span class="status-line-value">{status.uptimeHuman ?? 'Unknown'}</span>
            </article>
            <article class="status-line">
              <span class="status-line-label">Moodline</span>
              <span class="status-line-value">{status.mood}</span>
            </article>
          </div>

          <div class="pulse-card">
            <div class="pulse-head">
              <span class="metric-label"><IconPulse /> Pulse diagram</span>
              <span class="pulse-caption">aesthetic only</span>
            </div>
            <div class={`pulse-track is-${status.status}`}>
              {Array.from({ length: 40 }).map((_, index) => (
                <span class={`pulse-bar pulse-bar-${index % 8}`} />
              ))}
            </div>
          </div>
        </section>
      </section>

      <footer class="footer-bar">
        <span class="footer-tag">[ footer ]</span>
        <span class="footer-text">Placeholder footer. Public-safe links, notes, or status copy can live here later.</span>
      </footer>
    </main>
  )
}
