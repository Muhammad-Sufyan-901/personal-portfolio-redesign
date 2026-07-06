# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo state (read this first)

`src/` currently contains a generic **React Enterprise Boilerplate** (auth + dashboard demo), not a portfolio — despite the repo name. The actual portfolio redesign work is specified in the root `.agents/` (portable spec: context, roles, workflows, skills, rules) and `.claude/` (Claude Code native config: skills, commands, agents, rules, hooks) folders, describing a motion-first (GSAP/Lenis) single-page portfolio to be built from scratch per `.agents/context/product_requirements.md`. Until that build actually starts, treat `src/` as the real, current app — don't blend its conventions with the redesign spec below.

## Redesign project context

This becomes **Muhammad Sufyan's portfolio** — a motion-first, scroll-telling single page (reference feel: `lukebaffait.fr`, for motion/polish only, not its color or content).

- **Content source**: `.agents/context/product_requirements.md` is the _only_ content source (profile, skills, work, education, awards, projects, contact) — content is transcribed from it, never invented; unknown fields are omitted, not fabricated. The old repo's content does not exist here.
- **Design system**: `.agents/context/design_system.md` — palette, typography, tokens, motion system, per-chapter choreography. Warm ink `#0B0B0F` bg, warm paper `#ECE8E1` text, surgical brass accent.
- **Stack additions over the current boilerplate**: Tailwind **v4** (`@theme`, no config file) instead of v3; motion via **GSAP** (+ ScrollTrigger) · **Lenis** · **split-type** · `@gsap/react` (`useGSAP`); TypeScript **strict**; contact form via EmailJS.
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

Backend API is expected at `VITE_API_BASE_URL` (`.env`), default `http://localhost:8000/api`.

## Architecture

Feature-based structure with TanStack Router file-based routing. Path alias `@/` → `src/`.

- **Routing (`src/routes/`)**: registry-only files — no JSX/component definitions here, just `createFileRoute`/`createRootRoute` wiring a `component` imported from `src/features/**`. Route guards go through `beforeLoad`, calling into `src/middlewares/authMiddleware.ts` (`requireAuth`, `requireGuest`) rather than inline logic. `src/routeTree.gen.ts` is TanStack's auto-generated route tree — don't hand-edit it.
- **Features (`src/features/<name>/`)**: each domain (`auth`, `home`, `dashboard`) owns its `pages/` (route-level "smart" components), `components/` (feature-local presentational components), `hooks/`, `services/` (API calls via the shared `axios` instance), `schemas/` (Zod), `types/`, and `layouts/`. Features should not import from each other; shared code goes in `components/common`, `lib`, `hooks`, or `types`.
- **State**: server state via TanStack Query (`useQuery`/`useMutation` in feature `hooks/`, e.g. `useLogin.ts`); global client/UI state via Zustand in `src/store/` (e.g. `useAuthStore.ts` — holds the auth token, persisted to a `js-cookie` cookie); local component state via `useState`. Don't cache API responses in Zustand or `useState`.
- **HTTP layer (`src/lib/axios.ts`)**: single shared `api` axios instance. Request interceptor attaches the Bearer token from `useAuthStore`; response interceptor unwraps `response.data` and force-logs-out + redirects to `/login` on a 401 (except the login call itself).
- **Forms**: `react-hook-form` + `@hookform/resolvers/zod`, validated against schemas in each feature's `schemas/` dir; form value types are inferred from the schema (`z.infer<...>`), not hand-written.
- **Common components (`src/components/common/`)**: `Box`, `Text`, `Heading`, `Container`, `Image`, `Link` wrap native elements (`div`, `p`/`span`, `h1`-`h6`, centered container, `img`, `a`) and are meant to replace raw HTML tags in feature/page code (see the `react/forbid-elements` rule in `.eslintrc`, banning bare `<div>` in favor of `<Box>` — note this legacy `.eslintrc` isn't wired into the ESLint 9 flat config in `eslint.config.js`, so it's a documented convention, not a lint-enforced one).
- **`src/components/ui/`**: shadcn/ui-generated primitives only (config in `components.json`, style "new-york", Tailwind base color "neutral") — no business logic.
- **Types vs schemas**: runtime validation lives in a feature's `schemas/` (Zod); static/compile-time types live in `types/`. Generic API envelope types (`ApiResponse<T>`, `ApiError`) live in `src/types/api.type.ts`.

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
