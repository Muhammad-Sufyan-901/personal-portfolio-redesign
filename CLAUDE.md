# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. Deep specs live in `.agents/context/*` — this file summarizes and points there rather than duplicating them.

## Repo state (read this first)

**`src/` was hard-reset to a single blank page (2026-07-07, `chore(reset)`).** The foundation (design tokens, fonts, motion setup, primitives, data layer) and all chapters 00→footer are rebuilt from the `.agents/context/` specs during the redesign. An earlier pass had shipped chapters 00–04; that code was deliberately deleted — its decisions and gotchas survive in `logs/feature-changes/*` and `.claude/agent-memory/*`, and everything regenerates from the specs (the one non-doc asset, the General Sans woff2 files, must be re-downloaded from Fontshare).

`src/` now holds exactly six files:

- `src/main.tsx` — `StrictMode → RouterProvider` only (no providers);
- `src/routes/__root.tsx` — bare `<Outlet/>`; `src/routes/index.tsx` — inline `BlankPage` (centered title placeholder);
- `src/routeTree.gen.ts` (auto-generated), `src/vite-env.d.ts`;
- `src/styles/globals.css` — just `@import "tailwindcss";` (no tokens yet).

Installed deps are down to the shell: react, react-dom, @tanstack/react-router (+ router-plugin), tailwindcss (+ @tailwindcss/vite), vite, @vitejs/plugin-react, TS/ESLint/Prettier toolchain. GSAP, Lenis, split-type, zustand, react-hook-form, @emailjs/browser, fonts, shadcn, cva/clsx/tailwind-merge, lucide, radix — all uninstalled; reinstall them as the rebuild reaches each need. `vite.config.ts` (router plugin, Tailwind plugin, `@/` alias) and `index.html` are unchanged.

**Nothing described elsewhere in this file or the rules as "built/shipped/installed" exists in `src/` right now** — sections referencing primitives, tokens, data files, chrome, or motion foundation describe the target architecture to rebuild, not the current tree.

## Redesign project context

This is **Muhammad Sufyan's portfolio** — a software engineer (Indonesia) working across web and mobile — a motion-first, scroll-telling single page (reference feel: `lukebaffait.fr`, for motion/polish, not its content). Persona headline: "Software Engineer · Web & Mobile"; stats 3 years experience · 7 stacks · 10 projects.

