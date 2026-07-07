# System Architecture & Best Practices Brief: Muhammad Sufyan Portfolio (Redesign)

**Target Audience:** Frontend Developer, Frontend AI Agents
**Architecture Type:** Static SPA (client-rendered, no backend of its own)
**Pattern:** Feature-Based Architecture (Bulletproof React inspired) + dedicated Motion Layer
**Base:** a fresh Vite React-TS app, organized to match `react-tanstack-typescript-boilerplate` conventions (React 19 · Vite 7 · TanStack Router · Tailwind v4 · shadcn/ui · TS strict)

> **As-built status (2026-07-07):** the architecture below is implemented and verified through chapter 04 — `lib/gsap.ts`, `SmoothScrollProvider`, `useUIStore`, `types/{portfolio,motion}.ts`, the seven motion primitives, the full data layer, and `features/home/sections/{Hero,Manifesto,Craft,Journey}Section.tsx` all exist at the paths specified in §3 (with tokens in `src/styles/globals.css`). Still pending: `WorkSection`, `ContactSection`, `lib/emailjs.ts`. This note tracks reality; the spec itself is unchanged.

## 1. Communication Concept (No Backend, One Integration)

Unlike a typical app, this is a **content-static portfolio**. There is no API to author; all content lives in typed constants transcribed from `.agents/context/product_requirements.md`. The only outbound integration is the **contact form via EmailJS** (client-side SDK).

```
Visitor  →  React SPA (static, hosted on Vercel/Netlify)
                      │
                      └── Contact form → EmailJS (client SDK) → email inbox
```

Consequences for the boilerplate:

- **TanStack Query is OPTIONAL / mostly unused** — there is no server state to cache. Keep the dependency only if a future dynamic feature (e.g. a blog fetched from an API) is planned; otherwise omit it.
- **No auth, no route guards, no `middlewares/`** — remove the boilerplate's `auth`, `dashboard`, and `middlewares` entirely.
- **Zustand is used minimally** — only for cross-tree UI state that isn't derivable from the DOM (e.g. preloader-complete flag, menu open, theme). Not for content.
- The heavy lifting is the **Motion Layer** (GSAP + Lenis), which the base boilerplate does not include and which this document specifies.

## 2. The Golden Rules

This app separates foundation/global code from feature (chapter) code, and isolates all animation orchestration.

> 🚨 **RULE 1 (Feature isolation):** A feature in `src/features/` **MUST NOT** import from another feature. Promote shared code up: shared types → `src/types/`, shared UI → `src/components/common/`, shared hooks/utils → `src/hooks/` or `src/lib/`.

> 🚨 **RULE 2 (Motion centralization):** GSAP is imported and configured in **exactly one place** — `src/lib/gsap.ts` (registers `ScrollTrigger`, sets defaults, exports `gsap`). No component imports `gsap/ScrollTrigger` directly. All scroll animations run inside `useGSAP(..., { scope })` from `@gsap/react` for automatic cleanup.

> 🚨 **RULE 3 (One smooth-scroll owner):** Lenis is instantiated **once**, in `SmoothScrollProvider`. It is synced to `gsap.ticker`; nothing else may create a Lenis instance or its own RAF loop.

## 3. Directory Structure

Derived from the boilerplate, simplified for a portfolio and extended with a motion layer.

