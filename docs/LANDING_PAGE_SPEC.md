# Landing Page Specification

## Purpose

Design and implement a public-facing landing/status page for the OpenClaw host domain.

The page is intended to serve as a lightweight public "front door" for the assistant/server presence while keeping the actual OpenClaw control surface private. It must communicate coarse service state, personality, and liveliness without exposing sensitive operational details.

## Primary Goals

- Present a polished public identity for the assistant/server.
- Show coarse, safe, dynamic status information.
- Feel alive and personalized rather than static.
- Avoid exposing the OpenClaw dashboard, internal state, or private data.
- Work well on both desktop and mobile.
- Use a minimal, low-risk backend design based on a small JSON status file.

## Non-Goals

- Public access to the OpenClaw dashboard.
- Public access to model calls, agent tools, logs, sessions, or control operations.
- Rich observability or infrastructure dashboards.
- Real-time chat with the agent.
- Fake telemetry that could mislead users.

## Product Concept

A social-profile-style landing page with a dark terminal-inspired visual language.

The page should feel like a public porch rather than the full house: expressive, alive, and interactive in small ways, but intentionally limited in what it reveals.

## Visual Theme

- Dark mode by default.
- Minimal monospace / terminal-inspired styling.
- Blinking cursor and restrained terminal motifs.
- Page glow and accent color vary by current status.
- Subtle animation only; avoid excessive motion or visual clutter.
- Mobile presentation should be calmer than desktop if needed.

## Information Architecture

### Section 1: Info

Displays identity and lightweight interactive presence.

#### Required elements

- Name.
- Short bio / description.
- 2D animated SVG avatar.
- Background that changes over time.
- Clickable preset commands.
- Avatar reply shown via chat bubble or similar lightweight UI.

#### Avatar requirements

- Avatar state must react to current status.
- Avatar should use SVG-based animation for portability and performance.
- Visual state changes should be clear but restrained.

#### Background requirements

- Background should vary by time of day.
- Supported initial variants:
  - day
  - night
  - sun
  - moon
  - cloud
- Weather-driven background changes are backlog, not required for v1.

#### Preset command interaction

- No freeform agent interaction.
- Commands are predefined and safe.
- Clicking a command triggers a canned response in the avatar chat bubble.
- Recommended command set:
  - `help`
  - `status`
  - `mood`
  - `uptime`
  - `poke`
  - `about`
  - `clear`

### Section 2: Status

Displays public-safe, coarse operational state.

#### Required elements

- Status dot.
- Status phrase.
- Last status update time.
- Time to next health check.
- Summarized uptime / downtime.
- Rotating mood line.
- Heartbeat pulse diagram.

#### Status model

The public page must use a coarse status model only.

Supported states:
- `online`
- `stale`
- `offline`

Optional reserved future state:
- `maintenance`

#### Status definitions

These thresholds should be implemented consistently between backend and frontend.

- **Online**: status file updated within expected freshness window.
- **Stale**: status file has not been updated on schedule, but the data is not old enough to be considered offline.
- **Offline**: no acceptable fresh update for a longer threshold; service is considered unavailable or unknown.

Recommended initial thresholds:
- `online`: last update <= 10 minutes old
- `stale`: > 10 minutes and <= 30 minutes old
- `offline`: > 30 minutes old

These values may be adjusted later, but must be explicit and centralized.

#### Status phrases

Each state should support multiple short phrase variants.

Tone requirements:
- concise
- calm
- lightly expressive
- not overly jokey
- not overly operational

Examples:

**Online**
- Quietly operational.
- Present and responsive.
- Running smoothly.
- No visible chaos.
- Awake and behaving.

**Stale**
- A little behind schedule.
- Last check-in is getting old.
- Quiet for longer than expected.
- Probably fine, not freshly verified.
- Signal is faint but present.

**Offline**
- Not responding.
- Porch light is out.
- Currently unreachable.
- No recent heartbeat.
- Something is asleep or broken.

