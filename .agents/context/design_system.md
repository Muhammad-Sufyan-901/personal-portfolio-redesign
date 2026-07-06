# Design System Brief: Muhammad Sufyan Portfolio (Redesign)

**Target Audience:** UI/UX Designer, Frontend Developer, Frontend AI Agents
**Design Theme:** Elegant Editorial, Warm-Ink Dark Mode, Typography-Driven, Scroll-Telling / Motion-First, Desktop-First Responsive
**Styling Framework:** Tailwind CSS **v4** + **shadcn/ui** (Radix primitives)
**Motion Stack:** **GSAP** (+ ScrollTrigger) · **Lenis** (smooth scroll) · **split-type** (text splitting)
**Visual Reference (motion & class, NOT color/content):** `lukebaffait.fr`
**Content Source:** `.agents/context/product_requirements.md` (all facts embedded there — no old repo needed)

## 1. Overview

This document defines the visual + motion standards for the redesigned personal portfolio of Muhammad Sufyan, a software engineer working across **web** (React, TypeScript, Tailwind, shadcn/ui, Laravel, Livewire) and **mobile** (Flutter, React Native). The redesign moves the site away from its previous "clean & modern, blue-accent" identity toward an **elegant, editorial, motion-first** experience where scroll is the primary narrative device — a **scroll-telling** journey that answers a single question: _who is this person?_

The visual hierarchy is built from three signatures: **an editorial serif display face used with restraint**, **a warm off-white on warm-ink palette** (never pure black / pure white), and **an orchestrated motion layer** (line-by-line text reveals, clip-path image reveals, parallax, a custom cursor, and a preloader). Color is deliberately quiet; the "premium" feeling comes from typography, negative space, and choreography — not from bright accents.

**shadcn/ui Integration Strategy:** shadcn/ui provides accessible primitives only where needed (Dialog for a project lightbox, Tooltip, form controls on the contact section). Visual styling is overridden with our token system via Tailwind v4 arbitrary values and the component's own `className`. Most of the portfolio is bespoke layout + motion, so shadcn is a **thin utility layer**, not the visual driver.

> **DO NOT** use shadcn/ui default theme colors when they conflict with the tokens below — always override with our `@theme` tokens or arbitrary values.

## 2. Design Principles

- **Warm-Ink Hierarchy:** A warm near-black (`#0B0B0F`) is the foundation; a warm off-white (`#ECE8E1`) is primary text. The single accent (**brass `#C8A46A`**) is used sparingly — for the active nav marker, links on hover, the scroll cue, and one or two hero details. Never fill large areas with the accent.
- **Type is the interface.** Personality lives in the type pairing (editorial serif × modern grotesk × mono), not in decoration. Display type is set tight (negative tracking, ~1.0 leading); body is generous (leading ~1.6). Big type is a feature, not an accident.
- **Motion is choreographed, not sprinkled.** One orchestrated moment per section beats ten scattered effects. Movement earns attention _because most of the page is still_. Every animation has a `prefers-reduced-motion` fallback (opacity-only, no transforms/pins).
- **Structure encodes the story.** Chapters are numbered (`01 — 06`) because the page _is_ a sequence (a narrated journey). Mono eyebrows/labels carry the "engineer" voice; serif carries the "creative" voice.
- **Negative space is a material.** Sections breathe. Restraint is the point — this is an elegant, not a maximal, brief.

## 3. Color Palette

A **"Warm Ink + Brass"** system. Dark-first (primary identity). Light mode is optional (see §10, note 8).

### 3.1 Core / Foundation Colors

| Category           | Name          | Token             | Hex       | Primary Usage                                      |
| ------------------ | ------------- | ----------------- | --------- | -------------------------------------------------- |
| **Background**     | Warm Ink      | `--color-ink`     | `#0B0B0F` | Page background (warm near-black, NOT pure black)  |
| **Surface**        | Surface       | `--color-surface` | `#14141A` | Cards, elevated panels                             |
| **Surface Raised** | Surface Raised| `--color-raised`  | `#1C1C24` | Hover surfaces, nested panels                      |
| **Text Primary**   | Paper         | `--color-paper`   | `#ECE8E1` | Headings, body — warm off-white (feels premium)    |
| **Text Muted**     | Muted         | `--color-muted`   | `#8A8A94` | Secondary text, captions                           |
| **Text Faint**     | Faint         | `--color-faint`   | `#55555F` | Disabled, timestamps, index numbers pre-reveal     |
| **Border**         | Line          | `--color-line`    | `#26262E` | Hairline dividers, 1px borders                     |

