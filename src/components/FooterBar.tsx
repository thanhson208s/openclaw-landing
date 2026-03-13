function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" class="social-icon-svg">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.09 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.32 9.32 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.96-2.34 4.82-4.57 5.08.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" class="social-icon-svg">
      <path
        fill="currentColor"
        d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3C4.17 3 3.3 3.89 3.3 4.98s.87 1.97 1.95 1.97h.02c1.1 0 1.95-.88 1.95-1.97C7.22 3.89 6.36 3 5.27 3h-.02ZM20.7 12.68c0-3.46-1.84-5.07-4.3-5.07-1.98 0-2.87 1.1-3.37 1.87V8.5H9.66c.04.65 0 11.5 0 11.5h3.37v-6.42c0-.34.02-.68.12-.92.27-.68.88-1.39 1.9-1.39 1.35 0 1.88 1.05 1.88 2.58V20H20.7v-7.32Z"
      />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" class="social-icon-svg">
      <path
        fill="currentColor"
        d="M13.5 22v-8.2h2.77l.41-3.2H13.5V8.56c0-.93.26-1.56 1.6-1.56h1.71V4.14c-.3-.04-1.31-.14-2.49-.14-2.47 0-4.16 1.54-4.16 4.36v2.24H7.38v3.2h2.78V22h3.34Z"
      />
    </svg>
  )
}

export function FooterBar() {
  return (
    <footer class="footer-bar">
      <div class="social-links" aria-label="Social links">
        <a class="social-link" href="https://www.facebook.com/son.bui208s/" target="_blank" rel="noreferrer" aria-label="Facebook">
          <IconFacebook />
        </a>
        <a class="social-link" href="https://github.com/thanhson208s" target="_blank" rel="noreferrer" aria-label="GitHub">
          <IconGithub />
        </a>
        <a class="social-link" href="https://www.linkedin.com/in/sonbui208s/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <IconLinkedIn />
        </a>
      </div>
    </footer>
  )
}
