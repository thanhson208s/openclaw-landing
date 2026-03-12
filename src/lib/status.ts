import type { CommandKey, PublicStatus } from './types'

const ONLINE_THRESHOLD_MINUTES = 10
const OFFLINE_THRESHOLD_MINUTES = 30

const statusLines: Record<PublicStatus['status'], string[]> = {
  online: [
    'Quietly operational.',
    'Present and responsive.',
    'No visible chaos.',
    'Running smoothly.',
    'Awake and behaving.',
  ],
  stale: [
    'A little behind schedule.',
    'Signal is faint but present.',
    'Last check-in is getting old.',
    'Probably fine, not freshly verified.',
    'Quiet for longer than expected.',
  ],
  offline: [
    'Not responding.',
    'Porch light is out.',
    'Currently unreachable.',
    'No recent heartbeat.',
    'Something is asleep or broken.',
  ],
  maintenance: [
    'Under maintenance.',
    'Tending to the wires.',
    'Temporarily in service mode.',
    'Maintenance window in progress.',
    'Quiet maintenance underway.',
  ],
}

export const fallbackStatus: PublicStatus = {
  status: 'offline',
  statusText: 'Not responding.',
  lastUpdate: new Date(0).toISOString(),
  nextCheck: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  mood: 'Signal lost. Using fallback state.',
  stale: true,
  theme: 'night',
}

export const commandReplies: Record<CommandKey, () => string> = {
  help: () => 'available: help, hello, dance, smile',
  hello: () => 'hello',
  dance: () => 'dance',
  smile: () => 'smile',
}

export function minutesUntil(value: string) {
  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) return 0
  const diff = timestamp - Date.now()
  return Math.max(0, Math.round(diff / 60000))
}

export function relativeAge(value: string) {
  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) return 'unknown'
  const diffMin = Math.max(0, Math.round((Date.now() - timestamp) / 60000))
  if (diffMin < 1) return 'just now'
  if (diffMin === 1) return '1 minute ago'
  if (diffMin < 60) return `${diffMin} minutes ago`
  const hours = Math.round(diffMin / 60)
  return hours === 1 ? '1 hour ago' : `${hours} hours ago`
}

function pickStatusLine(status: PublicStatus['status']) {
  const options = statusLines[status]
  return options[Math.floor(Math.random() * options.length)]
}

function ageMinutes(value: string) {
  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) return Number.POSITIVE_INFINITY
  return Math.max(0, Math.round((Date.now() - timestamp) / 60000))
}

export function evaluateStatus(raw: Partial<PublicStatus> | null | undefined): PublicStatus {
  if (!raw || typeof raw !== 'object') {
    return { ...fallbackStatus, statusText: pickStatusLine('offline') }
  }

  const lastUpdate = typeof raw.lastUpdate === 'string' ? raw.lastUpdate : fallbackStatus.lastUpdate
  const nextCheck = typeof raw.nextCheck === 'string' ? raw.nextCheck : new Date(Date.now() + 5 * 60 * 1000).toISOString()
  const mood = typeof raw.mood === 'string' && raw.mood.trim() ? raw.mood : fallbackStatus.mood
  const uptimeHuman = typeof raw.uptimeHuman === 'string' && raw.uptimeHuman.trim() ? raw.uptimeHuman : 'Unknown'
  const theme = typeof raw.theme === 'string' && raw.theme.trim() ? raw.theme : 'night'

  const age = ageMinutes(lastUpdate)
  let effectiveStatus: PublicStatus['status']

  if (age <= ONLINE_THRESHOLD_MINUTES) {
    effectiveStatus = 'online'
  } else if (age <= OFFLINE_THRESHOLD_MINUTES) {
    effectiveStatus = 'stale'
  } else {
    effectiveStatus = 'offline'
  }

  return {
    status: effectiveStatus,
    statusText: pickStatusLine(effectiveStatus),
    lastUpdate,
    nextCheck,
    mood,
    uptimeHuman,
    stale: effectiveStatus !== 'online',
    theme,
  }
}
