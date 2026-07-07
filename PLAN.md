# PLAN — Portfolio Redesign (approved)

> Approved at planning review. Stage B executes this plan section by section.
>
> **Palette supersession note (2026-07-07):** this plan was approved under the v1 palette (accent then resolved to cobalt at bootstrap). `design_system.md` v2 has since made **ember `#E8380F`** the authoritative accent (measured from the reference video, §3.0/§3.2); "brass/accent" wording below reads as *the accent token*. Remaining scope (chapters 05–06, ember re-theme, v2 motion upgrades) is re-planned at the next `/plan-redesign`.

## Context

Rebuild Muhammad Sufyan's portfolio as an elegant, motion-first, scroll-telling single page (7 chapters + footer) on the existing minimal Vite/React 19/TanStack Router/Tailwind v4 shell. Content comes only from `.agents/context/product_requirements.md`; look/motion from `design_system.md`; structure from `system_architecture.md`. Quality bar: `lukebaffait.fr` (motion/class only).

**Note:** `reference/lukebaffait-scroll.mp4` exists but `ffmpeg` is not installed, so frames were not extracted. The design system §7/§11 fully specifies per-chapter choreography, so the plan proceeds from the docs. Optional at Stage B start: `brew install ffmpeg` → extract frames for visual calibration.

## 1. Final file/component tree

Reconciliation of `system_architecture.md §3` with the existing `src/`:

