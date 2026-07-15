# GEMINI.md — AI Agent Context

Project context for Gemini CLI. This mirrors `CLAUDE.md`; the exhaustive specs live in `.agents/context/*` — summarize from here, read there for depth.

## Repo state

This is **Muhammad Sufyan's portfolio** — a software engineer (Indonesia) working across web and mobile — a motion-first, scroll-telling single page (reference feel: `lukebaffait.fr`, for motion/polish only, not its content). After the 2026-07-07 `chore(reset)` + PLAN v3 re-bootstrap, `src/` holds:

> **Build status (2026-07-16):** foundation + chapters **00–03** are shipped on the **10-chapter map** — `00 Preloader · 01 Hero · 02 Manifesto · 03 About · 04 Project/Craft · 05 Journey · 06 Skills · 07 Gallery · 08 Contact · Footer` (PLAN v3.1 §0). As built: three-act Welcome/ember/curtain preloader (runs every load), aurora hero (ogl), WebGL MacBook manifesto seam, reference-exact About. Tokens are **ember `#E8380F`** (Void & Ember v2, applied 2026-07-07 — brass/cobalt remain unchosen documented alternates), display face **Fraunces**, dark-only. All **14 primitives** live in `@/components/common` (incl. `PathDraw` — built, not yet wired). Chrome = `MenuButton` → `MenuPopout` (z-60) → `SiteMenu` (z-80); there is no Header/MobileMenu. Remaining: **04 Craft → 08 Contact + Footer** (PLAN v3.1 §7 order) + `src/lib/emailjs.ts` (lands with 08). Deferred to final QA: scroll-spy nav dot, bundle split, favicon/OG.

