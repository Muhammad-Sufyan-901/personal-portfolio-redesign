# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. Deep specs live in `.agents/context/*` — this file summarizes and points there rather than duplicating them.

## Repo state (read this first)

The old enterprise boilerplate (auth, dashboard, axios layer, Zustand store, route guards, ~50 shadcn components, and their deps) was removed in commit `9be4947`. `src/` is now a **minimal portfolio shell**:

- a single `/` route rendering a placeholder `HomePage`;
- the common-component primitives (`Box`, `Container`, `Text`, `Heading`, `Link`, `Image`, `ThemeToggle`);
- a theme provider + `useTheme` hook;
- two shadcn primitives (`button`, `tooltip`).

The portfolio redesign itself is specified in the root `.agents/` (portable, tool-agnostic spec: context, roles, workflows, skills, rules) and `.claude/` (Claude Code native config: skills, commands, agents, rules, hooks) folders — a motion-first (GSAP/Lenis) single-page portfolio built per `.agents/context/product_requirements.md`, starting with `/plan-redesign` → approval.

**Two things are specified but not yet in the code — don't treat them as present:**
1. The **motion stack** (GSAP, Lenis, split-type, `@gsap/react`, EmailJS, the display/body fonts) is not installed — it lands at the redesign bootstrap.
2. The **redesign design tokens** are not applied. `src/index.css` currently holds the **default shadcn oklch (blue/neutral) palette** with `--font-sans: Inter`; the warm ink/paper/brass tokens and Fraunces/General Sans fonts from the design system are the target, not the current state.

## Redesign project context

This becomes **Muhammad Sufyan's portfolio** — a software engineer (Indonesia) working across web and mobile — a motion-first, scroll-telling single page (reference feel: `lukebaffait.fr`, for motion/polish only, not its color or content). Persona headline: "Software Engineer · Web & Mobile"; stats 3 years experience · 7 stacks · 10 projects.

- **Content source**: `.agents/context/product_requirements.md` is the _only_ content source (profile, skills, tools, work, education, awards, projects, contact) — content is transcribed from it, never invented; unknown fields are omitted, not fabricated. The old repo's content does not exist here.
- **Design system** (`.agents/context/design_system.md`): palette, typography, tokens, motion system, per-chapter choreography (§11). Target palette — warm ink `#0B0B0F` bg, surface `#14141A`/raised `#1C1C24`, warm paper `#ECE8E1` text, muted `#8A8A94`, hairline `#26262E`, surgical **brass** accent `#C8A46A` (deep `#A8823E`; a cobalt `#3B5BFF` alternate is an open decision). Motion tokens: `--ease-out: cubic-bezier(0.16,1,0.3,1)`, `--dur-base 0.8s`; Lenis `lerp 0.09`.
- **Fonts**: **Fraunces** (display — name, chapter titles) · **General Sans**/Satoshi (body, UI) · **JetBrains Mono** (chapter numbers, eyebrows, labels) — self-hosted/bundled.
- **Stack additions over the current shell**: motion via **GSAP** (+ ScrollTrigger) · **Lenis** · **split-type** · `@gsap/react` (`useGSAP`); contact form via EmailJS (`@emailjs/browser`). Already in place: Tailwind **v4**, TypeScript **strict**.
- **Three Golden Rules** (from `system_architecture.md`): (1) **feature isolation** — no `src/features/*` imports another feature; (2) **one GSAP source** — `src/lib/gsap.ts` registers ScrollTrigger + sets defaults, nothing else imports `gsap/ScrollTrigger`; (3) **one Lenis owner** — `src/providers/SmoothScrollProvider.tsx` instantiates Lenis once, synced to `gsap.ticker`.
- **Other non-negotiables**: every animation runs in `useGSAP(() => {…}, { scope })` with a `prefers-reduced-motion` fallback (opacity-only, Lenis off, cursor hidden); design tokens only, no raw hex / magic px; `cn()` for conditional classes, `cva` for variants; no `any`; Lighthouse ≥ 90.
- **Workflow**: `/plan-redesign` → `PLAN.md` → **stop for approval** → bootstrap tokens/motion foundation → `/build-section <chapter>` per chapter → `/qa-audit` per chapter and at the end.
- **Chapters**: `00 Preloader · 01 Hero · 02 Manifesto · 03 Craft · 04 Journey · 05 Selected Work · 06 Contact · Footer`. Note **Journey (04)** merges work experience + education + awards into one timeline — don't drop awards. Sections live in `src/features/home/sections/*`, content in `src/features/home/constants/*` typed against `src/types/portfolio.ts`.

## Commands

- `npm run dev` — start Vite dev server (HMR)
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run preview` — preview a production build
- `npx tsc --noEmit` — typecheck only, no build
- No test framework is configured — there are no tests and no test command.

There is no backend. The contact form uses EmailJS; its keys (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`) live in `.env` (gitignored).

