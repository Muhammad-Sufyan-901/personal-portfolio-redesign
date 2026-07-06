# Portfolio Redesign — Muhammad Sufyan

A motion-first, scroll-telling single-page portfolio for **Muhammad Sufyan**, a software engineer (Indonesia) working across web and mobile. The site is told as one continuous, chaptered narrative with GSAP/Lenis-driven choreography — reference feel: [lukebaffait.fr](https://lukebaffait.fr) (motion and polish only, not its color or content).

> **Status:** the repo is currently a **cleaned minimal shell** — a single `/` route rendering a placeholder `HomePage`, the common-component primitives, a theme provider, and two shadcn primitives (button, tooltip). The redesign is fully specified in [`.agents/context/`](.agents/context/) and gets built chapter by chapter through the agent workflow in [AGENTS.md](AGENTS.md). The motion stack and the redesign design tokens are **not yet installed/applied** — they arrive at the bootstrap step.

## Stack

**Installed today**

| Tool | Role |
| --- | --- |
| **React 19** + **TypeScript (strict)** | UI, no `any`, functional components |
| **Vite 7** | dev server + build |
| **TanStack Router** | file-based routing, registry-only route files, auto code-splitting |
| **Tailwind CSS v4** | styling — CSS-first (`@import "tailwindcss"`, no `tailwind.config`) |
| **shadcn/ui** | primitives (new-york style, neutral base, lucide icons) |
| `clsx` · `tailwind-merge` · `cva` | class merging (`cn()`) + variants |

**Added during the redesign bootstrap** (not present yet)

| Tool | Role |
| --- | --- |
| **GSAP** + ScrollTrigger | scroll-driven animation, single source in `src/lib/gsap.ts` |
| **Lenis** | smooth scroll, one owner in `SmoothScrollProvider` |
| **split-type** | per-character / per-line text reveals |
| `@gsap/react` (`useGSAP`) | scoped, auto-cleaned animation hooks |
| **EmailJS** (`@emailjs/browser`) | contact form submission (no backend) |
| Fraunces · General Sans · JetBrains Mono | self-hosted display / body / mono fonts |

## Getting started

```bash
npm install
npm run dev        # start the Vite dev server
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | typecheck (`tsc -b`) then production build |
| `npm run lint` | ESLint (flat config, `eslint.config.js`) |
| `npm run preview` | preview a production build locally |
| `npx tsc --noEmit` | typecheck only, no build |

No test framework is configured — there are no tests and no test command.

## Environment

There is no backend. The contact form talks to **EmailJS** directly from the client. Create a `.env` in the project root (it is gitignored) with your EmailJS keys — used once the contact chapter is built:

```bash
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

## Chapters

The page reads as a single vertical narrative, built one chapter at a time:

| # | Chapter | Content |
| --- | --- | --- |
| 00 | **Preloader** | counter 0→100 + curtain wipe, once per session |
| 01 | **Hero** | name, role line ("Software Engineer · Web & Mobile"), headline stats |
| 02 | **Manifesto** | the "about" statement, scroll-fill text |
| 03 | **Craft** | skills + tools, two pillars (web / mobile) + marquee |
| 04 | **Journey** | timeline merging work experience, education, and awards |
| 05 | **Selected Work** | 4–6 featured projects, parallax cards |
| 06 | **Contact** | magnetic CTA + EmailJS form (WhatsApp · Gmail · Telegram) |
| — | **Footer** | name marquee, rhythm recap |

## Design language (target)

> These tokens describe the **redesign target** and are not yet applied — `src/index.css` currently holds the default shadcn oklch palette. They land when the design-system foundation is bootstrapped.

- **Palette** — warm ink `#0B0B0F` background, warm paper `#ECE8E1` text, a surgical brass accent `#C8A46A` (a cobalt alternate is an open decision).
- **Typography** — **Fraunces** (display: name, chapter titles) · **General Sans** (body, UI) · **JetBrains Mono** (chapter numbers, eyebrows, labels).
- **Motion** — GSAP + ScrollTrigger on a Lenis canvas; every effect has a `prefers-reduced-motion` fallback (opacity-only, Lenis off).

Full palette, type scale, tokens, and per-chapter choreography: [`.agents/context/design_system.md`](.agents/context/design_system.md).

## Component primitives

Feature, page, and section code never emits raw HTML wrappers — it uses the polymorphic primitives from `@/components/common`:

| Raw element | Use instead |
| --- | --- |
| `div`, `section`, `article`, `header`, `footer`, `nav`, `ul`, `li` | `<Box as="section">` |
| centered max-width wrapper | `<Container maxWidth="7xl">` |
| `p`, `span` | `<Text as="p" variant="default">` |
| `h1`–`h6` | `<Heading level={2}>` |
| `a` / router link | `<Link href="/x">` (internal · hash smooth-scroll · external/mailto/tel) |
| `img` | `<Image src alt width height />` (lazy + skeleton + fallback) |

```tsx
import { Box, Heading, Text } from "@/components/common";

<Box as="section" className="py-24">
  <Heading level={2} variant="display">Selected Work</Heading>
  <Text as="p" variant="lead">A few things I've built.</Text>
</Box>
```

Interactive controls (buttons, inputs, dialogs) use shadcn/ui, not raw elements. Full mapping and examples: [`.claude/output-styles/custom-components.md`](.claude/output-styles/custom-components.md).

## Project structure

```text
src/
├── components/
│   ├── common/        # Box, Container, Text, Heading, Link, Image, ThemeToggle —
│   │                  # polymorphic primitives that replace raw HTML tags (barrel: index.tsx)
│   ├── layouts/       # RootLayout (wraps the router Outlet + devtools)
│   └── ui/            # shadcn/ui generated primitives (button, tooltip)
├── constants/         # app-wide constants (images.ts)
├── features/
│   └── home/          # the portfolio page — pages/HomePage.tsx (placeholder),
│                      # components/ · data/ · types/ (empty, awaiting chapters)
├── hooks/             # useTheme
├── lib/               # utils.ts (cn) — gsap.ts joins here at motion bootstrap
├── providers/         # theme-provider — SmoothScrollProvider joins here at bootstrap
├── routes/            # TanStack Router registry files only (no JSX): __root.tsx, index.tsx
├── routeTree.gen.ts   # auto-generated by the router plugin — do not edit
├── index.css          # Tailwind v4 entry + (currently) default shadcn tokens
└── main.tsx           # entry: StrictMode → ThemeProvider → TooltipProvider → RouterProvider
```

**Added during the redesign bootstrap:** `lib/gsap.ts` · `providers/SmoothScrollProvider.tsx` · motion primitives in `components/common/` (Cursor, Preloader, RevealText, ParallaxImage, Marquee, MagneticButton) · `features/home/sections/*` (the chapters) · `features/home/constants/*` (PRD content) · `src/types/portfolio.ts` (content contract) · `lib/emailjs.ts`.

## Docs & workflow

- **[CLAUDE.md](CLAUDE.md)** / **[GEMINI.md](GEMINI.md)** — project context, conventions, and architecture for Claude Code / Gemini CLI.
- **[AGENTS.md](AGENTS.md)** — the agent roster (@pm · @frontend · @motion · @qa), the plan → approve → build → QA workflow, and the available skills/commands/MCP.
- **[`.agents/context/`](.agents/context/)** — the authoritative deep specs: [`product_requirements.md`](.agents/context/product_requirements.md) (the *only* content source — facts are transcribed, never invented), [`design_system.md`](.agents/context/design_system.md), [`system_architecture.md`](.agents/context/system_architecture.md).
- **`logs/feature-changes/`** — committed per-change history.