- **Keep `features/home/data/`** (already exists; role prompt specifies `data/*.data.ts`) instead of the architecture doc's `constants/` — same role, no rename churn.
- **Move `src/index.css` → `src/styles/globals.css`** (per spec), update the import in `main.tsx`, replace shadcn oklch palette with the warm-ink `@theme` tokens.
- **Existing primitives stay** (`Box`, `Container`, `Text`, `Heading`, `Link`, `Image`); motion primitives join them in `components/common/`.
- **Light toggle kept (decision 2):** `ThemeProvider`, `ThemeToggle`, `useTheme` stay. Light tokens keyed off the **existing `.light` class mechanism** (not the doc's `[data-theme=light]` attribute — reuse what's already wired): ink→`#F4F1EA`, paper→`#1A1A1F`, accent→deep cobalt `#2E48D6`.
- **Multi-page kept (decision 3):** adds `routes/work.$slug.tsx`, `features/work/` (WorkDetailPage; since both `home` and `work` need project data and features can't import each other, `projects.data.ts` is **promoted to `src/constants/`**), `components/common/PageTransition.tsx`, and `ScrollTrigger.refresh()` + Lenis `scrollTo(0)` on route change. Route `loader` resolves the project synchronously from data, `notFound()` on bad slug. No Dialog lightbox needed.

```text
src/
├── assets/
│   ├── fonts/                    # NEW — General Sans (Fontshare, @font-face)
│   └── images/                   # NEW — project thumbnails (.avif/.webp)
├── components/
│   ├── common/                   # existing primitives + NEW motion primitives:
│   │   ├── Cursor.tsx, Preloader.tsx, RevealText.tsx, ParallaxImage.tsx,
│   │   ├── Marquee.tsx, MagneticButton.tsx, ChapterEyebrow.tsx
│   │   └── (Box, Container, Text, Heading, Link, Image — unchanged)
│   ├── layouts/                  # RootLayout (existing) + NEW Header, Footer, MobileMenu
│   └── ui/                       # button, tooltip (existing) + dialog (added at 05 Work)
├── config/                       # NEW — env.ts (EmailJS keys), site.ts (SEO/OG, socials, nav)
├── constants/                    # existing — + navigation.ts (chapter anchors)
├── hooks/                        # NEW — useLenis, usePrefersReducedMotion, useIsomorphicLayoutEffect
├── lib/                          # utils.ts (existing) + NEW gsap.ts, emailjs.ts
├── providers/                    # NEW — SmoothScrollProvider.tsx, AppProviders.tsx
├── store/                        # NEW — useUIStore.ts (Zustand: preloaderDone, menuOpen)
├── styles/globals.css            # NEW location — Tailwind v4 @theme tokens (design_system §9)
├── types/                        # NEW — portfolio.ts, motion.ts
├── features/home/
│   ├── pages/HomePage.tsx        # composes sections in order
│   ├── sections/                 # NEW — HeroSection, ManifestoSection, CraftSection,
│   │                             #       JourneySection, WorkSection, ContactSection
│   ├── components/               # WorkCard, JourneyItem, PillarBlock
│   ├── data/                     # profile/skills/journey/contact *.data.ts
│   └── types/                    # section-local types if any
├── features/work/                # NEW — pages/WorkDetailPage.tsx (project detail)
├── routes/                       # __root.tsx (+ Cursor, Preloader, PageTransition),
│                                 # index.tsx, work.$slug.tsx
└── main.tsx                      # AppProviders → RouterProvider
```

Golden rules enforced throughout: no cross-feature imports; GSAP only via `lib/gsap.ts`; Lenis only in `SmoothScrollProvider`; every animation in `useGSAP({ scope })` with a reduced-motion fallback; custom primitives + tokens only.

## 2. Build order & motion technique per chapter

Bootstrap first (deps → tokens/fonts → motion foundation → typed data), then **one section at a time**, full cycle each (build → QA → log → memory → commit):

| # | Chapter | GSAP/Lenis technique (design_system §7 & §11) |
|---|---------|-----------------------------------------------|
| 00 | **Preloader** | Mono counter 0→100 + name mask-reveal; curtain wipe up (`--ease-inout`, `--dur-slow`); once per session (Zustand + `sessionStorage`); unmount → hero timeline |
| 01 | **Hero** | split-type **char reveal** on the name (stagger 0.02–0.03s, plays after preloader); tagline + Mono role line; subtle mouse-parallax (~10px max); accent (ember) scroll-cue bob |
| 02 | **Manifesto** | ScrollTrigger **pin + scrub**; bio words fill `--color-faint` → `--color-paper` (opacity 0.15→1) across the pin range; one focal word accent-tinted (`--color-accent-tint`) |
| 03 | **Craft** | **Line reveals** (split-type lines in `overflow-hidden`, `yPercent 100→0`, stagger 0.08s) on the Web/Mobile pillar blocks; keyword **Marquee** (hover-pause, `aria-hidden` dupe) |
| 04 | **Journey** | Timeline **rail draw** (`scaleY 0→1`, scrub) + per-entry reveal on enter; merged Experience + Education + **Awards**, most recent first |
| 05 | **Selected Work** | **Clip-path reveal** (`inset(100% 0 0 0)→inset(0)`, `--dur-slow`) + **parallax scrub** (`yPercent -8→8`) on media; hover scale 1.03 + cursor label "View"; cards link to `/work/$slug` through `PageTransition`; optional pinned horizontal feature row (desktop only) |
| 06 | **Contact** | Line reveal on the oversized "Let's build something." + **MagneticButton** CTA; react-hook-form → `lib/emailjs.ts`; underlined inputs, accent (ember) focus underline; success/error in functional tokens |
| — | **Footer** | Giant name **Marquee** (Fraunces display, slow, muted); Mono copyright/built-with; magnetic back-to-top |

`/work/$slug` (WorkDetailPage + PageTransition) is built **inside chapter 05's cycle** — the section and its destination ship together.

Reduced-motion path for every chapter: opacity-only reveal, no pins/scrubs/parallax/marquee, Lenis off (native scroll), cursor hidden.

## 3. Dependency delta

```bash
npm i gsap @gsap/react lenis split-type zustand react-hook-form @emailjs/browser \
      @fontsource-variable/fraunces @fontsource/jetbrains-mono
```

- **General Sans**: download from Fontshare → `src/assets/fonts/` + `@font-face` (`font-display: swap`); preload Fraunces (display face).
- **Tailwind is already v4** — no migration needed; only token replacement in `@theme`.
- No shadcn `Dialog` needed (multi-page detail route replaces the lightbox); `button`/`tooltip` already present, form controls stay native/underlined.
- No TanStack Query, no axios, no new HTTP layer. Nothing removed (cleanup already done in `9be4947`).
- `.env`: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` (gitignored; user supplies values).

## 4. PRD → typed-data mapping

Types in `src/types/portfolio.ts` (`Profile`, `Skill`, `TechStack`, `JourneyItem`, `Project`) + `src/types/motion.ts` (`RevealMode`, `ParallaxConfig`).

| PRD section | Data file | Type |
|---|---|---|
| §2 persona, bio, headline stats, CV link | `features/home/data/profile.data.ts` | `Profile` |
| §3.1 skills (21 items + favored stacks) | `features/home/data/skills.data.ts` | `Skill[]` + pillar groupings |
| §3.2 tools (6 items) | `features/home/data/skills.data.ts` (tools list) | `string[]` |
| §3.3 work ×4 + §3.4 education ×2 + §3.5 awards ×3 | `features/home/data/journey.data.ts` | `JourneyItem[]` (`kind: "work" \| "education" \| "award"`) |
| §3.6 projects ×6 (+ live/repo links verbatim) | `src/constants/projects.data.ts` (shared by `home` + `work` features) | `Project[]` (`featured` flag on the 5 chosen) |
| §3.7 WhatsApp / Gmail / Telegram | `features/home/data/contact.data.ts` | contact channels |
| §3.8 nav anchors → chapters | `src/constants/navigation.ts` + `config/site.ts` | nav config |

All facts transcribed verbatim — never invented; unknown fields omitted. Manifesto microcopy may re-voice the §2 bio (facts fixed).

## 5. Open decisions (PRD §6) — RESOLVED by the user

1. **Accent: Cobalt `#3B5BFF`** (deep `#2E48D6`; tint `rgba(59,91,255,0.12)`; focus ring cobalt). Everything else identical per design_system §3.2's documented alternate.
2. **Theme: light toggle kept.** Dark is default identity; `.light` class flips ink→`#F4F1EA`, paper→`#1A1A1F`, accent→`#2E48D6`.
3. **Routing: multi-page** — `/` narrative + `/work/$slug` detail pages with `PageTransition` + `ScrollTrigger.refresh()` on navigation.
4. **Featured (5):** KHASS E-Ticketing, Phantom, Petabyte, HooBank, KNA. ("My Personal Portfolio" excluded from featured but kept in the data.)
5. **Blog: no** (PRD default).

## 6. Verification

- Per section: `/qa-audit <section>` — `npx tsc --noEmit` + `npm run lint` clean; reduced-motion branch works (emulate via DevTools); keyboard/focus/landmarks/alt; no bare tags, no raw hex, no cross-feature imports. Then `/log-change` → `/update-memory` → commit.
- Visual: `npm run dev` + Chrome DevTools MCP — scroll each chapter, screenshot, check choreography against design_system §11.
- Final: `/qa-audit all` — Lighthouse ≥ 90 (Perf/A11y/Best/SEO) on a production preview (`npm run build && npm run preview`), SEO meta/OG/theme-color, EmailJS form send.