- **Content source**: `.agents/context/product_requirements.md` is the _only_ content source (profile, skills, tools, work, education, awards, projects, contact) — content is transcribed from it, never invented; unknown fields are omitted, not fabricated. The full dataset is already transcribed (21 skills, 9 journey items, 6 projects, 3 contact channels) — reuse the data layer, never re-transcribe.
- **Design system** (`.agents/context/design_system.md`, **v2 "Void & Ember"** — palette evidence-sampled from 47 reference-video frames, §3.0): bg `#0A0A0A`, surface `#141414`/raised `#1C1C1C`, paper `#E4E4E4`, muted `#9A9A9A`, hairline `#242424`, surgical **ember** accent `#E8380F` (deep `#B32C0B`; brass `#C8A46A` and cobalt `#3B5BFF` are documented alternates — cobalt is what's currently shipped). Motion tokens: `--ease-out: cubic-bezier(0.16,1,0.3,1)`, `--dur-base 0.8s`; Lenis `lerp 0.09`. §7.5 lists the vetted reference component libraries (React Bits, Magic UI, Aceternity UI, 21st.dev) with a mandatory GSAP-adaptation rule.
- **Fonts**: **Fraunces** (display) · **General Sans** (body, UI) · **JetBrains Mono** (labels) — bundled/self-hosted, live today (`@fontsource-variable/fraunces`, `@fontsource/jetbrains-mono`, General Sans woff2 in `src/assets/fonts/`).
- **Stack (all installed)**: React `^19.2.0` · Vite `^7.3.1` · TanStack Router `^1.162.8` · Tailwind **v4** (`^4.2.1`) · TS `~5.9.3` strict · gsap `^3.15.0` + `@gsap/react` (`useGSAP`) · lenis `^1.3.25` · split-type · zustand · react-hook-form · `@emailjs/browser`.
- **Three Golden Rules** (from `system_architecture.md`): (1) **feature isolation** — no `src/features/*` imports another feature; (2) **one GSAP source** — `src/lib/gsap.ts` registers ScrollTrigger + sets defaults, nothing else imports `gsap/ScrollTrigger`; (3) **one Lenis owner** — `src/providers/SmoothScrollProvider.tsx` instantiates Lenis once, synced to `gsap.ticker`.
- **Other non-negotiables**: every animation runs in `useGSAP(() => {…}, { scope })` with a `prefers-reduced-motion` fallback (opacity-only, Lenis off, cursor hidden); design tokens only, no raw hex / magic px; `cn()` for conditional classes, `cva` for variants; no `any`; Lighthouse ≥ 90. Borrowed animated-component ideas go through the `animated-ui-references` skill — never install `framer-motion`.
- **Workflow**: `/plan-redesign` → `PLAN.md` (whole-site) → **stop for approval** → `/build-section <chapter>` one section at a time with a **stop-for-approval gate after every section** → `/qa-audit` per section and at the end. Chapters 00–04 shipped this way, one `feat(<chapter>):` commit each.
- **Chapters**: `00 Preloader · 01 Hero · 02 Manifesto · 03 Craft · 04 Journey · 05 Selected Work · 06 Contact · Footer` (00–04 built). **Journey (04)** merges work experience + education + awards into one timeline — don't drop awards. Sections live in `src/features/home/sections/*`, content in `src/features/home/data/*` typed against `src/types/portfolio.ts`.

## Commands

- `npm run dev` — start Vite dev server (HMR)
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run preview` — preview a production build
- `npx tsc --noEmit` — typecheck only, no build
- No test framework is configured — there are no tests and no test command.

There is no backend. The contact form uses EmailJS; its keys (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`) live in `.env` (gitignored), read via `src/config/env.ts`.

## Architecture

Feature-based structure with TanStack Router file-based routing. Path alias `@/` → `src/` (set in both `tsconfig` and `vite.config.ts`).

### Routing (`src/routes/`)
Registry-only files — no JSX/component definitions here, just `createFileRoute`/`createRootRoute` wiring a `component` imported from `src/features/**`. `__root.tsx` mounts `AppProviders` + `Preloader` + `Cursor` + `RootLayout`; `index.tsx` (`/` → `HomePage`) — the portfolio is a single page. The router plugin runs with `autoCodeSplitting: true` and regenerates `src/routeTree.gen.ts` on dev/build — **never hand-edit it**. Navigation is by anchor/smooth-scroll (the common `Link` uses `lenis.scrollTo` + `pushState`); there are no `beforeLoad` guards.

### Features (`src/features/<name>/`)
Only `home` exists — it owns the whole portfolio page. `pages/HomePage.tsx` composes the built chapters from `sections/` (`HeroSection`, `ManifestoSection`, `CraftSection`, `JourneySection` — `WorkSection`/`ContactSection` to come); reusable feature parts live in `components/` (`JourneyEntry`, `PillarBlock`); transcribed PRD data in `data/*.data.ts`. Features must not import from each other; shared code is promoted to `components/common`, `lib`, `hooks`, or `types`.

### Providers & entry (`src/main.tsx`)
`StrictMode → AppProviders → RouterProvider` where `AppProviders` = `ThemeProvider(defaultTheme="dark", storageKey="vite-ui-theme") → TooltipProvider → SmoothScrollProvider`. The router is created with `scrollRestoration: true` and `defaultPreload: "intent"`. Router devtools live inside `RootLayout`.

### Theme
`src/providers/theme-provider.tsx` exposes `ThemeProvider` and `useTheme()` → `{ theme, setTheme }` with `Theme = "dark" | "light" | "system"`. State persists to `localStorage["vite-ui-theme"]`, toggles `.light`/`.dark` on `<html>`; default is **dark** (dark-first identity). Whether the final portfolio keeps a light toggle is an open design decision (design_system §10 note 8).

