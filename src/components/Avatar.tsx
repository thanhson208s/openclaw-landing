import type { PublicStatus } from '../lib/types'

export function Avatar({ status }: { status: PublicStatus['status'] }) {
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
