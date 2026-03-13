import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import type { JSX } from 'preact'
import './app.css'
import { FooterBar } from './components/FooterBar'
import { ProfilePanel } from './components/ProfilePanel'
import { StatusPanel } from './components/StatusPanel'
import {
  ONLINE_THRESHOLD_MINUTES,
  RELOAD_THROTTLE_SECONDS,
  commandReplies,
  countdownUntil,
  evaluateStatus,
  fallbackStatus,
  presetCommands,
  ageMinutes,
} from './lib/status'
import type { CommandKey, PublicStatus, TerminalEntry } from './lib/types'

const LAST_RELOAD_KEY = 'brandy:last-reload-at'

export function App() {
  const [status, setStatus] = useState<PublicStatus>(evaluateStatus(fallbackStatus))
  const [heartBursts, setHeartBursts] = useState<Array<{
    id: number
    left: number
    drift: number
    rotate: number
    scale: number
    duration: number
    delay: number
    bottom: number
  }>>([])
  const [input, setInput] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [terminal, setTerminal] = useState<TerminalEntry[]>([
    { id: 1, role: 'output', text: 'type help to see list of command' },
  ])
  const [countdownSeconds, setCountdownSeconds] = useState(() => countdownUntil(fallbackStatus.nextCheck))
  const terminalHistoryRef = useRef<HTMLDivElement | null>(null)
  const reloadTriggeredRef = useRef(false)

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
        if (!cancelled) {
          setStatus(data)
          setCountdownSeconds(countdownUntil(data.nextCheck))
          reloadTriggeredRef.current = false
        }
      })
      .catch(() => {
        if (!cancelled) {
          const fallback = evaluateStatus(fallbackStatus)
          setStatus(fallback)
          setCountdownSeconds(countdownUntil(fallback.nextCheck))
          reloadTriggeredRef.current = false
        }
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

  useEffect(() => {
    setCountdownSeconds(countdownUntil(status.nextCheck))
    reloadTriggeredRef.current = false
  }, [status.nextCheck])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const lastUpdateAge = ageMinutes(status.lastUpdate)
      const lastReloadRaw = window.localStorage.getItem(LAST_RELOAD_KEY)
      const lastReloadAt = lastReloadRaw ? Number(lastReloadRaw) : 0
      const reloadCooldownActive = Date.now() - lastReloadAt < RELOAD_THROTTLE_SECONDS * 1000

      let next = countdownUntil(status.nextCheck)

      if (next <= 0 && reloadCooldownActive) {
        const waitMs = RELOAD_THROTTLE_SECONDS * 1000 - (Date.now() - lastReloadAt)
        next = Math.max(0, Math.ceil(waitMs / 1000))
      }

      setCountdownSeconds(next)

      if (lastUpdateAge > ONLINE_THRESHOLD_MINUTES) {
        return
      }

      if (next <= 0 && !reloadTriggeredRef.current && !reloadCooldownActive) {
        reloadTriggeredRef.current = true
        window.localStorage.setItem(LAST_RELOAD_KEY, String(Date.now()))
        window.location.reload()
      }
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [status.nextCheck, status.lastUpdate])

  const sendHeart = () => {
    const id = Date.now()
    const burst = {
      id,
      left: 14 + Math.random() * 72,
      drift: -18 + Math.random() * 36,
      rotate: -24 + Math.random() * 48,
      scale: (0.72 + Math.random() * 0.9) * 1.5,
      duration: 1400 + Math.random() * 1200,
      delay: Math.random() * 120,
      bottom: 6 + Math.random() * 18,
    }

    setHeartBursts((current) => [...current, burst])
    window.setTimeout(() => {
      setHeartBursts((current) => current.filter((item) => item.id !== id))
    }, burst.duration + burst.delay + 120)
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
        <StatusPanel status={status} countdownSeconds={countdownSeconds} />
      </section>

      <FooterBar />
    </main>
  )
}