### Common components (`src/components/common/`)
Polymorphic primitives that replace raw HTML tags in feature/page/section code, **plus the motion primitives**. Import from the barrel: `import { Box, Heading, Text } from "@/components/common";`.

| Component | Renders | Key props (defaults) |
| --- | --- | --- |
| `Box` | any element | `as` (`"div"`), `className`, + native props |
| `Container` | any element | `as` (`"div"`), `maxWidth` sm…7xl\|full (`"7xl"`), `centerContent` (`false`); always adds `mx-auto px-4 sm:px-6 lg:px-8` |
| `Text` | `p`\|`span`\|`div` | `as` (`"p"`), `variant` default\|lead\|large\|small\|muted (`"default"`) |
| `Heading` | `h1`–`h6` | `level` 1–6 (`1`) or `as`, `variant` default\|display\|title\|subtitle\|section (`"default"`) |
| `Link` | `a` / router link | `href` (required); auto-routes internal (TanStack), hash (Lenis smooth-scroll + `pushState`), external/`mailto:`/`tel:` (auto `rel`) |
| `Image` | `img` (skeleton wrapper) | `src`, `alt` (required), `width`/`height`, `objectFit`, `priority` eager\|lazy (`"lazy"`), `quality` (`75`), `fallback`; builds a `srcset`, preloads, swaps to fallback on error |
| `ThemeToggle` | shadcn `Button` | none — note: not re-exported from the barrel (known follow-up) |
| `RevealText` | split-type reveal | `mode` lines\|words\|chars (`"lines"`), `as`, `delay`, `stagger` (.08/.04/.025) |
| `ParallaxImage` | clip-reveal figure | `aspect`, `parallax` (−8→8), `withScrim` (`false`) |
| `Marquee` / `MagneticButton` / `ChapterEyebrow` | motion utilities | `speed` (30) / `strength` (12) / `index`+`label` |
| `Cursor` / `Preloader` | overlays (z-100 / z-90) | none — mounted once in `__root.tsx` |

Gotcha: `Heading`'s default-variant responsive sizes survive `twMerge` over fluid `--text-*` tokens — sections use `Box as="h3"` + token classes instead (see `.claude/rules/custom-components.md`).

The house rule (bare `<div>`/`<p>`/etc. banned in favor of these) is a **documented convention, not lint-enforced**: the legacy `.eslintrc` describing `react/forbid-elements` is not wired into the ESLint 9 flat config. Enforcement is via the output style + `.claude/rules/custom-components.md` + subagent instructions. `Image`/`ParallaxImage` internally emit raw elements and are exempt.

### shadcn primitives (`src/components/ui/`)
shadcn/ui-generated primitives only (config in `components.json`: style "new-york", base color "neutral", icons "lucide") — no business logic. Currently just `button` and `tooltip`; add more via `/add-shadcn` (or `npx shadcn add`). `eslint.config.js` scopes `react-refresh/only-export-components: off` to `src/components/ui/**`.

### Styling & tokens
Tailwind **v4**, CSS-first: `src/styles/globals.css` (the only stylesheet — `src/index.css` no longer exists) imports Tailwind + fonts, defines the design tokens on `:root`/`.light` and maps them via `@theme inline` into Tailwind utilities (`bg-ink`, `text-paper`, `text-accent`, `font-display`, fluid `--text-*` scale, motion eases/durations, `--radius: 4px`). Use `cn()` (from `src/lib/utils.ts` — an **extended** twMerge that registers the `--text-*` tokens as font-size class groups) and `cva` for variants. Current values are the interim cobalt set; the ember re-theme (design_system v2 §9) is pending — always style by token name.

