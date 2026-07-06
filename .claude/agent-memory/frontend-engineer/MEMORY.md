# Frontend Engineer — Project Memory

## Project
Muhammad Sufyan's portfolio redesign: motion-first, scroll-telling single page (GSAP + Lenis). Reference feel `lukebaffait.fr` (motion only). Content source = `.agents/context/product_requirements.md`.

## Actual repo layout (boilerplate removed 2026-07-06 — clean base)
- Auth, dashboard, `_auth`/`_protected` routes, `middlewares/`, `store/`, `lib/axios.ts`, `config/env.ts`, `models/`, `types/api.type.ts` are **gone**. Routing is only `/` → `features/home/pages/HomePage.tsx` (via `routes/index.tsx`; `routes/__root.tsx` → `RootLayout`).
- Home feature: `features/home/{pages,components,data,types}` — `components/data/types` are empty (`.gitkeep`), ready for the rebuild. HomePage is a minimal placeholder shell.
- Global primitives in `src/components/common` (has a barrel `index.ts`); shadcn in `src/components/ui` — **only `button.tsx` + `tooltip.tsx` remain**; add others via `npx shadcn add` / `/add-shadcn`. Utils in `src/lib` (`cn()` in `src/lib/utils.ts`). Path alias `@/` → `src/`.
- Providers: `main.tsx` → `ThemeProvider` → `TooltipProvider` → `RouterProvider`. No react-query. `routeTree.gen.ts` auto-regenerates via the router Vite plugin on dev/build — never hand-edit.
- Deps removed with the boilerplate (reinstall only if actually needed): axios, js-cookie, zod, react-hook-form, @hookform/resolvers, zustand, @tanstack/react-query(+devtools), recharts, @tanstack/react-table, date-fns, embla-carousel-react, input-otp, cmdk, vaul, react-day-picker, react-resizable-panels, sonner, next-themes.

## Custom primitives (USE THESE — never bare HTML)
- `Box` — polymorphic; `<Box as="section" className=…>`. Replaces div/section/article/header/footer/nav/ul/li.
- `Container` — `<Container as="section" maxWidth="7xl" centerContent?>`; adds `mx-auto px-4 sm:px-6 lg:px-8`. `maxWidth`: sm..7xl|full.
- `Text` — `<Text as="p|span|div" variant="default|lead|large|small|muted">`. Replaces p/span.
- `Heading` — `<Heading level={1..6} variant="default|display|title|subtitle|section">` (or `as="h2"`). Replaces h1–h6.
- `Link` — `<Link href>`; internal (TanStack) / hash (smooth scroll) / external (rel auto) / mailto / tel.
- `Image` — `<Image src alt width height objectFit priority>`; lazy + skeleton + fallback built in.
- `ThemeToggle` — theme switch.
- Import: `import { Box, Heading, Text } from "@/components/common";`. Repo enforces `react/forbid-elements` (bare `<div>` = error).

## Conventions / DRY
- TS strict, no `any`. `cn()` for conditional classes, `cva` for variants. Functional components, named exports.
- Design tokens only (Tailwind v4 `@theme`), no raw hex/px. (Tokens to be defined in `src/styles/globals.css` per design_system §9.)
- Reuse existing common components + data types before writing new ones. If you add a shared primitive/util, record it here.

## Tooling (installed 2026-07-06)
- MCP servers in root `.mcp.json`: **context7** (live GSAP/TanStack/Tailwind v4/shadcn docs — prefer over memory for API syntax), **shadcn** (official registry — search/install components, pairs with `/add-shadcn`), **chrome-devtools** (QA).
- Design-quality skills: **impeccable** (`.claude/skills/impeccable/`, `/impeccable <craft|polish|audit|…>`; run `/impeccable init` first use) and **design-taste-frontend** (`.claude/skills/design-taste-frontend/`, anti-slop dials for portfolios). Use during section builds, not just review.
- Prettier is a devDependency; PostToolUse hook auto-formats every Edit/Write (`.claude/hooks/format.sh`, respects `.prettierrc`).

## Decisions log (durable facts only)
- shadcn `ui/` kept minimal (button, tooltip); `eslint.config.js` scopes `react-refresh/only-export-components: off` to `src/components/ui/**` (shadcn exports cva variants alongside components).
- Portfolio is static + EmailJS client-side — no axios/API layer; don't reintroduce an HTTP layer.
- Root docs (2026-07-06): `AGENTS.md` is the committed cross-tool agents overview (gitignored `AGENT_README.md`/`AGENT_NOTES.md` are local scratch); README/CLAUDE.md/gemini.md summarize and point to `.agents/context/*` — never duplicate the deep specs into root docs. When conventions change, update all four together.
