import type { JSX } from 'preact'
import type { TerminalEntry } from '../lib/types'
import { IconHeart } from './Icons'

type HeartBurst = {
  id: number
  left: number
  drift: number
  rotate: number
  scale: number
  duration: number
  delay: number
  bottom: number
}

type Props = {
  heartBursts: HeartBurst[]
  onHeart: () => void
  terminal: TerminalEntry[]
  terminalHistoryRef: preact.RefObject<HTMLDivElement>
  input: string
  inputPlaceholder: string
  setInput: (value: string) => void
  submitCommand: (event?: Event | JSX.TargetedEvent<HTMLFormElement, Event>) => void
}

export function ProfilePanel({
  heartBursts,
  onHeart,
  terminal,
  terminalHistoryRef,
  input,
  inputPlaceholder,
  setInput,
  submitCommand,
}: Props) {
  return (
    <section class="panel info-panel">
      <div class="panel-head profile-head">
        <h1>&lt;Brandy/&gt;</h1>
        <div class="compact-meta-row compact-meta-row--top">
          <button type="button" class="heart-button" onClick={onHeart} aria-label="Send heart reaction">
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
                placeholder={inputPlaceholder}
              />
              <button type="submit" class="terminal-send-button" aria-label="Send command">
                ↵
              </button>
            </form>
          </div>
        </div>

        <div class="avatar-block avatar-block--framed">
          <div class="avatar-stage avatar-stage--video">
            <video
              class="avatar-video"
              src="/avatar.mp4"
              autoplay
              muted
              loop
              playsinline
              preload="auto"
            />
          </div>
          <div class="heart-stage" aria-hidden="true">
            {heartBursts.map((burst) => (
              <span
                class="heart-float"
                style={{
                  left: `${burst.left}%`,
                  bottom: `${burst.bottom}%`,
                  '--heart-drift': `${burst.drift}px`,
                  '--heart-rotate': `${burst.rotate}deg`,
                  '--heart-scale': `${burst.scale}`,
                  '--heart-duration': `${burst.duration}ms`,
                  '--heart-delay': `${burst.delay}ms`,
                }}
                key={burst.id}
              >
                ♥
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
