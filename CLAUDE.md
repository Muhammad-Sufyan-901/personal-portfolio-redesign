# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo state (read this first)

The old enterprise boilerplate (auth, dashboard, axios layer, Zustand store, route guards) was removed in commit `9be4947`. `src/` is now a **minimal portfolio shell**: a single `/` route rendering a placeholder `HomePage`, the common-component primitives, a theme provider, and two shadcn primitives (button, tooltip). The portfolio redesign itself is specified in the root `.agents/` (portable spec: context, roles, workflows, skills, rules) and `.claude/` (Claude Code native config: skills, commands, agents, rules, hooks) folders — a motion-first (GSAP/Lenis) single-page portfolio built per `.agents/context/product_requirements.md`, starting with `/plan-redesign` → approval. The motion stack (GSAP, Lenis, split-type, `@gsap/react`, EmailJS) is specified but **not yet installed** — it's added during the redesign bootstrap.

## Redesign project context

This becomes **Muhammad Sufyan's portfolio** — a motion-first, scroll-telling single page (reference feel: `lukebaffait.fr`, for motion/polish only, not its color or content).

- **Content source**: `.agents/context/product_requirements.md` is the _only_ content source (profile, skills, work, education, awards, projects, contact) — content is transcribed from it, never invented; unknown fields are omitted, not fabricated. The old repo's content does not exist here.
- **Design system**: `.agents/context/design_system.md` — palette, typography, tokens, motion system, per-chapter choreography. Warm ink `#0B0B0F` bg, warm paper `#ECE8E1` text, surgical brass accent.
- **Stack additions over the current shell**: motion via **GSAP** (+ ScrollTrigger) · **Lenis** · **split-type** · `@gsap/react` (`useGSAP`); contact form via EmailJS. Already in place: Tailwind **v4** (`@theme`, no config file), TypeScript **strict**.
- **Non-negotiable rules**: one GSAP source (`src/lib/gsap.ts`) and one Lenis owner (`src/providers/SmoothScrollProvider.tsx`) — no component imports `gsap/ScrollTrigger` directly; every animation runs in `useGSAP(() => {…}, { scope })` with a `prefers-reduced-motion` fallback (opacity-only, Lenis off, cursor hidden); design tokens only, no raw hex/magic px; `cn()` for conditional classes, `cva` for variants; no `any`; Lighthouse ≥ 90.
- **Workflow**: `/plan-redesign` → `PLAN.md` → **stop for approval** → bootstrap tokens/motion foundation → `/build-section <chapter>` per chapter → `/qa-audit` per chapter and at the end.
- **Chapters**: `00 Preloader · 01 Hero · 02 Manifesto · 03 Craft · 04 Journey · 05 Selected Work · 06 Contact · Footer`. Sections live in `src/features/home/sections/*`, content in `src/features/home/constants/*` typed against `src/types/portfolio.ts`.
- Fonts: Fraunces (display) · General Sans/Satoshi (body) · JetBrains Mono (labels) — self-hosted/bundled.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run preview` — preview a production build
- `npx tsc --noEmit` — typecheck only, no build
- No test framework is configured — there are no tests and no test command.

There is no backend. The contact form uses EmailJS; its keys (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`) live in `.env`.

## Architecture

Feature-based structure with TanStack Router file-based routing. Path alias `@/` → `src/`.

- **Routing (`src/routes/`)**: registry-only files — no JSX/component definitions here, just `createFileRoute`/`createRootRoute` wiring a `component` imported from `src/features/**`. Currently `__root.tsx` (wraps `RootLayout`) and `index.tsx` (`/` → `HomePage`) — the portfolio is a single page. `src/routeTree.gen.ts` is TanStack's auto-generated route tree — don't hand-edit it.
- **Features (`src/features/<name>/`)**: only `home` exists — it owns the whole portfolio page. `pages/HomePage.tsx` is a placeholder; `components/`, `data/`, `types/` are empty `.gitkeep` placeholders awaiting the chapter builds (sections go in `sections/`, content constants in `constants/` per the redesign spec above). Features must not import from each other; shared code goes in `components/common`, `lib`, `hooks`, or `types`.
- **State**: the site is static — no server-state layer, no global store. Theme lives in `src/providers/theme-provider.tsx` (consumed via `src/hooks/useTheme.ts`); everything else is local `useState`. The contact form submits through EmailJS directly from the client.
- **Common components (`src/components/common/`)**: `Box`, `Text`, `Heading`, `Container`, `Image`, `Link`, `ThemeToggle` (`.tsx` files) wrap native elements (`div`, `p`/`span`, `h1`-`h6`, centered container, `img`, `a`) and replace raw HTML tags in feature/page code (see the `react/forbid-elements` rule in `.eslintrc`, banning bare `<div>` in favor of `<Box>` — note this legacy `.eslintrc` isn't wired into the ESLint 9 flat config in `eslint.config.js`, so it's a documented convention, not a lint-enforced one).
- **`src/components/ui/`**: shadcn/ui-generated primitives only (config in `components.json`, style "new-york", Tailwind base color "neutral") — no business logic. Currently just `button` and `tooltip`; add more via `/add-shadcn`.
- **Types**: static/compile-time types live in `src/types/` (currently empty; the redesign adds `src/types/portfolio.ts` as the contract for portfolio content). `src/lib/` holds `utils.ts` (`cn()`); the redesign adds `gsap.ts` there as the single GSAP source.

## AI agent operating rules (added)

These apply to Claude Code and any AI agent working in this repo:

- **Custom component primitives:** in feature/page/section TSX, never emit bare `div`/`p`/`span`/`h1`–`h6`/`a`/`img` — use `Box`/`Container`/`Text`/`Heading`/`Link`/`Image` from `@/components/common` (repo enforces `react/forbid-elements`; full mapping + example in `.claude/output-styles/custom-components.md`, also enforced via `.claude/rules/custom-components.md` and the subagents). Interactive controls → shadcn/ui. The `custom-components` output style is the project default (`outputStyle` in `.claude/settings.json`); note output styles don't reach subagents, so the rule + subagent instructions are the durable enforcement.
- **Feature-change logs:** after creating/changing any feature/section/component, write a log to `logs/feature-changes/` (via `/log-change`) before reporting done, and commit it with the change. Logs are history only. See `.claude/rules/logging.md`.
- **Agent memory = project knowledge:** `.claude/agent-memory/<agent>/MEMORY.md` (project scope, committed) holds durable knowledge (layout, custom-component API, conventions, decisions, DRY patterns). Read it before building; update it after any change that introduces/revises a pattern, decision, location, or reusable util (via `/update-memory`). Memory is knowledge, not a changelog. See `.claude/rules/memory-context.md`.
- **Discover tooling:** use `/discover-tooling` to web-search for relevant Claude Code skills and MCP servers for this stack and propose the best fits (propose only; skills → `.claude/skills/`, MCP → `.mcp.json`).

## .claude directory additions (per official docs)

- `output-styles/custom-components.md` — house style forcing the common-component primitives (`keep-coding-instructions: true`).
- `agent-memory/<agent>/MEMORY.md` — per-subagent durable project knowledge (committed).
- `workflows/` — home for native `/workflows` JS scripts (see its README; generate `feature-done` + `section-cycle`).
- `agents/` — subagents now set `memory: project` and are instructed to read/update memory + write logs.
- New rules: `custom-components.md` (path-scoped), `logging.md`, `memory-context.md`. New skills: `log-change`, `update-memory`, `discover-tooling`.