```text
src/
├── assets/
│   ├── fonts/                # General Sans / Satoshi self-hosted (@font-face)
│   └── images/               # project media re-exported to .avif/.webp
│
├── components/               # 🧩 GLOBAL UI
│   ├── common/               # Motion primitives + shared UI (bespoke)
│   │   ├── Cursor.tsx         # custom cursor (dot + magnetic ring, label)
│   │   ├── Preloader.tsx      # counter + name reveal + curtain wipe
│   │   ├── PageTransition.tsx # route-change overlay (if multi-page)
│   │   ├── RevealText.tsx     # split-type + GSAP line/char reveal
│   │   ├── ParallaxImage.tsx  # clip-path reveal + parallax scrub
│   │   ├── Marquee.tsx        # infinite hover-pause marquee
│   │   ├── MagneticButton.tsx # pointer-follow magnetic wrapper
│   │   └── ChapterEyebrow.tsx # "01 — LABEL" structural marker
│   ├── layouts/              # RootLayout, Header, Footer, MobileMenu
│   └── ui/                   # shadcn re-exports actually used (Dialog, Tooltip, form bits)
│
├── config/                   # ⚙️ GLOBAL SETTINGS
│   ├── env.ts                # EmailJS keys (VITE_ env), site URL
│   └── site.ts               # SEO metadata, social links, nav config
│
├── constants/                # 🔒 IMMUTABLE APP-WIDE VALUES
│   └── navigation.ts         # chapter anchors / nav link list
│
├── hooks/                    # 🪝 GLOBAL HOOKS
│   ├── useLenis.ts           # access the shared Lenis instance (context)
│   ├── usePrefersReducedMotion.ts
│   └── useIsomorphicLayoutEffect.ts
│
├── lib/                      # 🛠️ THIRD-PARTY SETUP + PURE UTILS
│   ├── gsap.ts               # register ScrollTrigger + defaults; SINGLE gsap source
│   ├── emailjs.ts            # EmailJS send wrapper (from old repo config)
│   └── utils.ts              # cn() (tailwind-merge + clsx)
│
├── providers/                # 📦 PROVIDERS
│   ├── SmoothScrollProvider.tsx  # Lenis ↔ gsap.ticker ↔ ScrollTrigger.update/refresh
│   ├── ThemeProvider.tsx     # optional — omit if dark-only
│   └── AppProviders.tsx      # composes all providers in correct order
│
├── store/                    # 🧠 MINIMAL CLIENT STATE (Zustand)
│   └── useUIStore.ts         # preloaderDone, menuOpen, theme
│
├── styles/
│   └── globals.css           # Tailwind v4 @import + @theme tokens (see design_system §9)
│
├── types/                    # 🌐 GLOBAL TYPES
│   ├── portfolio.ts          # Project, TechStack, Skill, JourneyItem, Profile
│   └── motion.ts             # RevealMode, ParallaxConfig, etc.
│
├── features/                 # 📦 CHAPTERS — strict isolation
│   └── home/
│       ├── pages/
│       │   └── HomePage.tsx       # composes the chapter sections in order
│       ├── sections/
│       │   ├── HeroSection.tsx        # 01
│       │   ├── ManifestoSection.tsx   # 02
│       │   ├── CraftSection.tsx       # 03
│       │   ├── JourneySection.tsx     # 04
│       │   ├── WorkSection.tsx        # 05
│       │   └── ContactSection.tsx     # 06
│       ├── components/            # section-local pieces (WorkCard, JourneyItem, PillarBlock)
│       ├── constants/            # 👈 PORT OLD DATA HERE (profile, skills, projects, journey)
│       └── types/                # section-local types (if any)
│   # └── work/                   # OPTIONAL (multi-page): project detail feature
│   #     ├── pages/WorkDetailPage.tsx
│   #     └── constants/          # (reuse home/constants project data)
│
├── routes/                   # 📍 TANSTACK ROUTER (file-based, autoCodeSplitting)
│   ├── __root.tsx            # AppProviders + <Cursor/> + <Preloader/> + ScrollTrigger.refresh on nav
│   ├── index.tsx             # '/' → HomePage
│   └── work.$slug.tsx        # OPTIONAL → WorkDetailPage
│
└── main.tsx                  # React 19 entry — RouterProvider inside AppProviders
```

## 4. Frontend Best Practices (Strict Guidelines for AI & Developers)

### 4.1 Typing Strategy

- **Global content types** (`Project`, `Skill`, `JourneyItem`, `Profile`, `TechStack`) live in `src/types/portfolio.ts` — they are referenced by multiple sections.
- **Section-local types** (props, local view models) stay in the section's own folder.
- **No `any`.** TS strict mode on. Data constants are typed against the global models so a bad edit fails compilation.

  ```ts
  // src/types/portfolio.ts
  export interface TechStack { tech: string; logo: string }
  export interface Project {
    slug: string;
    title: string;
    thumbnail: string;
    description: string;
    livePreviewURL?: string;
    repositoryURL?: string;
    techStack: TechStack[];
    year?: string;
    featured?: boolean;
  }
  ```

### 4.2 Routing

