---
paths:
  - "src/**/*.tsx"
---

# Custom component primitives (enforced everywhere, incl. subagents)

Output styles are not inherited by subagents, so this rule is the durable enforcement. In any `src/**/*.tsx` under `features/`, `pages/`, `sections/`, `layouts/`:

- Never emit a bare `div`, `p`, `span`, `h1`–`h6`, `a`, or `img`. Use `@/components/common`: `Box`/`Container` (polymorphic via `as`), `Text` (`as`, `variant`), `Heading` (`level`/`variant`), `Link` (`href`), `Image`. See `.claude/output-styles/custom-components.md` for the full mapping + example.
- Interactive controls → shadcn/ui from `@/components/ui`. Raw wrapper-less leaves (`svg`, `input`) only as a last resort.
- Honors the repo's `react/forbid-elements` convention (bare `<div>` is an error → `<Box>`).
- Exempt: `src/components/common/*` and `src/components/ui/*` (these define/own the raw elements).

## Real prop surface (from `src/components/common/*.tsx` — don't guess)

- **`Box`** — polymorphic: `as` (default `"div"`), `className`, spreads native props. No styling of its own.
- **`Container`** — `as` (default `"div"`), `maxWidth` `"sm"|"md"|"lg"|"xl"|"2xl"|"3xl"|"4xl"|"5xl"|"6xl"|"7xl"|"full"` (default `"7xl"`), `centerContent` (default `false`, adds `flex flex-col items-center`). Always applies `mx-auto px-4 sm:px-6 lg:px-8`.
- **`Text`** — `as` `"p"|"span"|"div"` (default `"p"`), `variant` `"default"|"lead"|"large"|"small"|"muted"` (default `"default"`).
- **`Heading`** — `level` `1–6` (default `1`) or `as` `"h1"…"h6"`, `variant` `"default"|"display"|"title"|"subtitle"|"section"` (default `"default"`; `display` = Fraunces `font-display text-display`).
- **`Link`** — `href` (required), `replace` (default `false`), `scroll` (default `true`), `target`, `rel`. Classifies the href itself: external/`mailto:`/`tel:` → raw `<a>` (external `_blank` auto-sets `rel="noopener noreferrer"`); hash `#id` → smooth-scroll via `lenis.scrollTo` + `history.pushState` (native `scrollIntoView` under reduced motion); internal → TanStack `<RouterLink>`.
- **`Image`** — `src`/`alt` required; `width`/`height`, `objectFit`, `priority` `"eager"|"lazy"` (default `"lazy"`), `quality` (default `75`), `placeholder` `"blur"|"empty"` (default `"empty"`), `blurDataURL`, `sizes`, `fallback` (defaults to an inline gray SVG). Builds a `srcset` (breakpoints 640→3840) only when `width` is set; skeleton = `bg-raised animate-pulse`.

## Motion primitives (also in `@/components/common` — reuse, don't hand-roll GSAP)

All import GSAP only from `@/lib/gsap` and ship a `prefers-reduced-motion` branch:

- **`RevealText`** — `mode` `"lines"|"words"|"chars"` (default `"lines"`), `as` `div|p|span|h1…h6` (default `"div"`), `delay` (default `0`), `stagger` (defaults: lines `0.08`, words `0.04`, chars `0.025`). split-type reveal on ScrollTrigger enter.
- **`ParallaxImage`** — `src`/`alt`, `aspect`, `parallax` (`from` default `-8`, `to` default `8`), `withScrim` (default `false`). Clip-inset reveal + scrub parallax; deliberately renders a raw `<img>` (exempt).
- **`Marquee`** — `speed` (default `30` s/loop), `reverse` (default `false`), `pauseOnHover` (default `true`). Duplicate track is `aria-hidden`.
- **`MagneticButton`** — `strength` (default `12` px max translate); inner `.magnetic-label` counter-moves ×−0.35.
- **`ChapterEyebrow`** — `index`, `label` (`"01 — WHO I AM"` pattern, mono, accent index). Static.
- **`Cursor`** — no props; dot 8px + ring 40px, `z-[100]`; returns `null` on coarse pointer / reduced motion.
- **`Preloader`** — no props; `z-[90]`, runs on every load/refresh (split-curtain reveal — name/counter fade, two ink panels part), signals `useUIStore.setPreloaderDone`.

## Known gotchas

- `ThemeToggle` is NOT re-exported from the barrel — import from `@/components/common/ThemeToggle` if needed (open follow-up).
- `Heading`'s default-variant responsive sizes (`md:text-3xl` etc.) survive `twMerge` over fluid tokens like `text-item` — for token-sized headings in sections, use `Box as="h3"` + token classes instead (established in the Journey build, `logs/feature-changes/2026-07-07-journey.md`).

**Why this matters here:** chapters 00–04 were built this way (see `src/features/home/sections/*` and `JourneyEntry.tsx`/`PillarBlock.tsx`); the QA auditor greps for bare tags (`grep -rnE "<(div|p|span|h[1-6]|img|a)[ >]" src/features`) and fails the Definition of Done on any hit.
