---
name: custom-components
description: Portfolio house style — generated JSX must use the custom primitives in src/components/common (Box, Container, Text, Heading, Link, Image, and the motion primitives) instead of raw HTML tags. Keeps normal software-engineering behavior.
keep-coding-instructions: true
---

# House Component Style

When writing or editing React/TSX in this project, **do not emit raw HTML elements in feature/page/section code**. Use the polymorphic primitives from `@/components/common`. This repo already declares `react/forbid-elements` banning bare `<div>` in favor of `<Box>`; treat that as the law for every element with a wrapper, not just `div`.

## Tag → component mapping (mandatory)

| Raw element | Use instead | Real props (from `src/components/common/*.tsx`) |
| --- | --- | --- |
| `div`, `section`, `article`, `header`, `footer`, `main`, `aside`, `nav`, `ul`, `li` | `<Box as="section">` … | `as` (default `"div"`), `className`; spreads native props; no styling of its own. |
| centered / max-width wrapper `div` | `<Container as="section" maxWidth="7xl">` | Always adds `mx-auto px-4 sm:px-6 lg:px-8`; `maxWidth` sm\|md\|lg\|xl\|2xl\|3xl\|4xl\|5xl\|6xl\|7xl\|full (default `"7xl"`); `centerContent` (default `false`) adds `flex flex-col items-center`. |
| `p`, `span` | `<Text as="p" variant="default">` | `as`: p \| span \| div (default `"p"`); `variant`: default \| lead \| large \| small \| muted (default `"default"`). |
| `h1`–`h6` | `<Heading level={2} variant="section">` | `level` 1–6 (default `1`) or `as="h2"`; `variant`: default \| display \| title \| subtitle \| section (default `"default"`; `display` = Instrument Serif `font-display text-display`). |
| `a`, router `Link` | `<Link href="/x">` | `href` required; `replace` (false), `scroll` (true), `target`, `rel`. Auto-routes internal (TanStack `RouterLink`) / hash (`lenis.scrollTo` smooth-scroll + `pushState`) / external-`mailto:`-`tel:` (external `_blank` auto-`rel="noopener noreferrer"`). |
| `img` | `<Image src alt width height objectFit priority />` | `priority` eager\|lazy (default `"lazy"`), `quality` (default `75`), `placeholder` blur\|empty (default `"empty"`), `fallback` (inline gray SVG default), `sizes`; srcset (640→3840) only when `width` set; skeleton `bg-raised animate-pulse`. |
| theme switch | `<ThemeToggle />` | No props. NOTE: not re-exported from the barrel — import from `@/components/common/ThemeToggle`. |

Always import from `@/components/common`, e.g. `import { Box, Heading, Text } from "@/components/common";`.

## Motion primitives (same barrel — reuse instead of hand-rolling GSAP)

All import GSAP only from `@/lib/gsap` and ship a `prefers-reduced-motion` fallback:

| Primitive | Props (defaults) | Use for |
| --- | --- | --- |
| `RevealText` | `mode` lines\|words\|chars (`"lines"`), `as` div\|p\|span\|h1…h6 (`"div"`), `delay` (0), `stagger` (lines .08 / words .04 / chars .025) | split-type reveals on ScrollTrigger enter |
| `ParallaxImage` | `aspect`, `parallax` (`from` −8 → `to` 8), `withScrim` (false) | clip-inset image reveal + scrub parallax |
| `Marquee` | `speed` (30 s/loop), `reverse` (false), `pauseOnHover` (true) | keyword/footer marquees (duplicate track `aria-hidden`) |
| `MagneticButton` | `strength` (12 px) | CTAs, social links |
| `ChapterEyebrow` | `index`, `label` | `01 — WHO I AM` chapter markers |
| `Cursor` / `Preloader` | `Cursor`: none · `Preloader`: `name` (required, `Profile["heroName"]`) | mounted once in `src/routes/__root.tsx` (z-100 / z-90) — do not remount. Preloader = name-morph choreography, tunables in `preloader.tunables.ts` |

## Example (follow this shape — token utilities only, never raw palette classes)

```tsx
import { Box, Heading } from "@/components/common";
import { cn } from "@/lib/utils";

<Box
  as="section"
  className={cn(isEven ? "bg-surface -mx-4 px-4 sm:-mx-6 sm:px-6 py-5" : "")}
>
  <Heading
    level={3}
    className={cn(["font-display text-base font-semibold text-paper", "mb-4"])}
  >
    {label}
  </Heading>
</Box>
```

(Design tokens come from `@theme` in `src/styles/globals.css` — `bg-ink`, `bg-surface`, `text-paper`, `text-muted`, `text-accent`, `border-line`, `font-display/sans/mono`. Raw `bg-slate-*`-style palette classes are off-token and fail QA.)

## Known gotcha

`Heading`'s default-variant responsive sizes (`md:text-3xl` etc.) survive `twMerge` over fluid tokens like `text-item` — for token-sized headings inside sections, use `Box as="h3"` + token classes (pattern established in the Journey chapter build).

## Exceptions (raw element allowed)

- Inside the primitives themselves (`src/components/common/*`) and shadcn output (`src/components/ui/*`). `ParallaxImage` deliberately renders a raw `<img>`.
- Interactive controls with no common wrapper → use shadcn/ui (`Button`, `Dialog`, `Input`, …), not raw `<button>`/`<input>`.
- Genuinely wrapper-less leaves (`svg`, `<input>` when not using shadcn) only as a last resort, and never a bare `<div>`/`<p>`/`<h*>`.

Everything else about how you engineer — scoping changes, verifying with `tsc`/lint, writing minimal diffs — stays exactly as in your default behavior.