### 3.2 Accent (Signature)

| Token                 | Hex       | Usage                                                         |
| --------------------- | --------- | ------------------------------------------------------------ |
| `--color-accent`      | `#C8A46A` | **Signature brass.** Active nav dot, link hover, scroll cue, hero underline |
| `--color-accent-deep` | `#A8823E` | Pressed/hover-deep, gradient end                             |
| `--color-accent-tint` | `rgba(200,164,106,0.12)` | Faint accent wash behind a focal word / selection |

> **Documented alternate:** if brand continuity with the old blue is preferred, swap the accent for **Elevated Cobalt `#3B5BFF`** (deep `#2E48D6`). Keep everything else identical. Decide once, at planning approval — do not use both.

### 3.3 Functional Colors

| Purpose        | Hex       | Usage                                   |
| -------------- | --------- | --------------------------------------- |
| Success        | `#5BAE7C` | Contact form success state              |
| Error          | `#D8735E` | Contact form validation error          |
| Focus Ring     | `#C8A46A` | Keyboard focus outline (accent-based)   |

### 3.4 Text Selection & Overlays

| Token             | Value                        | Usage                          |
| ----------------- | ---------------------------- | ------------------------------ |
| `selection-bg`    | `rgba(200,164,106,0.25)`     | `::selection` background       |
| `overlay-scrim`   | `rgba(11,11,15,0.72)`        | Preloader / transition curtain |
| `image-scrim`     | `linear-gradient(180deg, transparent 40%, rgba(11,11,15,0.65))` | Work image legibility overlay |

## 4. Typography

Three families with strict roles — this pairing tells the "creative × engineer" dual identity.

### 4.1 Font Families

| Family                | Token            | Role                                                            | Source                    |
| --------------------- | ---------------- | -------------------------------------------------------------- | ------------------------- |
| **Fraunces** (variable) | `--font-display` | Hero name, chapter titles, large editorial statements          | `@fontsource-variable/fraunces` |
| **General Sans**      | `--font-sans`    | Body, navigation, buttons, paragraphs — **default UI face**     | Fontshare (self-host)     |
| **JetBrains Mono**    | `--font-mono`    | Chapter numbers, eyebrows, labels, metadata, tech-stack chips   | `@fontsource/jetbrains-mono` |

> Fraunces `opsz` (optical size) should be pushed high on the hero (`opsz` ~120) and `SOFT`/`WONK` kept low for a refined, not decorative, look. Satoshi is an acceptable swap for General Sans if preferred.

### 4.2 Font Weight Scale

Display (Fraunces): `300` (Light), `400` (Regular), `500` (Medium) — used large, never heavy-black.
Sans (General Sans): `400` (Regular), `500` (Medium), `600` (Semibold).
Mono: `400`, `500`.

### 4.3 Type Scale & Hierarchy (fluid, `clamp`)

| Style             | Font              | Size (`clamp`)                     | Line Height | Tracking | Case      | Use Case                                   |
| ----------------- | ----------------- | ---------------------------------- | ----------- | -------- | --------- | ------------------------------------------ |
| **Display / Name**| Fraunces 400      | `clamp(3.5rem, 12vw, 11rem)`       | `0.95`      | `-0.03em`| —         | Hero name, footer marquee                  |
| **Chapter Title** | Fraunces 400      | `clamp(2.5rem, 7vw, 6rem)`         | `1.0`       | `-0.02em`| —         | Section titles ("Selected Work")           |
| **Statement**     | Fraunces 300      | `clamp(1.75rem, 4vw, 3.25rem)`     | `1.15`      | `-0.01em`| —         | Manifesto lines (scroll-fill)              |
| **H3 / Item**     | General Sans 600  | `clamp(1.25rem, 2.4vw, 1.75rem)`   | `1.2`       | `-0.01em`| —         | Work title, journey role                   |
| **Body**          | General Sans 400  | `clamp(1rem, 1.05vw, 1.15rem)`     | `1.6`       | `0`      | —         | Paragraphs, descriptions                   |
| **Body Small**    | General Sans 400  | `0.9375rem`                        | `1.55`      | `0`      | —         | Secondary paragraphs                       |
| **Eyebrow / Label**| JetBrains Mono 500| `0.8125rem`                        | `1.4`       | `0.08em` | UPPERCASE | Section eyebrow, field labels              |
| **Chapter Index** | JetBrains Mono 400| `0.875rem`                         | `1`         | `0.05em` | —         | `01 — 06` markers                          |
| **Meta / Chip**   | JetBrains Mono 400| `0.75rem`                          | `1.4`       | `0.04em` | —         | Tech stack, dates, links                   |

