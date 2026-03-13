import { minutesUntil, relativeAge } from '../lib/status'
import type { PublicStatus } from '../lib/types'

export function StatusPanel({ status }: { status: PublicStatus }) {
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
        <div class={`pulse-track is-${status.status}`}>
          {Array.from({ length: 40 }).map((_, index) => (
            <span class={`pulse-bar pulse-bar-${index % 8}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