- the `/` route → `HomePage` composing `sections/{Hero,Manifesto,About}Section.tsx`;
- the full motion foundation: `lib/gsap.ts` (single GSAP source), `providers/SmoothScrollProvider.tsx` (single Lenis, lerp 0.09), hooks (`useLenis`, `usePrefersReducedMotion`, `useIsomorphicLayoutEffect`), zustand `store/useUIStore.ts` (`preloaderDone`, `menuOpen`), `types/motion.ts`;
- common primitives (`Box`, `Container`, `Text`, `Heading`, `Link`, `Image`) + eight motion primitives (`RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `ChapterEyebrow`, `Cursor`, `Preloader`, `PathDraw`) — no `ThemeToggle` (dark-only);
- the PRD data layer (`types/portfolio.ts` + `features/home/data/*.data.ts` + `constants/projects.data.ts`) and the applied ember design tokens in `src/styles/globals.css` (`src/index.css` was deleted);
- site chrome (`MenuButton`/`MenuPopout` z-60, `SiteMenu` z-80, `RootLayout`); feature components `AuroraBackground` + the `manifesto-3d/` R3F island; shadcn `button` + `tooltip`.

## Tech stack (all installed)

React `^19.2.0` (functional components only) · TypeScript `~5.9.3` strict (no `any`) · Vite `^7.3.1` · TanStack Router `^1.162.8` (file-based, registry-only route files, auto code-splitting) · Tailwind CSS `^4.2.1` (CSS-first, `@theme` in `src/styles/globals.css`, no `tailwind.config`) · shadcn/ui (new-york / neutral / lucide) · gsap `^3.15.0` + `@gsap/react` (`useGSAP`) · lenis `^1.3.25` · split-type · zustand · react-hook-form · `@emailjs/browser` · Fraunces / General Sans / JetBrains Mono (bundled/self-hosted) · `cn()` (clsx + extended tailwind-merge) + `cva`. There is no backend.

## Commands

- `npm run dev` — Vite dev server (HMR)
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run lint` — ESLint (flat config)
- `npm run preview` — preview a production build
- `npx tsc --noEmit` — typecheck only
- No test framework is configured.

Contact form uses EmailJS; keys `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` live in `.env` (gitignored), read via `src/config/env.ts`.

## Redesign context

- **Content source**: `.agents/context/product_requirements.md` is the *only* content source — transcribe, never invent; omit unknown fields. The dataset is already transcribed (21 skills, 9 journey items, 6 projects, 3 contact channels) — reuse it, never re-transcribe. Persona: "Software Engineer · Web & Mobile"; stats 3 years · 7 stacks · 10 projects.
- **Design system** (`.agents/context/design_system.md`, **v2 "Void & Ember"**, evidence-sampled from the reference video §3.0): bg `#0A0A0A`, paper `#E4E4E4`, muted `#9A9A9A`, hairline `#242424`, surgical **ember accent `#E8380F`** (brass `#C8A46A`/cobalt `#3B5BFF` are unchosen documented alternates — ember is live in `globals.css`). Motion tokens `--ease-out: cubic-bezier(0.16,1,0.3,1)`, `--dur-base 0.8s`, Lenis `lerp 0.09`. §7.5 lists the vetted reference libraries (React Bits, Magic UI, Aceternity UI, 21st.dev) with a mandatory adapt-to-GSAP rule — never install `framer-motion`.
- **Fonts**: Fraunces (display) · General Sans (body) · JetBrains Mono (labels) — bundled, live today.
- **Chapters**: `00 Preloader · 01 Hero · 02 Manifesto · 03 About · 04 Project/Craft · 05 Journey · 06 Skills · 07 Gallery · 08 Contact · Footer` (PLAN v3.1 §0) — **00–03 built**. **Journey (05)** merges work experience + education + awards — don't drop awards. Sections live in `src/features/home/sections/*`, content in `src/features/home/data/*` typed against `src/types/portfolio.ts`.
- **Three Golden Rules**: (1) feature isolation — no `src/features/*` imports another feature; (2) one GSAP source — `src/lib/gsap.ts`, no component imports `gsap/ScrollTrigger` directly; (3) one Lenis owner — `src/providers/SmoothScrollProvider.tsx`, synced to `gsap.ticker`. Every animation runs in `useGSAP(() => {…}, { scope })` with a `prefers-reduced-motion` fallback (opacity-only, Lenis off, cursor hidden); design tokens only — no raw hex/px; Lighthouse ≥ 90.
- **Workflow**: plan (`PLAN.md`, whole-site) → **stop for approval** → build **one section at a time with a stop-for-approval gate after every section** → QA audit per section and at the end. See `AGENTS.md` and `.agents/workflows/`.

## Architecture (current)

Feature-based structure. Path alias `@/` → `src/` (tsconfig + vite).

- **`src/routes/`**: registry files only — no JSX. `__root.tsx` mounts `AppProviders` + `Preloader` + `Cursor` + `RootLayout`; `index.tsx` → `/` → `HomePage`. `routeTree.gen.ts` is auto-generated (`autoCodeSplitting: true`) — don't hand-edit.
- **`src/features/home/`**: the only feature; owns the whole page. `sections/` holds the three built chapters (Hero/Manifesto/About); `components/` holds `AuroraBackground` + the `manifesto-3d/` R3F island; `data/` holds the typed PRD constants. Features never import from other features; shared code goes to `components/common`, `lib`, `hooks`, or `types`.
- **Entry (`src/main.tsx`)**: `StrictMode → AppProviders → RouterProvider` where `AppProviders` = `ThemeProvider(defaultTheme="dark") → TooltipProvider → SmoothScrollProvider` (router `scrollRestoration: true`, `defaultPreload: "intent"`).
- **Theme**: `useTheme()` → `{ theme, setTheme }`, persisted to `localStorage["vite-ui-theme"]`; default **dark**. The site ships **dark-only** (PLAN v3.1 decision 2; `globals.css` carries no `.light` token block).
- **State/data**: static — no server-state or HTTP layer. Cross-tree state = zustand `useUIStore` (`preloaderDone` gates the hero timeline, `menuOpen`); else local `useState`. Contact form (ch. 06) will use react-hook-form + `src/lib/emailjs.ts` (not yet created).
- **`src/components/ui/`**: shadcn/ui generated primitives only (button, tooltip); add via `/add-shadcn`.
- **Styling**: Tailwind v4 CSS-first in `src/styles/globals.css` — the only stylesheet: fonts, the ember token values, `@theme inline` mapping (`bg-ink`, `text-paper`, `text-accent`, `font-display`, fluid `--text-*` scale, motion tokens, `--radius: 4px`). `cn()` is an *extended* twMerge (registers `--text-*` as font-size groups). Always style by token name.
- **Types**: `src/types/portfolio.ts` (`TechStack`, `Project`, `Skill`, `JourneyItem`, `Profile`, `ContactChannel`) is the live content contract; `src/types/motion.ts` (`RevealMode`, `ParallaxConfig`).

## Component primitives (mandatory)

Never emit raw HTML wrappers in feature/page/section code — use the polymorphic primitives from `@/components/common`:

| Component | Renders | Key props (defaults) |
| --- | --- | --- |
| `Box` | any element | `as` (`"div"`), `className` |
| `Container` | any element | `as` (`"div"`), `maxWidth` sm…7xl\|full (`"7xl"`), `centerContent` (`false`) — adds `mx-auto px-4 sm:px-6 lg:px-8` |
| `Text` | `p`\|`span`\|`div` | `as` (`"p"`), `variant` default\|lead\|large\|small\|muted (`"default"`) |
| `Heading` | `h1`–`h6` | `level` 1–6 (`1`) or `as`, `variant` default\|display\|title\|subtitle\|section (`"default"`) |
| `Link` | `a` / router link | `href` — auto-routes internal (TanStack) / hash (Lenis smooth-scroll) / external·mailto·tel (auto `rel`) |
| `Image` | `img` | `src`, `alt`, `width`/`height`, `objectFit`, `priority` (`"lazy"`), `quality` (`75`), `fallback` — lazy + skeleton + srcset |
| `RevealText` | split-type reveal | `mode` lines\|words\|chars (`"lines"`), `stagger` .08/.04/.025 |
| `PathDraw` | scrubbed SVG path draw | `d`, `strokeWidth` (`3.5`), `trigger`, `scrub` (`true`) — built, not yet wired |
| `ParallaxImage` / `Marquee` / `MagneticButton` / `ChapterEyebrow` | motion primitives | parallax −8→8 / speed 30 / strength 12 / `index`+`label` |
| `Cursor` / `Preloader` | overlays z-100 / z-90 | none — mounted once in `__root.tsx` |

Interactive controls (buttons, inputs, dialogs) → shadcn/ui, not raw elements. The bare-element ban is a documented convention (the `react/forbid-elements` rule is not wired into the ESLint 9 flat config). Full mapping, real prop surfaces, gotchas (e.g. `Heading` sizes vs fluid tokens in twMerge): `.claude/output-styles/custom-components.md` + `.claude/rules/custom-components.md`.

## Skills & knowledge (portable)

- **`.agents/skills/`** (18, agent-agnostic): convention skills `gsap-lenis-motion`, `scrollytelling`, `tailwind-v4-shadcn`, `typescript-react-strict`, `tanstack-router`, `vite-setup`, `accessibility-reduced-motion`, `seo-meta`, `reference-capture`, `animated-ui-references` (the four vetted UI libraries + the adapt-to-GSAP rule); process mirrors `plan-redesign`, `build-section`, `qa-audit`, `log-change`, `update-memory`, `discover-tooling`; pointer stubs for the Claude-installed `impeccable` and `design-taste-frontend` toolkits.
- **`.agents/rules/`** (always on): `commit-rules`, `content-integrity`, `code-quality`, `motion-safety`, `accessibility-performance`, `workflow-discipline`, `logging`, `memory-context` — each with a project-grounded "why this matters here" note.
- **Agent memory**: `.claude/agent-memory/<agent>/MEMORY.md` (+ siblings `content-data-layer.md`, `site-chrome.md`, `runtime-smoke-testing.md`) holds durable project knowledge readable by any agent. Read before building; update after changes that introduce/revise a pattern.

## Working rules

- **Logging**: after creating/changing any feature/section/component, write a log to `logs/feature-changes/YYYY-MM-DD-<slug>.md` (template in that folder) and commit it with the change. See `.agents/rules/logging.md`.
- **Agent memory**: read the relevant MEMORY.md before building; update after pattern-changing work. See `.agents/rules/memory-context.md`.
- **Commits**: Conventional Commits (`type(scope): summary`) per `.agents/rules/commit-rules.md`; one logical unit per commit (history shape: one `feat(<chapter>):` per section); `tsc` + `eslint` green before committing.
- **Per-section gates**: one section per build cycle, stop for user approval after each (`.agents/workflows/section.md`).
