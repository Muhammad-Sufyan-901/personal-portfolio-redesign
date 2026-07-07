---
name: tanstack-router
description: File-based TanStack Router setup for this portfolio (single-page default, optional /work/$slug). Activate when wiring routes or navigation.
---

# TanStack Router (file-based)

Authoritative: `context/system_architecture.md §4.2`.

## Setup
- `@tanstack/router-plugin/vite` in `vite.config.ts` with `autoCodeSplitting: true`; never hand-edit `routeTree.gen.ts`.
- `src/routes/__root.tsx` renders `AppProviders` + `<Cursor/>` + `<Preloader/>` + `<Outlet/>`.
- `src/routes/index.tsx` → `HomePage`. Nav links are smooth-scroll anchors via `lenis.scrollTo(hash)`.
- No `beforeLoad` guards (nothing to protect). For optional multi-page, `work.$slug.tsx` resolves the project from constants and `notFound()` on bad slug.

## On route change (multi-page only)
Run a `PageTransition` overlay, then `ScrollTrigger.refresh()` + reset scroll via Lenis.

## As built
`@tanstack/react-router ^1.162.8` with `scrollRestoration: true` + `defaultPreload: "intent"`; `__root.tsx` mounts `AppProviders` + `Preloader` + `Cursor` + `RootLayout` exactly as above; `index.tsx` → `features/home/pages/HomePage.tsx`. Hash-anchor smooth scroll is handled inside the common `Link` primitive (`lenis.scrollTo` + `pushState`; native `scrollIntoView` under reduced motion). Routes stay registry-only — no JSX in `src/routes/`. Claude Code mirror: routing section of `.claude/rules/project.md`.