#### Uptime / downtime presentation

- Must be summarized, not detailed.
- Must not resemble a full infrastructure monitoring panel.
- Examples:
  - Stable for 2d 4h
  - Last interruption: 1h yesterday
  - Mostly steady lately

If accurate downtime tracking is not yet implemented, uptime may be simplified or omitted until reliable.

#### Heartbeat pulse diagram

- Purely aesthetic.
- Must not appear to be a detailed operational metric panel.
- May reflect freshness and coarse state visually.
- Suggested behavior:
  - online: bright, regular pulse
  - stale: slower/faded pulse
  - offline: flat or broken signal

### Section 3: Visitor

Small, low-risk interaction area.

#### Required elements

- Number of visitors today, or equivalent daily interaction count.
- Simple emoji interaction.

#### Emoji interaction requirements

- A visitor can click an emoji button.
- Clicking should trigger a lightweight floating emoji animation.
- No fake count inflation.
- Counts, if shown, should be real counts only.
- If real counting is not implemented yet, omit numeric counts.

#### Deferred / backlog items

- Visitor "now" count.
- Minigames such as rock-paper-scissors.
- Additional richer visitor mechanics.

## Content and Tone

The page should communicate personality without becoming a public chatbot or novelty page.

### Tone principles

- competent
- minimal
- slightly playful
- technically sharp
- private by design

### Messaging principles

- Public page should describe presence, not expose control.
- Copy should suggest the real dashboard exists but remains private.
- Wording should not imply public shell access, real-time model access, or system internals.

### Recommended footer/privacy note

Include a small note such as:
- Public porch only.
- This page exposes coarse status, not internal state.
- Dashboard access is private by design.

## Recommended Tech Stack

The recommended implementation stack for this project is:

- **Vite** for development/build tooling
- **Preact** for lightweight component structure
- **TypeScript** for implementation language
- **Plain CSS** with CSS variables for styling and theming
- **Inline SVG** for avatar rendering and lightweight animation
- **Static JSON** (`status.json`) as the public data source
- **nginx** for static asset and JSON serving

## Stack Rationale

### Why this stack

This project is primarily:
- a presentation-focused public landing page
- lightly interactive
- driven by a small status JSON file
- safety-sensitive
- better served by static-first architecture than a dynamic public app

This stack keeps the system:
- lightweight
- fast to load
- easy to host
- easy to reason about
- low-maintenance
- low-risk from a public exposure perspective

### Why not a heavier framework

A heavier framework such as Next.js is not required for v1 because the project does not need:
- public server-side rendering logic
- public API routes
- authenticated application flows
- complex backend/frontend coupling

The selected stack provides enough structure for maintainability without adding unnecessary runtime or deployment complexity.

## Technical Requirements

### Frontend

- Responsive on mobile and desktop.
- Optimized for dark mode.
- Works without direct backend model calls.
- Uses a small JSON file as the public status source.
- Gracefully handles stale or unavailable JSON.
- Must avoid excessive animation, especially on mobile.

### Backend / Data Source

- No direct agent/model calls from the public page.
- No direct exposure of OpenClaw internals.
- Status must be fetched from a small public JSON file.
- JSON must be generated periodically by a controlled backend process.
- JSON must contain only public-safe, coarse-grained data.

### Gateway-down detection

The system must support detecting when the gateway or scheduled update path has stopped behaving as expected.

Recommended mechanism:
- status JSON includes `lastUpdate`
- frontend compares current time against freshness thresholds
- if update is too old, frontend presents `stale` or `offline`

This avoids direct public querying of the gateway.

## Public Data Safety Requirements

The public landing page and its JSON source must never expose:

- secrets or tokens
- internal logs
- session names
- channel names
- contact names
- message contents
- auth configuration
- detailed provider/model internals
- internal host/service identifiers beyond what is intentionally public