- **TanStack Router, file-based**, `autoCodeSplitting: true` (already in the boilerplate's `vite.config.ts`). Type-safe navigation via generated `routeTree.gen.ts` (never hand-edit).
- **Default = single-page.** The narrative lives on `/`; nav links are smooth-scroll anchors (Lenis `scrollTo`). Provide `work.$slug.tsx` only if multi-page is chosen at planning approval.
- **No `beforeLoad` guards** — nothing to protect. If multi-page, `work.$slug` may use a `loader` only to resolve the project from constants (synchronous) and `notFound()` on a bad slug.
- **On route change** (multi-page only): run a `PageTransition` overlay and call `ScrollTrigger.refresh()` + `window.scrollTo(0,0)` (via Lenis) after the new route mounts.

### 4.3 Motion Layer (the core subsystem)

- **Single GSAP source** — `src/lib/gsap.ts`. Register `ScrollTrigger` once; export configured `gsap`. (See design_system §9.1.)
- **Single Lenis owner** — `SmoothScrollProvider`:

  ```tsx
  // src/providers/SmoothScrollProvider.tsx (conceptual)
  import Lenis from "lenis";
  import { gsap, ScrollTrigger } from "@/lib/gsap";

  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // provide `lenis` via context; destroy on unmount
  ```

- **All animations use `useGSAP`** (`@gsap/react`) with a `scope` ref so timelines/ScrollTriggers are reverted automatically on unmount:

  ```tsx
  useGSAP(() => {
    gsap.from(".reveal-line", { yPercent: 100, stagger: 0.08,
      scrollTrigger: { trigger: ref.current, start: "top 80%" } });
  }, { scope: ref, dependencies: [reducedMotion] });
  ```

- **`invalidateOnRefresh: true`** on pinned/scrubbed triggers so line splits and pin distances recompute on resize.
- **Reduced motion:** read `usePrefersReducedMotion()`; when true, skip the animated branch and render final state (opacity 1). Disable Lenis (fall back to native scroll) and hide the custom cursor.

### 4.4 State & Data

- **No server state** (no TanStack Query) unless a dynamic feature is added later.
- **Client state via Zustand** — only `preloaderDone`, `menuOpen`, `theme`. Nothing content-related.
- **Content via typed constants** in `features/home/constants/` (transcribed 1:1 from `context/product_requirements.md`, typed against `src/types/portfolio.ts`). Curate the `Selected Work` subset here with a `featured` flag.
- **Contact form:** `react-hook-form` (already available) + minimal validation; submit via `lib/emailjs.ts`. No page reload; show success/error inline using the functional color tokens.

### 4.5 Styling

- **Tailwind v4 only** — tokens via `@theme` in `src/styles/globals.css` (no `tailwind.config.ts`). See design_system §9.
- **`cn()`** (`tailwind-merge` + `clsx`) for all conditional classes to prevent collisions; **`cva`** for component variants (e.g. `WorkCard` featured vs default).
- **shadcn/ui** used only for `Dialog` (work lightbox), `Tooltip`, and contact form controls — always restyled via `className` with our tokens (see design_system §9.2).

## 5. Provider Stack (Application Bootstrap)

Order in `AppProviders` / `main.tsx` (outer → inner):

```tsx
<React.StrictMode>
  <ThemeProvider>            {/* optional; omit if dark-only */}
    <SmoothScrollProvider>   {/* Lenis + GSAP ticker sync */}
      <RouterProvider router={router} />   {/* innermost — owns the tree */}
    </SmoothScrollProvider>
  </ThemeProvider>
</React.StrictMode>
```

- `<Cursor/>` and `<Preloader/>` are rendered inside `__root.tsx` (above `<Outlet/>`), so they persist across routes.
- Zustand stores need no provider — accessed via hooks.
- If TanStack Query is kept, wrap `QueryClientProvider` just outside `RouterProvider`.

## 6. Fonts & Assets Pipeline

- **Fraunces** (`@fontsource-variable/fraunces`) + **JetBrains Mono** (`@fontsource/jetbrains-mono`): import in `main.tsx` / `globals.css`. Preload the display face.
- **General Sans / Satoshi**: download from Fontshare → `src/assets/fonts/`, declare via `@font-face` with `font-display: swap`.
- **Project media**: re-export old `.webp`/`.png` thumbnails to `.avif` (with `.webp` fallback), set explicit `width/height`, lazy-load below the fold.

## 7. Dependencies Delta (vs boilerplate)

```bash
# Add
npm i gsap @gsap/react lenis split-type
npm i @fontsource-variable/fraunces @fontsource/jetbrains-mono
npm i @emailjs/browser

# Remove / ignore for this project
#  - auth, dashboard, middlewares folders
#  - (optional) @tanstack/react-query, @tanstack/react-table if no dynamic data
```

## 8. Definition of Done Checklist (per chapter / global)

Before a chapter is "done":

- [ ] No cross-feature imports (`grep "from '@/features/<other>'"` returns nothing).
- [ ] All content pulled from typed constants — no hardcoded facts inside JSX; types compile under strict mode.
- [ ] All motion runs through `useGSAP` with a `scope`; no stray `gsap`/`ScrollTrigger` imports outside `lib/gsap.ts`.
- [ ] A working `prefers-reduced-motion` branch exists (opacity-only, Lenis disabled, cursor hidden).
- [ ] Lenis ↔ ScrollTrigger stays in sync on resize + (if multi-page) route change (`ScrollTrigger.refresh()` called).
- [ ] `cn()` used for conditional classes; `cva` for variants; shadcn restyled via tokens.
- [ ] Keyboard-navigable, visible focus (brass ring), semantic landmarks + alt text.
- [ ] Media optimized (`.avif`/`.webp`, explicit dimensions, lazy below fold).
- [ ] `tsc` + `eslint` clean; Lighthouse ≥ 90 (Perf / A11y / Best Practices / SEO).
- [ ] Meta / OG tags + `theme-color` set (via `config/site.ts` + route `head`).
