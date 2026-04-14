# CCIL

DJ homepage for [ccil.club](https://ccil.club). Minimal single-page site with a dithered WebGL wave background, canvas-based fuzzy text effects, and a countdown to the next set.

## Stack

| Layer                | Tech                                                      |
| -------------------- | --------------------------------------------------------- |
| Framework            | Next.js 16 (App Router, standalone output)                |
| Language             | TypeScript (strict)                                       |
| Styling              | Tailwind CSS 4                                            |
| 3D / Post-processing | Three.js, @react-three/fiber, @react-three/postprocessing |
| Font                 | Space Mono                                                |
| Runtime              | Node 22                                                   |
| Package manager      | Yarn                                                      |

## Getting started

```bash
yarn install
make dev
```

Open [localhost:3000](http://localhost:3000).

## Available commands

```bash
make help          # Show all targets
make dev           # Start dev server
make build         # Production build
make lint          # Run ESLint
make typecheck     # Run TypeScript type checking
make check         # Run all checks (lint + typecheck + build)
make deploy        # Trigger production deploy via GitHub Actions
```

## Project structure

```text
src/
├── app/
│   ├── layout.tsx        Root layout, Space Mono font
│   ├── globals.css       Minimal reset, dark background
│   └── page.tsx          Home — hero, countdown, dates, about
└── components/
    ├── Countdown.tsx     Countdown timer to next show
    ├── Dither.tsx        WebGL dithered wave background (Three.js)
    ├── FadeIn.tsx        Scroll-triggered fade-in wrapper
    └── FuzzyText.tsx     Canvas-based fuzzy/glitch text effect
```

## Infrastructure

### Docker

Multi-stage build (`node:22-alpine`): deps, build, runner. Non-root user, standalone output.

```bash
docker build -t ccil .
docker run -p 3000:3000 ccil
```

### Compose (production)

Pulls from `ghcr.io/vpatrin/ccil`. Hardened: read-only filesystem, all capabilities dropped, `no-new-privileges`, 256MB memory limit, structured logging.

### CI/CD

**CI** (on PR to `main`): lint, typecheck, build, Docker build, Dockerfile lint (hadolint) — all parallelized with concurrency groups.

**CD** (manual via `make deploy`): builds and pushes to GHCR, SSH deploys to VPS with docker compose.

## Design

Dark, minimal, artsy. The dithered wave background is the identity.

- **Palette**: deep black, muted blue-grey waves, white text at low opacity
- **Typography**: Space Mono, small sizes, wide tracking, uppercase labels
- **Interactions**: slow transitions (1000ms), opacity-only hovers
- **Layout**: full-screen hero with countdown, then centered `max-w-xl` content column

## License

Private.
