import { countdownUntil, formatCountdown, relativeAge } from '../lib/status'
import type { PublicStatus } from '../lib/types'

type Props = {
  status: PublicStatus
  countdownSeconds: number
}

function Moodline({ text }: { text: string }) {
  const shouldScroll = text.length > 42

  if (!shouldScroll) {
    return <span class="status-line-value moodline-text">{text}</span>
  }

  return (
    <span class="status-line-value moodline-marquee-wrap">
      <span class="moodline-marquee-track">
        <span class="moodline-marquee-text">{text}</span>
        <span class="moodline-marquee-separator"> • </span>
        <span class="moodline-marquee-text" aria-hidden="true">{text}</span>
      </span>
    </span>
  )
}

export function StatusPanel({ status, countdownSeconds }: Props) {
  return (
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
          <span class="status-line-value">{formatCountdown(countdownSeconds)}</span>
        </article>
        <article class="status-line">
          <span class="status-line-label">Stability</span>
          <span class="status-line-value">{status.uptimeHuman ?? 'Unknown'}</span>
        </article>
        <article class="status-line">
          <span class="status-line-label">Moodline</span>
          <Moodline text={status.mood} />
        </article>
      </div>

      <div class="pulse-card">
        <div class={`pulse-track is-${status.status}`}>
          {Array.from({ length: 40 }).map((_, index) => (
            <span class={`pulse-bar pulse-bar-${index % 8}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function getInitialCountdown(status: PublicStatus) {
  return countdownUntil(status.nextCheck)
}
