# CCIL — Project Context

DJ homepage for ccil. Minimal site with WebGL background (FaultyTerminal shader via OGL), CSS flashlight effect, and two pages (home + contact).

## Stack

- Next.js 16 (App Router, TypeScript, standalone output)
- Tailwind CSS 4
- OGL (WebGL library for FaultyTerminal shader)
- Font: Space Mono (monospace)
- Docker multi-stage build, deployed via GHCR

## Structure

```text
src/
├── app/
│   ├── layout.tsx          # Root layout, Space Mono font
│   ├── globals.css         # Minimal reset, dark background
│   ├── page.tsx            # Home — hero, dates, about
│   └── contact/page.tsx    # Contact form
└── components/
    ├── FaultyTerminal.tsx   # WebGL background (OGL shader)
    ├── Flashlight.tsx       # CSS radial gradient following mouse
    └── Navigation.tsx       # Fixed nav, mix-blend-difference
```

## Design Direction

- Dark, minimal, artsy — the WebGL background is the identity
- Palette: deep black, blue terminal tint (#2d04fb), white text at low opacities
- Typography: Space Mono, small sizes, wide tracking, uppercase labels
- Interactions: slow transitions (1000ms), opacity-only hovers
- Content centered in a max-w-xl column after a full-screen hero
- Flashlight: CSS radial gradient overlay following cursor, offset to the right

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
- CI: lint + build + docker build + hadolint on PRs
- CD: tag-triggered, builds and pushes to GHCR, SSH deploys to VPS
- Target subdomain: ccil.victorpatrin.dev

## Content Source

Real data from [SoundCloud](https://soundcloud.com/ccil_mp3):

- Bio: groove, tension, acid touches, Montreal-based
- Genres: hard house, ghetto house, hardgroove, trance, bounce, raw techno
- Booking: ccil.mp3@gmail.com
