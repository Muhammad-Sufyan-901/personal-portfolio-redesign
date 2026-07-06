# GEMINI.md — AI Agent Context

Project context for Gemini CLI. This mirrors `CLAUDE.md`; deep specs live in `.agents/context/*` — summarize from here, read there for depth.

## Repo state

This is **Muhammad Sufyan's portfolio** — a motion-first, scroll-telling single page (reference feel: `lukebaffait.fr`, for motion/polish only, not its color or content). The old enterprise boilerplate (auth, dashboard, axios, Zustand) was removed; `src/` is now a minimal shell: a single `/` route rendering a placeholder `HomePage`, common-component primitives, a theme provider, and two shadcn primitives (button, tooltip). The redesign is built chapter by chapter per the spec in `.agents/`.

## Tech stack

- **React 19** (functional components only) + **TypeScript strict** (no `any`) on **Vite 7**
- **TanStack Router** — file-based routing, registry-only route files
- **Tailwind CSS v4** (`@theme` design tokens, no config file) + **shadcn/ui**
- Motion (installed at redesign bootstrap, not yet present): **GSAP** + ScrollTrigger · **Lenis** · **split-type** · `@gsap/react` (`useGSAP`)
- Contact form via **EmailJS** — there is no backend

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run lint` — ESLint (flat config)
- `npm run preview` — preview a production build
- `npx tsc --noEmit` — typecheck only
- No test framework is configured.

## Redesign context

- **Content source**: `.agents/context/product_requirements.md` is the *only* content source — transcribe, never invent; omit unknown fields.
- **Design system**: `.agents/context/design_system.md` — warm ink `#0B0B0F` bg, warm paper `#ECE8E1` text, brass accent; tokens, typography, per-chapter motion choreography.
- **Chapters**: `00 Preloader · 01 Hero · 02 Manifesto · 03 Craft · 04 Journey · 05 Selected Work · 06 Contact · Footer`. Sections go in `src/features/home/sections/*`, content in `src/features/home/constants/*` typed against `src/types/portfolio.ts`.
- **Non-negotiable motion rules**: one GSAP source (`src/lib/gsap.ts`), one Lenis owner (`src/providers/SmoothScrollProvider.tsx`) — no component imports `gsap/ScrollTrigger` directly; every animation runs in `useGSAP(() => {…}, { scope })` with a `prefers-reduced-motion` fallback; design tokens only — no raw hex or magic px; `cn()` for conditional classes, `cva` for variants; Lighthouse ≥ 90.
- **Workflow**: plan (`PLAN.md`) → **stop for approval** → bootstrap tokens/motion → build one chapter at a time → QA audit per chapter and at the end. See `AGENTS.md` and `.agents/workflows/`.

## Architecture (current)

Feature-based structure. Path alias `@/` → `src/`.

- **`src/routes/`**: registry files only — no JSX; they wire a `component` imported from `src/features/**`. `routeTree.gen.ts` is auto-generated — don't hand-edit.
- **`src/features/home/`**: the only feature; it owns the whole page (`pages/HomePage.tsx` placeholder; `components/`, `data/`, `types/` empty until chapters are built). Features never import from other features; shared code goes to `components/common`, `lib`, `hooks`, or `types`.
- **State**: static site — no server-state or global store. Theme via `src/providers/theme-provider.tsx` + `src/hooks/useTheme.ts`; otherwise local `useState`.
- **`src/components/ui/`**: shadcn/ui generated primitives only (currently button, tooltip) — no business logic.
- **`src/lib/utils.ts`**: `cn()` helper for class merging.

## Component primitives (mandatory)

Never emit raw HTML elements in feature/page/section code — use the polymorphic primitives from `@/components/common`:

| Raw element | Use instead |
| --- | --- |
| `div`, `section`, `article`, `header`, `footer`, `main`, `nav`, `ul`, `li` | `<Box as="section">` |
| centered max-width wrapper | `<Container maxWidth="7xl">` |
| `p`, `span` | `<Text as="p" variant="default">` |
| `h1`–`h6` | `<Heading level={2}>` |
| `a` / router link | `<Link href="/x">` |
| `img` | `<Image src alt width height />` |

Interactive controls (buttons, inputs, dialogs) → shadcn/ui, not raw elements. Full mapping and example: `.claude/output-styles/custom-components.md`.

## Working rules

- **Logging**: after creating/changing any feature/section/component, write a log to `logs/feature-changes/YYYY-MM-DD-<slug>.md` (template in that folder) and commit it with the change. See `.agents/rules/logging.md`.
- **Agent memory**: `.claude/agent-memory/<agent>/MEMORY.md` holds durable project knowledge (conventions, decisions, reusable patterns). Read before building, update after changes that introduce/revise a pattern. See `.agents/rules/memory-context.md`.
- **Commits**: Conventional Commits per `.agents/rules/commit-rules.md`.
- Full rule set: `.agents/rules/*` (a11y/perf, code quality, content integrity, motion safety, workflow discipline).
