# Frontend Engineer — Project Memory

> **STATUS (2026-07-08, post B0 re-bootstrap):** after the 2026-07-07 hard reset, the **foundation was rebuilt** per PLAN v3 (`chore(setup)` commit): tokens (ember, dark-only — values live directly in `@theme`, no `.light` block), fonts (**Fraunces IS the display face again**, PLAN v3 decision #5 — the earlier grotesk swap is reverted; General Sans body; JetBrains Mono labels), all 14 primitives (base 6 + motion 8 incl. PathDraw), providers/hooks/store, full data layer. **Sections/chrome do NOT exist yet** (HomePage is a placeholder; no Header/MobileMenu/Footer; Preloader/Cursor built but not mounted) — chapters 00→Footer build one gate at a time on the NEW 10-chapter map: `00 Preloader · 01 Hero · 02 Manifesto · 03 About · 04 Project/Craft · 05 Journey · 06 Skills · 07 Gallery · 08 Contact · Footer`.

## Project
Muhammad Sufyan's portfolio redesign: motion-first, scroll-telling single page (GSAP + Lenis). Reference feel `lukebaffait.fr` (motion only). Content source = `.agents/context/product_requirements.md`.

## Actual repo layout (bootstrap landed 2026-07-07 — tokens + motion foundation IN)
- Routing is only `/` → `features/home/pages/HomePage.tsx` (default export, re-exported by `features/home/index.ts`); `routes/__root.tsx` mounts `<Preloader /> <Cursor /> <RootLayout />`.
- **Design tokens are applied** in `src/styles/globals.css` (`@theme inline`): palette (`ink/surface/raised/paper/muted/faint/line`), **accent = EMBER `#E8380F`** (deep `#B32C0B`; Void & Ember v2 applied 2026-07-07 — cobalt/brass are historical alternates; new: `invert-bg/invert-text` + `--selection-bg` tokens), fluid type scale (`text-display/chapter/statement/item/body/eyebrow/index/meta`), `spacing-page-x`, `spacing-section`, motion vars. Light mode exists via `.light` var flips; shadcn compat tokens remapped onto the palette (`text-foreground` ≡ paper). Fonts bundled: JetBrains Mono (@fontsource) + General Sans (local woff2) — **General Sans is also `--font-display`** (grotesk swap, design_system §4.1B; Fraunces removed 2026-07-07; `Heading` display variant is `font-medium`).
- **Motion stack installed**: gsap + @gsap/react, lenis, split-type, zustand. `src/store/useUIStore.ts` (`preloaderDone`, `menuOpen` + setters), hooks `useLenis`/`usePrefersReducedMotion`/`useIsomorphicLayoutEffect`, `src/lib/gsap.ts`.
- Home feature: `features/home/{pages,sections,components,data,types}` — chapters go in `sections/` (HeroSection done); `data/` holds PRD constants (see content-data-layer memory).
- Global primitives + motion components in `src/components/common` (barrel `index.tsx`): Box, Container, Text, Heading, Link, Image, ThemeToggle, ChapterEyebrow, Cursor, MagneticButton, Marquee, ParallaxImage, Preloader, RevealText. shadcn in `src/components/ui` (button, tooltip). Layout chrome in `src/components/layouts/` (RootLayout, Header, MobileMenu).
- Providers: `main.tsx` → `ThemeProvider` → `TooltipProvider` → `RouterProvider`. `routeTree.gen.ts` auto-regenerates — never hand-edit.

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
- Design tokens only (Tailwind v4 `@theme` in `src/styles/globals.css`), no raw hex/px. `h-18` = 72px header height (v4 dynamic spacing).
- **`cn()` is an extended twMerge** (`src/lib/utils.ts`): custom `--text-*` tokens are registered as font-size class groups — plain twMerge classifies `text-body`/`text-meta` as *colors* and silently drops them next to `text-muted`. **Any new `--text-*` token must be added to that classGroups list.** Note: `Box`/`Link` pass className raw (no cn); `Text`/`Heading` cn against their variant classes.
- `Heading variant="display"` = design-system display style (`font-display font-normal text-display`) — use it for hero/footer name, don't restyle by hand. Other Heading/Text variants still carry boilerplate sizes; override via className (cn merge now safe).
- Reuse existing common components + data types before writing new ones. If you add a shared primitive/util, record it here.

## Tooling (installed 2026-07-06)
- MCP servers in root `.mcp.json`: **context7** (live GSAP/TanStack/Tailwind v4/shadcn docs — prefer over memory for API syntax), **shadcn** (official registry — search/install components, pairs with `/add-shadcn`), **chrome-devtools** (QA).
- Design-quality skills: **impeccable** (`.claude/skills/impeccable/`, `/impeccable <craft|polish|audit|…>`; run `/impeccable init` first use) and **design-taste-frontend** (`.claude/skills/design-taste-frontend/`, anti-slop dials for portfolios). Use during section builds, not just review.
- Prettier is a devDependency; PostToolUse hook auto-formats every Edit/Write (`.claude/hooks/format.sh`, respects `.prettierrc`).

## Memories
- [Content data layer](content-data-layer.md) — PRD constants: `features/home/data/*.data.ts`, `src/constants/{projects.data,navigation}.ts`, `src/config/{site,env}.ts`, typed vs `src/types/portfolio.ts`. Reuse, never re-transcribe.
- [Site chrome](site-chrome.md) — Header/MobileMenu/RootLayout frame, z-scale 60/80/90/100, preloader-inert pattern, hero structure + section conventions for chapters 02–06.

## Decisions log (durable facts only)
- shadcn `ui/` kept minimal (button, tooltip); `eslint.config.js` scopes `react-refresh/only-export-components: off` to `src/components/ui/**` (shadcn exports cva variants alongside components).
- Portfolio is static + EmailJS client-side — no axios/API layer; don't reintroduce an HTTP layer.
- Root docs (2026-07-06): `AGENTS.md` is the committed cross-tool agents overview (gitignored `AGENT_README.md`/`AGENT_NOTES.md` are local scratch); README/CLAUDE.md/gemini.md summarize and point to `.agents/context/*` — never duplicate the deep specs into root docs. When conventions change, update all four together.
- 2026-07-07 (kit enrichment): **design_system.md v2 "Void & Ember" is authoritative** — accent = ember `#E8380F` (deep `#B32C0B`); the shipped cobalt globals.css is pre-migration state, re-theme pending. Style by token *name* only. PRD §6.1 annotated resolved.
- 2026-07-07: skill sets reconciled — `.agents/skills/` (18) = 10 convention skills + 5 process mirrors + 2 vendored pointer stubs + `animated-ui-references`; `.claude/skills/` (9) adds `animated-ui-references`. Borrowing from React Bits / Magic UI / Aceternity / 21st.dev goes through that skill: never install framer-motion; adapt to useGSAP + primitives + tokens.
- 2026-07-07: execution rhythm codified — planning is whole-site; building is one section per approval gate (stop after every chapter, incl. revision passes).
- 2026-07-07 (cleanup sweep): package renamed to `muhammad-sufyan-portfolio` (+ description/author); starter assets gone (`react.svg`, `vite.svg`, `constants/images.ts` — favicon is an inline data-URI placeholder in `index.html`, real favicon still to ship); unused deps `@base-ui/react` + `tw-animate-css` uninstalled (shadcn ui/ uses the unified `radix-ui` package). Baseline verified residue-free: no axios/react-query/framer-motion/auth/dashboard anywhere.
