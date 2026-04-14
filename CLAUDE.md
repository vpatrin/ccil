# CCIL — Project Context

DJ homepage for ccil. Minimal single-page site with dithered WebGL wave background (Three.js + postprocessing) and fuzzy text effects.

## Stack

- Next.js 16 (App Router, TypeScript, standalone output)
- Tailwind CSS 4
- Three.js / @react-three/fiber / @react-three/postprocessing (dithered wave background)
- Font: Space Mono (monospace)
- Yarn (package manager)
- Docker multi-stage build, deployed via GHCR

## Structure

```text
src/
├── app/
│   ├── layout.tsx          # Root layout, Space Mono font
│   ├── globals.css         # Minimal reset, dark background
│   └── page.tsx            # Home — hero, countdown, dates, about
└── components/
    ├── Countdown.tsx       # Countdown timer to next show (uses FuzzyText)
    ├── Dither.tsx          # WebGL dithered wave background (Three.js)
    ├── FadeIn.tsx          # Scroll-triggered fade-in wrapper
    └── FuzzyText.tsx       # Canvas-based fuzzy/glitch text effect
```

## Design Direction

- Dark, minimal, artsy — the dithered wave background is the identity
- Palette: deep black, muted blue-grey waves, white text at low opacities
- Typography: Space Mono, small sizes, wide tracking, uppercase labels
- Interactions: slow transitions (1000ms), opacity-only hovers
- Content centered in a max-w-xl column after a full-screen hero with countdown

## Hard Rules

- No AI attribution in commits, PRs, or code
- Victor handles all deployments
- Keep it simple — it's a homepage, not a platform

## Git

- Conventional commits (`feat:`, `fix:`, `chore:`)
- Keep PRs small

## Infrastructure

- Dockerfile: multi-stage (deps → build → runner), node:22-alpine
- docker-compose.yml: pulls from ghcr.io/vpatrin/ccil, hardened (read_only, cap_drop, mem_limit)
- CI: lint + typecheck + build + docker build + hadolint on PRs
- CD: workflow_dispatch (`make deploy`), builds and pushes to GHCR, SSH deploys to VPS
- Domain: ccil.club

## Content Source

Real data from [SoundCloud](https://soundcloud.com/ccil_mp3):

- Bio: groove, tension, acid touches, Montreal-based
- Genres: hard house, ghetto house, hardgroove, trance, bounce, raw techno
- Booking: ccil.mp3@gmail.com
