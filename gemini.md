# GEMINI.md — AI Agent Context

Project context for Gemini CLI. This mirrors `CLAUDE.md`; the exhaustive specs live in `.agents/context/*` — summarize from here, read there for depth.

## Repo state

This is **Muhammad Sufyan's portfolio** — a software engineer (Indonesia) working across web and mobile — a motion-first, scroll-telling single page (reference feel: `lukebaffait.fr`, for motion/polish only, not its color or content). The old enterprise boilerplate (auth, dashboard, axios, Zustand store, route guards, ~50 shadcn components) was removed in commit `9be4947`. `src/` is now a minimal shell:

- a single `/` route rendering a placeholder `HomePage`;
- common-component primitives (`Box`, `Container`, `Text`, `Heading`, `Link`, `Image`, `ThemeToggle`);
- a theme provider + `useTheme`;
- two shadcn primitives (`button`, `tooltip`).

**Not yet present — don't treat as existing:** the motion stack (GSAP, Lenis, split-type, `@gsap/react`, EmailJS, redesign fonts) is not installed, and the redesign tokens are not applied — `src/index.css` still holds the default shadcn oklch (blue/neutral) palette with `--font-sans: Inter`. Both arrive at the redesign bootstrap.

## Tech stack

**Installed:** React 19 (functional components only) · TypeScript strict (no `any`) · Vite 7 · TanStack Router (file-based, registry-only route files, auto code-splitting) · Tailwind CSS v4 (CSS-first, no `tailwind.config`) · shadcn/ui (new-york / neutral / lucide) · `cn()` (clsx + tailwind-merge) + `cva`.

**Added at redesign bootstrap:** GSAP + ScrollTrigger · Lenis · split-type · `@gsap/react` (`useGSAP`) · EmailJS (`@emailjs/browser`) · Fraunces / General Sans / JetBrains Mono. There is no backend.

## Commands

- `npm run dev` — Vite dev server (HMR)
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run lint` — ESLint (flat config)
- `npm run preview` — preview a production build
- `npx tsc --noEmit` — typecheck only
- No test framework is configured.

Contact form uses EmailJS; keys `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` live in `.env` (gitignored).

## Redesign context

- **Content source**: `.agents/context/product_requirements.md` is the *only* content source (profile, skills, tools, work, education, awards, projects, contact) — transcribe, never invent; omit unknown fields. Persona: "Software Engineer · Web & Mobile"; stats 3 years · 7 stacks · 10 projects.
- **Design system** (`.agents/context/design_system.md`): target palette — warm ink `#0B0B0F` bg, warm paper `#ECE8E1` text, brass accent `#C8A46A` (cobalt `#3B5BFF` alternate is an open decision); motion tokens `--ease-out: cubic-bezier(0.16,1,0.3,1)`, `--dur-base 0.8s`, Lenis `lerp 0.09`.
- **Fonts**: Fraunces (display) · General Sans/Satoshi (body) · JetBrains Mono (labels) — self-hosted.
- **Chapters**: `00 Preloader · 01 Hero · 02 Manifesto · 03 Craft · 04 Journey · 05 Selected Work · 06 Contact · Footer`. **Journey (04)** merges work experience + education + awards — don't drop awards. Sections go in `src/features/home/sections/*`, content in `src/features/home/constants/*` typed against `src/types/portfolio.ts`.
- **Three Golden Rules**: (1) feature isolation — no `src/features/*` imports another feature; (2) one GSAP source — `src/lib/gsap.ts`, no component imports `gsap/ScrollTrigger` directly; (3) one Lenis owner — `src/providers/SmoothScrollProvider.tsx`, synced to `gsap.ticker`. Every animation runs in `useGSAP(() => {…}, { scope })` with a `prefers-reduced-motion` fallback (opacity-only, Lenis off); design tokens only — no raw hex/px; Lighthouse ≥ 90.
- **Workflow**: plan (`PLAN.md`) → **stop for approval** → bootstrap tokens/motion → build one chapter at a time → QA audit per chapter and at the end. See `AGENTS.md` and `.agents/workflows/`.

## Architecture (current)

Feature-based structure. Path alias `@/` → `src/` (tsconfig + vite).

