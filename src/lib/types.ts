export type PublicStatus = {
  status: 'online' | 'stale' | 'offline' | 'maintenance'
  statusText: string
  lastUpdate: string
  nextCheck: string
  mood: string
  uptimeHuman?: string
  stale: boolean
  theme?: string
}

export type CommandKey = 'help' | 'hello' | 'dance' | 'smile'

export type TerminalEntry = {
  id: number
  role: 'input' | 'output'
  text: string
}
