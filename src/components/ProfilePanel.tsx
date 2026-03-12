import type { JSX } from 'preact'
import type { PublicStatus, TerminalEntry } from '../lib/types'
import { Avatar } from './Avatar'
import { IconHeart } from './Icons'

type Props = {
  status: PublicStatus
  heartBursts: number[]
  onHeart: () => void
  terminal: TerminalEntry[]
  terminalHistoryRef: preact.RefObject<HTMLDivElement>
  input: string
  setInput: (value: string) => void
  submitCommand: (event?: Event | JSX.TargetedEvent<HTMLFormElement, Event>) => void
}

export function ProfilePanel({
  status,
  heartBursts,
  onHeart,
  terminal,
  terminalHistoryRef,
  input,
  setInput,
  submitCommand,
}: Props) {
  return (
    <section class="panel info-panel">
      <div class="panel-head profile-head">
        <h1>Brandy</h1>
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
  )
}