## Architecture

Feature-based structure with TanStack Router file-based routing. Path alias `@/` → `src/` (set in both `tsconfig` and `vite.config.ts`).

### Routing (`src/routes/`)
Registry-only files — no JSX/component definitions here, just `createFileRoute`/`createRootRoute` wiring a `component` imported from `src/features/**`. Currently `__root.tsx` (`createRootRoute({ component: RootLayout })`) and `index.tsx` (`/` → `HomePage`) — the portfolio is a single page. The router plugin runs with `autoCodeSplitting: true` and regenerates `src/routeTree.gen.ts` on dev/build — **never hand-edit it**. Default single-page navigation is by anchor/smooth-scroll; there are no `beforeLoad` guards.

### Features (`src/features/<name>/`)
Only `home` exists — it owns the whole portfolio page. `pages/HomePage.tsx` is a placeholder; `components/`, `data/`, `types/` are empty `.gitkeep` placeholders awaiting the chapter builds. Per the redesign spec, chapters go in `sections/` (numbered `HeroSection`…`ContactSection`), reusable feature parts (WorkCard, JourneyItem, PillarBlock) in `components/`, and transcribed PRD data in `constants/` typed against the global models. Features must not import from each other; shared code is promoted to `components/common`, `lib`, `hooks`, or `types`.

### Providers & entry (`src/main.tsx`)
Provider nesting, outermost → innermost: `StrictMode → ThemeProvider(defaultTheme="system", storageKey="vite-ui-theme") → TooltipProvider → RouterProvider`. The router is created with `scrollRestoration: true` and `defaultPreload: "intent"`. TanStack Router devtools live inside `RootLayout` (`src/components/layouts/RootLayout.tsx`), which wraps the router `<Outlet />`. At the redesign bootstrap, `SmoothScrollProvider` (Lenis owner) joins the provider stack and `Cursor`/`Preloader` mount in `__root.tsx`.

### Theme
`src/providers/theme-provider.tsx` exposes `ThemeProvider` (props `defaultTheme`, `storageKey`) and `useTheme()` → `{ theme, setTheme }` with `Theme = "dark" | "light" | "system"`. State persists to `localStorage["vite-ui-theme"]` and toggles `.light`/`.dark` on `<html>`. Note: `index.html` ships `<html class="dark">`, so the site is effectively dark by default; `ThemeToggle` flips light/dark. Whether the final portfolio keeps a toggle or goes dark-only is an open design decision.

### Common components (`src/components/common/`)
Polymorphic primitives that replace raw HTML tags in feature/page/section code. Import from the barrel: `import { Box, Heading, Text } from "@/components/common";`.

| Component | Renders | Key props (defaults) |
| --- | --- | --- |
| `Box` | any element | `as` (`"div"`), `className`, + native props |
| `Container` | any element | `as` (`"div"`), `maxWidth` sm…7xl\|full (`"7xl"`), `centerContent` (`false`); always adds `mx-auto px-4 sm:px-6 lg:px-8` |
| `Text` | `p`\|`span`\|`div` | `as` (`"p"`), `variant` default\|lead\|large\|small\|muted (`"default"`) |
| `Heading` | `h1`–`h6` | `level` 1–6 (`1`) or `as`, `variant` default\|display\|title\|subtitle\|section (`"default"`) |
| `Link` | `a` / router link | `href` (required); auto-routes internal (TanStack), hash (smooth-scroll + `pushState`), external/`mailto:`/`tel:` (auto `rel`) |
| `Image` | `img` (skeleton wrapper) | `src`, `alt` (required), `width`/`height`, `objectFit`, `priority` eager\|lazy (`"lazy"`), `quality` (`75`), `fallback`; builds a `srcset`, preloads, swaps to fallback on error |
| `ThemeToggle` | shadcn `Button` | none — reads `useTheme`, toggles light/dark |

The house rule (bare `<div>`/`<p>`/etc. banned in favor of these) is a **documented convention, not lint-enforced**: the legacy `.eslintrc` describing `react/forbid-elements` is not wired into the ESLint 9 flat config (`eslint.config.js` has no such rule). Enforcement is via the output style + `.claude/rules/custom-components.md` + subagent instructions. `Image` internally emits raw `<div>`/`<img>` and is exempt.

### shadcn primitives (`src/components/ui/`)
shadcn/ui-generated primitives only (config in `components.json`: style "new-york", base color "neutral", icons "lucide", css `src/index.css`) — no business logic. Currently just `button` and `tooltip`; add more via `/add-shadcn` (or `npx shadcn add`). `eslint.config.js` scopes `react-refresh/only-export-components: off` to `src/components/ui/**` because shadcn files export `cva` variants alongside components.