- **`src/routes/`**: registry files only — no JSX; they wire a `component` imported from `src/features/**`. `__root.tsx` → `RootLayout`; `index.tsx` → `/` → `HomePage`. `routeTree.gen.ts` is auto-generated (`autoCodeSplitting: true`) — don't hand-edit.
- **`src/features/home/`**: the only feature; owns the whole page (`pages/HomePage.tsx` placeholder; `components/`, `data/`, `types/` empty until chapters are built — spec puts chapters in `sections/`, content in `constants/`). Features never import from other features; shared code goes to `components/common`, `lib`, `hooks`, or `types`.
- **Entry (`src/main.tsx`)**: `StrictMode → ThemeProvider(defaultTheme="system", storageKey="vite-ui-theme") → TooltipProvider → RouterProvider` (router `scrollRestoration: true`, `defaultPreload: "intent"`). Router devtools live inside `RootLayout`. `SmoothScrollProvider` joins the stack at bootstrap.
- **Theme**: `useTheme()` → `{ theme, setTheme }`, `Theme = "dark" | "light" | "system"`, persisted to `localStorage["vite-ui-theme"]`, toggles `.light`/`.dark` on `<html>`; `index.html` forces `class="dark"` (dark by default).
- **State/data**: static — no server-state layer, and currently no global store. Theme is the only cross-cutting state; else local `useState`. Spec plans a minimal Zustand `useUIStore` (`preloaderDone`, `menuOpen`, `theme`) + react-hook-form contact via `src/lib/emailjs.ts` — not installed yet; no HTTP/API layer.
- **`src/components/ui/`**: shadcn/ui generated primitives only (button, tooltip) — no business logic; add via `/add-shadcn`.
- **Styling**: Tailwind v4 CSS-first in `src/index.css` (`@import "tailwindcss"`, `@custom-variant dark`, oklch tokens, `@theme inline`). `cn()` from `src/lib/utils.ts`; `cva` for variants. Redesign swaps in ink/paper/brass tokens via `@theme` — pending.
- **Types**: `src/types/` empty now; redesign adds `portfolio.ts` (`Project`, `Skill`, `JourneyItem`, `Profile`, `TechStack`) + `motion.ts`.

## Component primitives (mandatory)

Never emit raw HTML wrappers in feature/page/section code — use the polymorphic primitives from `@/components/common`:

| Component | Renders | Key props (defaults) |
| --- | --- | --- |
| `Box` | any element | `as` (`"div"`), `className` |
| `Container` | any element | `as` (`"div"`), `maxWidth` sm…7xl\|full (`"7xl"`), `centerContent` (`false`) — adds `mx-auto px-4 sm:px-6 lg:px-8` |
| `Text` | `p`\|`span`\|`div` | `as` (`"p"`), `variant` default\|lead\|large\|small\|muted (`"default"`) |
| `Heading` | `h1`–`h6` | `level` 1–6 (`1`) or `as`, `variant` default\|display\|title\|subtitle\|section (`"default"`) |
| `Link` | `a` / router link | `href` — auto-routes internal (TanStack) / hash (smooth-scroll) / external·mailto·tel (auto `rel`) |
| `Image` | `img` | `src`, `alt`, `width`/`height`, `objectFit`, `priority` (`"lazy"`), `quality` (`75`), `fallback` — lazy + skeleton + srcset |
| `ThemeToggle` | shadcn `Button` | none |

Interactive controls (buttons, inputs, dialogs) → shadcn/ui, not raw elements. The bare-element ban is a documented convention (the `.eslintrc` `react/forbid-elements` rule is not wired into the ESLint 9 flat config). Full mapping + example: `.claude/output-styles/custom-components.md`.

## Working rules

- **Logging**: after creating/changing any feature/section/component, write a log to `logs/feature-changes/YYYY-MM-DD-<slug>.md` (template in that folder) and commit it with the change. See `.agents/rules/logging.md`.
- **Agent memory**: `.claude/agent-memory/<agent>/MEMORY.md` holds durable project knowledge (conventions, decisions, reusable patterns). Read before building; update after changes that introduce/revise a pattern. See `.agents/rules/memory-context.md`.
- **Commits**: Conventional Commits (`type(scope): summary`) per `.agents/rules/commit-rules.md`; one logical unit per commit; `tsc` + `eslint` green before committing.
- Full rule set: `.agents/rules/*` (accessibility-performance, code-quality, content-integrity, motion-safety, workflow-discipline).