### State & data
The site is static — **no server-state layer, no HTTP/API layer**. Cross-tree UI state is the minimal zustand store `src/store/useUIStore.ts` (`preloaderDone` — the hero timeline's start cue — and `menuOpen`); theme lives in `ThemeProvider`; everything else is local `useState`. The contact form (chapter 06) will use react-hook-form + `src/lib/emailjs.ts` (not yet created). Don't reintroduce an HTTP/API layer.

### Types
`src/types/portfolio.ts` (`TechStack`, `Project`, `Skill`, `JourneyItem`, `Profile`, `ContactChannel`) is the live content contract — all PRD constants are typed against it so bad edits fail compilation. `src/types/motion.ts` holds `RevealMode`, `ParallaxConfig`. `src/lib/` holds `gsap.ts` (single GSAP source) and `utils.ts` (`cn()`); `emailjs.ts` joins at chapter 06.

### Build & config
TypeScript **strict** (`tsconfig.app.json`: `strict`, `noUnusedLocals`, `noUnusedParameters`, `moduleResolution: bundler`, `verbatimModuleSyntax`, `jsx: react-jsx`, `noEmit`; alias `@/* → ./src/*`). Vite plugin order in `vite.config.ts`: `tanstackRouter({ autoCodeSplitting: true }) → react() → tailwindcss()`. ESLint is a flat config (`eslint.config.js`) extending JS/TS-ESLint recommended + react-hooks + react-refresh; `dist` ignored.

## AI agent operating rules (added)

These apply to Claude Code and any AI agent working in this repo:

- **Custom component primitives:** in feature/page/section TSX, never emit bare `div`/`p`/`span`/`h1`–`h6`/`a`/`img` — use `Box`/`Container`/`Text`/`Heading`/`Link`/`Image` from `@/components/common` (full real prop surfaces + motion primitives + gotchas in `.claude/output-styles/custom-components.md` and `.claude/rules/custom-components.md`). Interactive controls → shadcn/ui. The `custom-components` output style is the project default; output styles don't reach subagents, so the rule + subagent instructions are the durable enforcement.
- **Feature-change logs:** after creating/changing any feature/section/component, write a log to `logs/feature-changes/` (via `/log-change`) before reporting done, and commit it with the change. Logs are history only. See `.claude/rules/logging.md`.
- **Agent memory = project knowledge:** `.claude/agent-memory/<agent>/MEMORY.md` (project scope, committed) holds durable knowledge; overflow lives in linked siblings (`content-data-layer.md`, `site-chrome.md`, `runtime-smoke-testing.md`). Read it before building; update it after any change that introduces/revises a pattern, decision, location, or reusable util (via `/update-memory`). See `.claude/rules/memory-context.md`.
- **Borrowed animated components:** React Bits / Magic UI / Aceternity UI / 21st.dev ideas go through the `animated-ui-references` skill (both sides) — never install `framer-motion`; reimplement in `useGSAP`, swap raw tags for primitives, re-express styles as tokens.
- **Discover tooling:** use `/discover-tooling` to web-search for relevant Claude Code skills and MCP servers and propose the best fits (propose only). Already adopted: context7, chrome-devtools, shadcn MCP; impeccable + design-taste-frontend skills.

## .claude directory additions (per official docs)

- `output-styles/custom-components.md` — house style forcing the common-component primitives (`keep-coding-instructions: true`).
- `agent-memory/<agent>/MEMORY.md` — per-subagent durable project knowledge (committed).
- `workflows/` — home for native `/workflows` JS scripts (see its README; generate `feature-done` + `section-cycle`).
- `agents/` — subagents (`frontend-engineer`, `motion-engineer`, `qa-auditor`) set `memory: project`, carry as-built path maps, and are instructed to read/update memory + write logs.
- Rules: `custom-components.md`, `accessibility.md` (both path-scoped), `logging.md`, `memory-context.md`, plus `motion.md`, `project.md`, `react-typescript.md`, `tailwind-styling.md` — each grounded with a "why this matters here" note.
- Skills (`.claude/skills/`, 9): `plan-redesign`, `build-section`, `qa-audit`, `log-change`, `update-memory`, `discover-tooling`, `animated-ui-references`, + installed design skills `impeccable`, `design-taste-frontend`. Every in-house skill has a portable mirror in `.agents/skills/` (18 total there); the two design skills have pointer stubs.
- Commands: `add-shadcn`, `commit`, `typecheck`. MCP (`.mcp.json`): context7, chrome-devtools, shadcn.

See **AGENTS.md** for the full agent roster, workflow, and tooling inventory.