Only coarse, presentation-safe data may be exposed.

## JSON Data Contract

Recommended v1 schema:

```json
{
  "status": "online",
  "statusText": "Quietly operational.",
  "lastUpdate": "2026-03-12T20:40:00+07:00",
  "nextCheck": "2026-03-12T20:45:00+07:00",
  "mood": "No visible chaos.",
  "uptimeHuman": "2d 4h",
  "stale": false,
  "theme": "night",
  "visitsToday": 12,
  "emojiReactionsToday": 7
}
```

### Required fields

- `status`
- `statusText`
- `lastUpdate`
- `nextCheck`
- `mood`
- `stale`

### Optional fields

- `uptimeHuman`
- `theme`
- `visitsToday`
- `emojiReactionsToday`

### Field semantics

- `status`: machine-readable coarse state.
- `statusText`: human-readable phrase for display.
- `lastUpdate`: time the status file was last generated.
- `nextCheck`: expected next generation time.
- `mood`: short rotating line.
- `stale`: explicit boolean for frontend convenience.
- `uptimeHuman`: summarized uptime string.
- `theme`: background/theme hint.
- `visitsToday`: optional real daily visit count.
- `emojiReactionsToday`: optional real daily emoji count.

## Interaction Rules

### Preset commands

- Must be predefined.
- Must produce canned or locally derived responses only.
- Must not trigger agent/model execution from the browser.
- Unknown commands, if supported, should respond with a simple safe fallback.

### Emoji interaction

- Must be lightweight.
- Must be rate-limited if backed by real storage.
- Should prioritize visual delight over data collection.

## Accessibility and UX Requirements

- Good contrast in dark mode.
- Readable monospace typography on mobile.
- Motion should be subtle and not required for comprehension.
- Status must not rely on color alone; dot + text phrase are both required.
- Mobile layout should preserve clarity with fewer simultaneous visual effects if necessary.

## Performance Requirements

- Fast initial render.
- Minimal JavaScript.
- SVG/avatar animations should remain lightweight.
- JSON fetch should be cache-controlled appropriately for freshness.
- Frontend should degrade gracefully if JSON is missing or stale.

## Security Requirements

- Public landing page must remain separate from the private OpenClaw dashboard.
- No proxying of internal control endpoints to the public page.
- No browser-side secrets.
- No public write path without rate limiting and strict validation.
- Visitor interactions must not create an abuse or spam surface.

## v1 Scope

### In scope

- Dark terminal-inspired landing page
- Animated SVG avatar
- Time-based background variants
- Status dot + phrase
- Last update / next check
- Rotating mood line
- Summarized uptime
- Aesthetic pulse diagram
- Preset command interaction
- Simple emoji interaction
- Responsive layout
- Public JSON status source

### Backlog

- Weather-based visual changes
- Visitor-now tracking
- Rock-paper-scissors or other minigames
- Richer visitor mechanics
- Expanded avatar states
- More advanced telemetry-derived uptime/downtime tracking

## Implementation Guidance

### Recommended architecture

- OpenClaw or a scheduler-driven backend process updates a public-safe `status.json` file periodically.
- nginx serves the built frontend assets and the JSON file.
- Frontend is built with Vite + Preact + TypeScript and renders the public state from `status.json`.
- Styling is implemented with plain CSS and CSS variables.
- Avatar rendering and animation use inline SVG.
- Private dashboard remains accessible only through private access methods such as SSH tunnel.

### Preferred separation

- Public surface: landing page + public-safe JSON
- Private surface: OpenClaw dashboard and operational tooling

This separation should remain strict.

## Summary

The landing page should function as a personalized, dynamic, public-facing profile/status page for the assistant/server. It should feel alive and expressive while remaining intentionally limited, private-by-design, and technically safe.

The final design should prioritize clarity, tone, and safety over novelty, and should avoid features that introduce misleading telemetry, unnecessary complexity, or public exposure of internal system behavior.
