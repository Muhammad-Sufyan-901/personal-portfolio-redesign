# Frontend Engineer — Project Memory

## Project
Muhammad Sufyan's portfolio redesign: motion-first, scroll-telling single page (GSAP + Lenis). Reference feel `lukebaffait.fr` (motion only). Content source = `.agents/context/product_requirements.md`.

## Actual repo layout (don't blend with unrelated features)
- `src/` is a React Enterprise Boilerplate (auth + dashboard demo). **Portfolio work lives in `src/features/home/` only** — do NOT modify `features/auth`, `features/dashboard`, `middlewares/`, or protected routes unless explicitly asked.
- Home feature: `features/home/{pages,components,data,types}`. Content in `features/home/data/*.data.ts`; types in `features/home/types/*.type.ts`; components PascalCase (`HeroSection.tsx`).
- Global primitives in `src/components/common`; shadcn in `src/components/ui`; utils in `src/lib` (`cn()` in `src/lib/utils.ts`). Path alias `@/` → `src/`.

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
- (none yet — add design/architecture decisions as they're approved, e.g. chosen accent, single vs multi-page)
