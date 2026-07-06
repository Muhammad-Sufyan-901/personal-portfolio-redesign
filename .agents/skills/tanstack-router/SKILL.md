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
