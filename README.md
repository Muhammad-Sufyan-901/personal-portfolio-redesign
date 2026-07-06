# Portfolio Redesign — Muhammad Sufyan

A motion-first, scroll-telling single-page portfolio. One continuous page, told in chapters — `00 Preloader · 01 Hero · 02 Manifesto · 03 Craft · 04 Journey · 05 Selected Work · 06 Contact · Footer` — with GSAP/Lenis-driven choreography (reference feel: [lukebaffait.fr](https://lukebaffait.fr) — motion and polish only, not its color or content).

**Status:** the repo is currently a cleaned minimal shell (`/` → placeholder `HomePage`). The redesign is fully specified in [`.agents/context/`](.agents/context/) and gets built chapter by chapter through the agent workflow described in [AGENTS.md](AGENTS.md).

## Stack

- **React 19** + **TypeScript (strict)** on **Vite 7**
- **TanStack Router** — file-based routing
- **Tailwind CSS v4** (`@theme` tokens, no config file) + **shadcn/ui** primitives
- Motion layer (installed during the redesign bootstrap): **GSAP** + ScrollTrigger · **Lenis** smooth scroll · **split-type** · `@gsap/react`
- Contact form via **EmailJS** (no backend)

## Getting started

```bash
npm install
npm run dev        # Vite dev server
```

Other scripts:

```bash
npm run build      # typecheck (tsc -b) + production build
npm run lint       # ESLint (flat config)
npm run preview    # preview a production build
npx tsc --noEmit   # typecheck only
```

There is no test framework configured.

## Environment

Create a `.env` in the root (used by the contact form once built):

```bash
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

## Project structure

```text
src/
├── components/
│   ├── common/        # Box, Container, Text, Heading, Link, Image, ThemeToggle —
│   │                  # polymorphic primitives that replace raw HTML tags in feature code
│   ├── layouts/       # RootLayout
│   └── ui/            # shadcn/ui generated primitives (button, tooltip)
├── constants/         # app-wide constants (images)
├── features/
│   └── home/          # the portfolio page: pages/, components/, data/, types/
├── hooks/             # useTheme
├── lib/               # utils.ts (cn) — gsap.ts joins here at motion bootstrap
├── providers/         # theme-provider — SmoothScrollProvider joins here at motion bootstrap
├── routes/            # TanStack Router registry files only (no JSX)
├── routeTree.gen.ts   # auto-generated — do not edit
├── index.css          # Tailwind v4 entry + design tokens
└── main.tsx
```

Supporting folders:

- **`.agents/`** — portable agent spec: [product requirements](.agents/context/product_requirements.md) (the *only* content source), [design system](.agents/context/design_system.md), [system architecture](.agents/context/system_architecture.md), plus roles, rules, skills, and workflows.
- **`.claude/`** — Claude Code native config: subagents, skills/commands, rules, hooks, agent memory.
- **`logs/feature-changes/`** — committed per-change history logs.

Deep specs live in `.agents/context/*`; the agent roster and build workflow are summarized in [AGENTS.md](AGENTS.md).