## 5. Spacing System

### 5.1 Base Scale

4px base unit. Tokens: `2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160`.

### 5.2 Layout Spacing

| Purpose                     | Value                                   |
| --------------------------- | --------------------------------------- |
| Page horizontal padding     | `clamp(1.25rem, 5vw, 6rem)`             |
| Content max width           | `1280px` (text blocks capped `~68ch`)   |
| Wide/full-bleed max width   | `1440px`                                |
| Section vertical rhythm     | `clamp(6rem, 14vh, 12rem)` padding-block|
| Grid                        | 12 columns, gutter `clamp(1rem, 2vw, 2rem)` |
| Stack gap (within block)    | `24–48px`                               |

### 5.3 Component Sizing

| Component            | Size / Rule                              |
| -------------------- | ---------------------------------------- |
| Header height        | `72px` (transparent → solid on scroll)   |
| Custom cursor (dot)  | `8px`; ring `40px` (scales on hover)     |
| Work card media      | `aspect-[4/3]` (grid) / `aspect-[16/9]` (feature) |
| Journey timeline rail| `1px` line, node `10px`                  |
| Contact input        | `h-12`, hairline underline (not boxed)   |

## 6. Border Radius & Borders

### 6.1 Radius Scale

| Use Case            | Radius   | Tailwind         |
| ------------------- | -------- | ---------------- |
| Base / cards        | `4px`    | `rounded`        |
| Media / work image  | `8px`    | `rounded-lg`     |
| Chips / buttons     | `9999px` | `rounded-full`   |

> Elegant ≠ round. Keep radii small; the accent of refinement is hairlines + spacing, not soft corners.

### 6.2 Borders

| Weight | Use Case                                     |
| ------ | -------------------------------------------- |
| `1px`  | Default — dividers, card outline, `--color-line` |
| `1px` + `--color-accent` | Hover/active emphasis (nav, links) |

## 7. Motion System (Signature Layer)

Motion is the defining feature. All motion runs through **GSAP** on top of a **Lenis** smooth-scroll canvas, driven by **ScrollTrigger**.

### 7.1 Motion Tokens

```css
@theme {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);    /* expo-out — reveals */
  --ease-inout: cubic-bezier(0.83, 0, 0.17, 1); /* pins, transitions */
  --dur-fast: 0.4s;
  --dur-base: 0.8s;
  --dur-slow: 1.2s;
}
```

GSAP custom eases (register in `lib/gsap.ts`): map `power4.out` / `expo.out` to the above. Lenis config: `lerp: 0.09`, `wheelMultiplier: 1`, `smoothWheel: true`, `syncTouch: false`.

### 7.2 Reveal Vocabulary

| Pattern            | Technique                                                                 | Where |
| ------------------ | ------------------------------------------------------------------------- | ----- |
| **Line reveal**    | `split-type` → lines wrapped in `overflow-hidden`; GSAP `yPercent 100→0`, stagger `0.08s`, `ease-out` | Chapter titles, statements |
| **Char reveal**    | `split-type` chars; `yPercent`/`opacity` stagger `0.02–0.03s`             | Hero name |
| **Scroll-fill**    | ScrollTrigger `scrub`; words go `opacity 0.15 → 1` across pin range       | Manifesto (chapter 02) |
| **Clip reveal**    | image `clip-path: inset(100% 0 0 0) → inset(0)`, `dur-slow`, `ease-out`   | Work media, portrait |
| **Parallax**       | ScrollTrigger `scrub`; media `yPercent -8 → 8`                            | Work images, hero bg |
| **Pin + horizontal**| ScrollTrigger `pin` + `x` translate for one work row (desktop only)      | Selected Work (optional) |
| **Marquee**        | infinite `x` loop, pauses on hover, direction flips per row               | Craft keywords, footer name |
| **Magnetic**       | pointer-follow translate on buttons/links (max `~12px`), spring back      | CTAs, work links |

### 7.3 Cursor & Preloader

- **Custom cursor:** a dot + trailing ring (`mix-blend-difference` optional). Ring scales up + label appears ("View", "Drag") over interactive targets. Hidden on touch devices; native cursor restored under `prefers-reduced-motion`.
- **Preloader:** counter `0 → 100` (Mono) + name mask-reveal; on complete, a curtain (`--overlay-scrim`) wipes upward (`ease-inout`) into the hero, which begins its char reveal. Runs once per session.