### Styling & tokens
Tailwind **v4**, CSS-first: `src/index.css` does `@import "tailwindcss"`, declares `@custom-variant dark (&:is(.dark *))` for class-based dark mode, defines shadcn tokens as **oklch** CSS vars in `:root`/`.dark`, and maps them into Tailwind theme tokens via `@theme inline { … }`. Use `cn()` (from `src/lib/utils.ts`, `twMerge(clsx(...))`) for conditional classes and `cva` for variants. The redesign replaces the default shadcn palette with the design-system tokens (ink/paper/brass, Fraunces/General Sans/JetBrains Mono) via `@theme` — not yet done.

### State & data
The site is static — **no server-state layer, no TanStack Query, and currently no global store**. Theme is the only cross-cutting client state today (via `ThemeProvider`); everything else is local `useState`. Per `system_architecture.md`, the redesign plans a *minimal* Zustand `useUIStore` (only `preloaderDone`, `menuOpen`, `theme`) and a react-hook-form contact form that submits through `src/lib/emailjs.ts` — neither is installed yet; add them at build time, don't reintroduce an HTTP/API layer.

### Types
Static/compile-time types live in `src/types/` (currently empty). The redesign adds `src/types/portfolio.ts` (`Project`, `Skill`, `JourneyItem`, `Profile`, `TechStack`) as the content contract and `src/types/motion.ts` (`RevealMode`, `ParallaxConfig`); PRD constants are typed against these so bad edits fail compilation. `src/lib/` holds `utils.ts` (`cn()`); the redesign adds `gsap.ts` (single GSAP source) and `emailjs.ts` there.

### Build & config
TypeScript **strict** (`tsconfig.app.json`: `strict`, `noUnusedLocals`, `noUnusedParameters`, `moduleResolution: bundler`, `verbatimModuleSyntax`, `jsx: react-jsx`, `noEmit`; alias `@/* → ./src/*`). Vite plugin order in `vite.config.ts`: `tanstackRouter({ autoCodeSplitting: true }) → react() → tailwindcss()`. ESLint is a flat config (`eslint.config.js`) extending JS/TS-ESLint recommended + react-hooks + react-refresh; `dist` ignored.

## AI agent operating rules (added)

These apply to Claude Code and any AI agent working in this repo:

- **Custom component primitives:** in feature/page/section TSX, never emit bare `div`/`p`/`span`/`h1`–`h6`/`a`/`img` — use `Box`/`Container`/`Text`/`Heading`/`Link`/`Image` from `@/components/common` (full mapping + example in `.claude/output-styles/custom-components.md`, also enforced via `.claude/rules/custom-components.md` and the subagents). Interactive controls → shadcn/ui. The `custom-components` output style is the project default (`outputStyle` in `.claude/settings.json`); note output styles don't reach subagents, so the rule + subagent instructions are the durable enforcement. This is a convention, not a lint rule (see Architecture → Common components).
- **Feature-change logs:** after creating/changing any feature/section/component, write a log to `logs/feature-changes/` (via `/log-change`) before reporting done, and commit it with the change. Logs are history only. See `.claude/rules/logging.md`.
- **Agent memory = project knowledge:** `.claude/agent-memory/<agent>/MEMORY.md` (project scope, committed) holds durable knowledge (layout, custom-component API, conventions, decisions, DRY patterns). Read it before building; update it after any change that introduces/revises a pattern, decision, location, or reusable util (via `/update-memory`). Memory is knowledge, not a changelog. See `.claude/rules/memory-context.md`.
- **Discover tooling:** use `/discover-tooling` to web-search for relevant Claude Code skills and MCP servers for this stack and propose the best fits (propose only; skills → `.claude/skills/`, MCP → `.mcp.json`).

## .claude directory additions (per official docs)

- `output-styles/custom-components.md` — house style forcing the common-component primitives (`keep-coding-instructions: true`).
- `agent-memory/<agent>/MEMORY.md` — per-subagent durable project knowledge (committed).
- `workflows/` — home for native `/workflows` JS scripts (see its README; generate `feature-done` + `section-cycle`).
- `agents/` — subagents (`frontend-engineer`, `motion-engineer`, `qa-auditor`) set `memory: project` and are instructed to read/update memory + write logs.
- Rules: `custom-components.md` (path-scoped), `logging.md`, `memory-context.md`, plus `motion.md`, `project.md`, `react-typescript.md`, `tailwind-styling.md`. Skills: `plan-redesign`, `build-section`, `qa-audit`, `log-change`, `update-memory`, `discover-tooling` (+ design skills). Commands: `add-shadcn`, `commit`, `typecheck`. MCP (`.mcp.json`): context7, chrome-devtools, shadcn.

See **AGENTS.md** for the full agent roster, workflow, and tooling inventory.
