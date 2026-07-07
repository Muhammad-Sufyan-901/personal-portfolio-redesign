# Project conventions (always on)

- Content is transcribed from `.agents/context/product_requirements.md`. Never invent facts; omit unknowns.
- Feature-based structure; a `src/features/*` module must NOT import from another feature. Promote shared code to `components/common`, `lib`, `hooks`, or `types`.
- Path alias `@/` → `src/`. Named exports preferred. Functional components only.
- Design tokens only (Tailwind v4 `@theme` vars) — no raw hex or magic px in components.
- Before implementation, the plan must be approved (see workflow in CLAUDE.md). Execution is one section at a time, with a stop-for-approval gate after **every** section.

## Routing (mirrors `.agents/skills/tanstack-router`)

- `src/routes/` is registry-only: `createFileRoute`/`createRootRoute` wiring components imported from `src/features/**` — no JSX definitions in route files. `__root.tsx` mounts `AppProviders` + `Preloader` + `Cursor` + `RootLayout`; `index.tsx` → `HomePage`.
- The router plugin (`@tanstack/router-plugin ^1.162.8`, `autoCodeSplitting: true`) regenerates `src/routeTree.gen.ts` on dev/build — **never hand-edit it**.
- Single-page navigation is by hash anchors: the common `Link` smooth-scrolls via `lenis.scrollTo` + `pushState`. No `beforeLoad` guards (nothing to protect).

## Build config (mirrors `.agents/skills/vite-setup`)

- Vite `^7.3.1` plugin order in `vite.config.ts`: `tanstackRouter({ autoCodeSplitting: true })` → `react()` → `tailwindcss()`.
- Fonts are bundled: `@fontsource-variable/fraunces` + `@fontsource/jetbrains-mono` (npm) and self-hosted General Sans woff2 in `src/assets/fonts/`, all wired through `src/styles/globals.css`.
- EmailJS keys (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`) live in gitignored `.env`, read via `src/config/env.ts`. Never commit or `Read` `.env*` (denied in `.claude/settings.json`).

**Why this matters here:** this project already shipped chapters 00–04 (`feat(preloader)` `fe849ff` → `feat(journey)` `b245c1e`) under these exact conventions — data in `src/features/home/data/*.data.ts` typed against `src/types/portfolio.ts`, zero cross-feature imports, all tokens from `src/styles/globals.css`. Deviating now creates two dialects in one small codebase.