### 7.4 Reduced Motion (mandatory)

Under `prefers-reduced-motion: reduce`: disable Lenis (native scroll), disable pins/scrubs/parallax/marquee/cursor; replace all reveals with a single `opacity 0 → 1` (`dur-fast`). No `yPercent`, no clip animation. The site must be fully legible and navigable.

## 8. Core UI Components

Bespoke components; shadcn only where noted.

### A. Header / Nav
- Fixed, `h-72px`, transparent over hero → `--color-ink` + hairline bottom on scroll (GSAP class toggle at scrollY > 40).
- Left: monogram "MS" (Fraunces). Right: chapter links (Mono, `--color-muted` → `--color-paper` on hover, active = brass dot). Mobile: full-screen overlay menu (staggered link reveal).

### B. Chapter Eyebrow
- `01 — WHO I AM` pattern: Mono index + em-dash + uppercase label, `--color-muted`, brass index. Sits above every chapter title. This is the primary structural signature.

### C. `RevealText`
- Wraps children, runs `split-type` (line or char mode via prop), animates on `ScrollTrigger` enter. Cleans up split on unmount. Honors reduced motion.

### D. `ParallaxImage`
- `<figure>` with clip-path reveal on enter + parallax scrub. `aspect` + `object-cover`. Includes `--image-scrim` when captioned.

### E. `WorkCard`
- Media (`ParallaxImage`) + title (H3) + tech chips (Mono) + year. Hover: media scale `1.03`, title shifts, cursor label "View". Links to `/work/$slug` (if multi-page) or opens shadcn `Dialog` lightbox.

### F. `Marquee`
- Infinite horizontal loop, seamless duplicate track, hover-pause, `aria-hidden` decorative duplicate.

### G. `MagneticButton` / `MagneticLink`
- Pointer-follow transform + inner label counter-move; springs back on leave. Used for primary CTA + social links.

### H. Contact Form
- Underlined inputs (not boxed), Mono labels, brass focus underline. Reuse existing **EmailJS** integration from the old repo. shadcn form primitives optional; native handlers, no page reload.

## 9. Tailwind v4 Configuration

Tailwind **v4** only — no `tailwind.config.ts`. All tokens via `@theme` in `src/styles/globals.css`.

```css
@import "tailwindcss";

@theme {
  /* === Colors === */
  --color-ink: #0b0b0f;
  --color-surface: #14141a;
  --color-raised: #1c1c24;
  --color-paper: #ece8e1;
  --color-muted: #8a8a94;
  --color-faint: #55555f;
  --color-line: #26262e;

  --color-accent: #c8a46a;
  --color-accent-deep: #a8823e;
  --color-accent-tint: rgba(200, 164, 106, 0.12);

  --color-success: #5bae7c;
  --color-error: #d8735e;

  /* === Typography === */
  --font-display: "Fraunces Variable", "Fraunces", serif;
  --font-sans: "General Sans", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* === Radius === */
  --radius: 4px;
  --radius-lg: 8px;

  /* === Motion === */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-inout: cubic-bezier(0.83, 0, 0.17, 1);
  --dur-fast: 0.4s;
  --dur-base: 0.8s;
  --dur-slow: 1.2s;

  /* === Overlays === */
  --color-overlay-scrim: rgba(11, 11, 15, 0.72);
}

/* Base */
::selection { background: rgba(200, 164, 106, 0.25); }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
html { scrollbar-width: none; } /* Lenis handles scroll; hide native bar */

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

### 9.1 GSAP Registration (`src/lib/gsap.ts`)

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power4.out", duration: 0.8 });

export { gsap, ScrollTrigger };
```

### 9.2 shadcn Override Pattern

Use the component's `className` with our tokens; never rely on shadcn default palette:

```tsx
<Button className="rounded-full bg-accent text-ink font-sans font-semibold hover:bg-accent-deep">
  Let's build something
</Button>
```

## 10. Implementation Notes

Critical rules — do not skip:

