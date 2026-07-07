# Portfolio Redesign — Muhammad Sufyan

A motion-first, scroll-telling single-page portfolio for **Muhammad Sufyan**, a software engineer (Indonesia) working across web and mobile. The site is told as one continuous, chaptered narrative with GSAP/Lenis-driven choreography — reference feel: [lukebaffait.fr](https://lukebaffait.fr) (motion and polish only, not its content).

> **Status:** the foundation and chapters **00–04 are built** — preloader, hero, manifesto, craft, and journey ship with the full motion stack (GSAP + Lenis + split-type), applied design tokens, and the PRD data layer. Remaining: **05 Selected Work**, **06 Contact** (+ `src/lib/emailjs.ts`), the footer, and the **"Void & Ember" re-theme** (the spec's v2 palette; the shipped tokens are the interim cobalt set). The redesign is fully specified in [`.agents/context/`](.agents/context/) and built chapter by chapter — one approval gate per section — through the agent workflow in [AGENTS.md](AGENTS.md).

## Stack

| Tool | Role |
| --- | --- |
| **React 19** + **TypeScript (strict)** | UI, no `any`, functional components |
| **Vite 7** | dev server + build |
| **TanStack Router** | file-based routing, registry-only route files, auto code-splitting |
| **Tailwind CSS v4** | styling — CSS-first (`@theme` tokens in `src/styles/globals.css`, no `tailwind.config`) |
| **shadcn/ui** | primitives (new-york style, neutral base, lucide icons) — currently `button`, `tooltip` |
| **GSAP** + ScrollTrigger (`@gsap/react`) | scroll-driven animation, single source in `src/lib/gsap.ts` |
| **Lenis** | smooth scroll, one owner in `src/providers/SmoothScrollProvider.tsx` (lerp 0.09) |
| **split-type** | per-character / per-line text reveals |
| **zustand** | minimal UI store (`preloaderDone`, `menuOpen`) |
| **EmailJS** (`@emailjs/browser`) + react-hook-form | contact form submission, no backend (wired at chapter 06) |
| Fraunces · General Sans · JetBrains Mono | self-hosted display / body / mono fonts |
| `clsx` · `tailwind-merge` · `cva` | class merging (`cn()`) + variants |

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

The page reads as a single vertical narrative, built one chapter at a time (each behind its own approval gate):

| # | Chapter | Content | Status |
| --- | --- | --- | --- |
| 00 | **Preloader** | counter 0→100 + name mask reveal + curtain wipe, once per session | ✅ built |
| 01 | **Hero** | name char-reveal, role line ("Software Engineer · Web & Mobile"), site chrome | ✅ built |
| 02 | **Manifesto** | the "about" statement, pinned scroll-fill text with an accent focal word | ✅ built |
| 03 | **Craft** | two editorial pillars (web / mobile) + full-bleed skills marquee | ✅ built |
| 04 | **Journey** | one timeline merging work experience, education, and awards (9 items) | ✅ built |
| 05 | **Selected Work** | 4–6 featured projects, parallax cards | ⏳ next |
| 06 | **Contact** | magnetic CTA + EmailJS form (WhatsApp · Gmail · Telegram) | ⏳ pending |
| — | **Footer** | name marquee, rhythm recap | ⏳ pending |

## Design language

- **Palette — "Void & Ember" (spec target, `design_system.md` v2)**: neutral near-black `#0A0A0A` background, neutral paper `#E4E4E4` text, one vivid **ember accent `#E8380F`** used surgically — evidence-sampled from the reference site. The shipped `src/styles/globals.css` still carries the interim Warm Ink + Cobalt (`#3B5BFF`) tokens; the re-theme is a token-values-only change because components style by token *name*, never raw hex. Brass `#C8A46A` and cobalt remain documented alternates.
- **Typography** — **Fraunces** (display: name, chapter titles) · **General Sans** (body, UI) · **JetBrains Mono** (chapter numbers, eyebrows, labels) — all bundled/self-hosted, live today.
- **Motion** — GSAP + ScrollTrigger on a Lenis canvas; every effect has a `prefers-reduced-motion` fallback (opacity-only, Lenis off, cursor hidden).

Full palette, type scale, tokens, per-chapter choreography, and the vetted reference component libraries (§7.5): [`.agents/context/design_system.md`](.agents/context/design_system.md).

## Component primitives

Feature, page, and section code never emits raw HTML wrappers — it uses the polymorphic primitives from `@/components/common`:

| Raw element | Use instead |
| --- | --- |
| `div`, `section`, `article`, `header`, `footer`, `nav`, `ul`, `li` | `<Box as="section">` |
| centered max-width wrapper | `<Container maxWidth="7xl">` |
| `p`, `span` | `<Text as="p" variant="default">` |
| `h1`–`h6` | `<Heading level={2}>` |
| `a` / router link | `<Link href="/x">` (internal · hash smooth-scroll via Lenis · external/mailto/tel) |
| `img` | `<Image src alt width height />` (lazy + skeleton + fallback) |

The same barrel ships the **motion primitives** — `RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `ChapterEyebrow`, `Cursor`, `Preloader` — all GSAP-scoped with reduced-motion fallbacks built in.

```tsx
import { Box, Heading, Text } from "@/components/common";

<Box as="section" className="py-24">
  <Heading level={2} variant="display">Selected Work</Heading>
  <Text as="p" variant="lead">A few things I've built.</Text>
</Box>
```

Interactive controls (buttons, inputs, dialogs) use shadcn/ui, not raw elements. Full mapping, real prop surfaces, and gotchas: [`.claude/output-styles/custom-components.md`](.claude/output-styles/custom-components.md) and [`.claude/rules/custom-components.md`](.claude/rules/custom-components.md).

## Project structure

```text
src/
├── assets/fonts/      # self-hosted General Sans variable woff2
├── components/
│   ├── common/        # Box, Container, Text, Heading, Link, Image, ThemeToggle +
│   │                  # motion primitives (RevealText, ParallaxImage, Marquee,
│   │                  # MagneticButton, ChapterEyebrow, Cursor, Preloader)
│   ├── layouts/       # Header (z-60), MobileMenu (z-80), RootLayout
│   └── ui/            # shadcn/ui generated primitives (button, tooltip)
├── config/            # site.ts (SEO/meta), env.ts (EmailJS keys)
├── constants/         # projects.data.ts, navigation.ts, images.ts
├── features/
│   └── home/          # the portfolio page — pages/HomePage.tsx,
│                      # sections/{Hero,Manifesto,Craft,Journey}Section.tsx,
│                      # components/{JourneyEntry,PillarBlock}.tsx,
│                      # data/{profile,skills,journey,contact}.data.ts
├── hooks/             # useTheme, useLenis, usePrefersReducedMotion, useIsomorphicLayoutEffect
├── lib/               # gsap.ts (single GSAP source), utils.ts (cn) — emailjs.ts joins at ch. 06
├── providers/         # AppProviders, SmoothScrollProvider (single Lenis), theme-provider
├── routes/            # TanStack Router registry files only (no JSX): __root.tsx, index.tsx
├── routeTree.gen.ts   # auto-generated by the router plugin — do not edit
├── store/             # useUIStore.ts (zustand: preloaderDone, menuOpen)
├── styles/globals.css # Tailwind v4 entry + @theme design tokens (fonts, colors, type scale, motion)
├── types/             # portfolio.ts (content contract), motion.ts
└── main.tsx           # entry: StrictMode → AppProviders → RouterProvider
```

## Docs & workflow

- **[CLAUDE.md](CLAUDE.md)** / **[GEMINI.md](GEMINI.md)** — project context, conventions, and architecture for Claude Code / Gemini CLI.
- **[AGENTS.md](AGENTS.md)** — the agent roster (@pm · @frontend · @motion · @qa), the plan → approve → build-per-section → QA workflow, and the full skills/commands/MCP inventory (post-reconciliation: 9 invokable `.claude/skills/` + 18 portable `.agents/skills/`, including `animated-ui-references`).
- **[`.agents/context/`](.agents/context/)** — the authoritative deep specs: [`product_requirements.md`](.agents/context/product_requirements.md) (the *only* content source — facts are transcribed, never invented), [`design_system.md`](.agents/context/design_system.md) (v2, "Void & Ember"), [`system_architecture.md`](.agents/context/system_architecture.md).
- **`logs/feature-changes/`** — committed per-change history (setup → each shipped chapter).
