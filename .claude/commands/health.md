You are the CTO doing a periodic project health check. Audit the codebase and produce a single, prioritized dashboard. Think in terms of risk-adjusted priority: what's most likely to bite us soonest?

This is a minimal Next.js site (two pages, WebGL background, no database, no auth, no backend API). Scale your expectations accordingly — a DJ homepage doesn't need the same rigor as a SaaS platform. But what exists should be solid.

## Modes

Parse `$ARGUMENTS` for mode:

- **Surface mode (default):** `/health` or `/health --surface` — lightweight vital signs using the surface checklist. Fast, 100-line output cap.
- **Full mode:** `/health --full` — deep audit using the full checklist. Thorough, 200-line output cap.
- **Focused mode:** any other arguments (e.g. `/health docker`, `/health performance`, `/health CI`) — audit **exclusively through the lens of the given topic**, but still check all applicable areas. Same dashboard format, scoped to findings relevant to that topic.

## Context gathering

Before auditing, silently:

1. Run `git log --oneline -20` to understand recent activity
2. Run `git diff main --stat` to see if there's uncommitted branch work
3. Read `CLAUDE.md` for project context and hard rules
4. Read `next.config.ts` for Next.js configuration
5. Read `Dockerfile` and `docker-compose.yml` for container setup
6. Read `.github/workflows/ci.yml` and `.github/workflows/deploy.yml` for CI/CD

## Surface checklist (default)

### Code quality

1. Read all components (`src/components/*.tsx`) and pages (`src/app/**/page.tsx`, `src/app/**/route.ts`)
2. Check: any dead code, unused imports, or leftover debug statements?
3. Check: TypeScript strict — any `any` casts, missing types?
4. Check: React anti-patterns — missing useEffect deps, stale closures, state after unmount?
5. Check: Three.js / R3F — resources disposed on unmount? Frame loop efficient?

### Security

1. Read all source files in `src/`
2. Check: any `dangerouslySetInnerHTML`, `eval()`, or dynamic script injection?
3. Check: any hardcoded secrets or API keys?
4. Check: links with `target="_blank"` have `rel="noopener noreferrer"`?
5. Check: Next.js config — security headers set? (CSP, X-Frame-Options)

### Infrastructure

1. Read `Dockerfile` and `docker-compose.yml`
2. Check: Dockerfile runs as non-root? Multi-stage build clean?
3. Check: docker-compose — read_only, cap_drop ALL, mem_limit, healthcheck pointing to `/health`?
4. Check: CI runs lint + typecheck + build + docker build + hadolint on PRs?
5. Check: deploy workflow — secrets managed via GitHub environments? SSH hardened?

### Performance

1. Check: bundle size — are Three.js imports tree-shaken? Any unnecessary dependencies in `package.json`?
2. Check: images/fonts — optimized loading? No layout shift?
3. Check: WebGL — canvas size appropriate? Pixel ratio capped? Shader complexity reasonable?
4. Check: any client components that should be server components?

## Full checklist (`--full`)

Everything from the surface checklist plus:

### Code quality — extended

- Read `src/app/globals.css` and `src/app/layout.tsx` for design consistency
- Component size — any component over ~150 lines that should be split?
- Naming consistency — files, components, CSS classes follow conventions?
- Accessibility — semantic HTML, keyboard navigation, ARIA where needed?
- Font loading strategy — Space Mono loaded efficiently? No FOUT?

### Infrastructure — extended

- Dockerfile layer caching — are COPY instructions ordered for optimal caching?
- Docker image size — any unnecessary files copied into the final stage?
- CI job parallelism — are independent jobs running in parallel?
- Deploy workflow — rollback strategy? Health check after deploy?
- Node.js version pinned consistently across Dockerfile, CI, and package.json engines?

### Dependencies

- Run `yarn audit` mentally — any known CVEs in current deps?
- Are all deps pinned or range-locked appropriately?
- Are Three.js / postprocessing / R3F versions compatible?
- Any deps that could be removed?

## Output format

### 1. Health scorecard

| Area | Grade | Top concern | Trend |
| --- | --- | --- | --- |
| Code quality | A-F | One-liner | improving / stable / degrading |
| Security | A-F | One-liner | improving / stable / degrading |
| Infrastructure | A-F | One-liner | improving / stable / degrading |
| Performance | A-F | One-liner | improving / stable / degrading |
| **Overall** | A-F | — | — |

Grading:

- **A** — solid, no high-severity findings
- **B** — good, minor improvements possible
- **C** — adequate, some gaps that need attention
- **D** — concerning, high-severity findings present
- **F** — critical issues, stop and fix before shipping

### 2. Prioritized action list

Top 10 actions (surface) or top 15 actions (full), ranked by risk x effort:

| # | Severity | Area | Finding | Effort | Suggested fix |
|---|----------|------|---------|--------|---------------|
| 1 | 🔴 | Security | ... | S/M/L | ... |
| 2 | 🟠 | Infra | ... | S/M/L | ... |

Effort levels:

- **S** — under 1 hour, single file change
- **M** — 1-4 hours, touches 2-3 files
- **L** — half-day+, requires design thinking

### 3. Recommended next tasks

Based on findings, suggest 3-5 concrete tasks for the next work session, ordered by impact. Each task should be scoped to a single PR.

## Rules

- Do NOT modify code — this is a health check, not a fix-it session
- Grade honestly — an "A" with known gaps is worse than a "C" that's transparent
- Scale expectations to the project — this is a two-page DJ homepage, not a SaaS platform. Don't penalize for missing tests on a static site or absent rate limiting with no API
- Prioritize findings that compound across areas (insecure + performance problem > just one)
- Surface mode: keep output under 100 lines. Full mode: keep output under 200 lines
- **Scope note:** code quality details → `/review`. Security deep-dive → `/security`.