1. **Warm, not pure.** Background is `#0B0B0F`, text is `#ECE8E1`. Never `#000`/`#fff`. This single choice separates "elegant" from "default dark template".
2. **Accent is a scalpel.** Brass appears only on: active nav marker, link hover, scroll cue, ≤2 hero details, focus rings. If accent is everywhere, delete most of it.
3. **Lenis ↔ GSAP sync is non-negotiable.** Feed `lenis.raf` via `gsap.ticker`, call `ScrollTrigger.update()` on Lenis `scroll`, and `ScrollTrigger.refresh()` on route change + resize. A desync here breaks every pinned/scrubbed section.
4. **Every reveal wraps in `overflow-hidden`.** Line/char reveals need a clipping parent or text bleeds during the `yPercent` move.
5. **Split once, clean up always.** `split-type` mutates the DOM; revert on unmount (`useGSAP` scope handles this). Re-split on resize for correct line breaks (`ScrollTrigger` `invalidateOnRefresh`).
6. **Reduced motion is a first-class path**, not an afterthought — build the opacity-only fallback alongside each effect (see §7.4).
7. **Fonts must be self-hosted / bundled** (Fraunces + JetBrains Mono via `@fontsource`, General Sans via Fontshare files) with `font-display: swap` and preload for the display face to avoid FOUT on the hero name.
8. **Light mode is optional.** Ship dark-only for a stronger identity (recommended), OR add a `[data-theme="light"]` token block (ink→`#F4F1EA`, paper→`#1A1A1F`, accent→`#A87E3C`). Decide at planning approval.
9. **Content is ported, not invented.** All facts (projects, skills, experience, education) come from `product_requirements.md`. Microcopy may be rewritten to sound narrative; facts may not change.
10. **Performance budget.** Lighthouse ≥ 90 on Perf/A11y/Best/SEO. Lazy-load below-fold media (`.avif`/`.webp`, explicit `width/height`), code-split routes, keep GSAP timelines scoped and killed on cleanup.

## 11. Section (Chapter) Breakdown

The homepage is a single vertical narrative of numbered chapters. Order top → bottom:

`00 Preloader → 01 Hero → 02 Manifesto → 03 Craft → 04 Journey → 05 Selected Work → 06 Contact → Footer`

### 11.0 Preloader
- Full-screen `--color-ink`. Center: Mono counter `0→100` + name mask-reveal. On complete: curtain wipe up (`ease-inout`, `dur-slow`) → unmount → hero timeline plays. Once per session (guard via a Zustand flag or `sessionStorage`).

### 11.1 Hero — `01 — INTRO`
- Layout: full viewport. Name in Fraunces `display` (char reveal, stagger). One-line tagline (Sans) + role line (Mono): "Software Engineer · Web & Mobile". Scroll cue (brass) bottom.
- Motion: char reveal on load; subtle mouse-parallax on name/portrait (`~10px` max); scroll cue bob. Optional portrait with clip reveal.

### 11.2 Manifesto — `02 — WHO I AM`  *(the storytelling peak)*
- 2–3 short Fraunces `statement` lines. On scroll (pinned range, `scrub`), words fill from `--color-faint` → `--color-paper`, one focal word tinted brass (`--color-accent-tint` wash). This is the emotional center of "who I am".

### 11.3 Craft — `03 — WHAT I DO`
- Two narrative pillars: **Web** (React · TypeScript · Tailwind · shadcn/ui · Laravel · Livewire) and **Mobile** (Flutter · React Native). Presented as two editorial blocks, not an icon grid. A `Marquee` of keyword/tech terms separates or underlines the pillars. Skills reveal line-by-line.

### 11.4 Journey — `04 — THE PATH`
- Merge Experience + Education into one vertical timeline. A `1px` rail draws (scaleY `0→1`, scrub) as you scroll; each entry (role/title, org, dates in Mono, one-line summary) reveals on enter. Chronological, most recent first.

### 11.5 Selected Work — `05 — SELECTED WORK`
- Curated subset of the projects listed in `product_requirements.md`. `WorkCard` grid (`grid-cols-1 md:grid-cols-2`) with `ParallaxImage` clip reveals + hover; optionally one **pinned horizontal** feature row on desktop. Tech chips in Mono. Link → `/work/$slug` (multi-page) or shadcn `Dialog` lightbox (single-page). Include live/repo links from data.

### 11.6 Contact — `06 — LET'S TALK`
- Oversized Fraunces line "Let's build something." + `MagneticButton` (mailto / EmailJS form with underlined inputs) + social links (Mono, magnetic). Reuse existing EmailJS config.

### Footer
- Giant `Marquee` of the name (Fraunces `display`), muted, slow. Copyright + built-with line (Mono). Back-to-top magnetic link.

### 11.7 Vertical Rhythm Recap
- Every chapter: `padding-block: clamp(6rem, 14vh, 12rem)`, opens with the eyebrow (`01 — LABEL`), then title, then content. Consistent left alignment for the narrative spine; work + footer may go full-bleed.
