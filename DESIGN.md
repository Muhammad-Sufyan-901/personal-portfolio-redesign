---
name: Muhammad Sufyan — Portfolio
description: Motion-first, scroll-telling single-page portfolio in the Void & Ember system — dark-only, one ember accent, scrubbed reversible motion.
colors:
  ink: "#0A0A0A"
  surface: "#141414"
  raised: "#1C1C1C"
  paper: "#E4E4E4"
  paper-bright: "#F0F0F0"
  muted: "#9A9A9A"
  faint: "#4D4D4D"
  line: "#242424"
  line-strong: "#8A8A8A"
  ember: "#E8380F"
  ember-deep: "#B32C0B"
  ember-tint: "#E8380F1F"
  invert-bg: "#E8E8E8"
  invert-text: "#0A0A0A"
  success: "#5BAE7C"
  error: "#D8735E"
typography:
  display:
    fontFamily: "Instrument Serif, serif"
    fontSize: "clamp(3.5rem, 12vw, 11rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Switzer, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 6rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Switzer, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3.25rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Switzer, system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.05vw, 1.15rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
  pill: "9999px"
spacing:
  page-x: "clamp(1.25rem, 5vw, 6rem)"
  section: "clamp(6rem, 14vh, 12rem)"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ember-deep}"
    textColor: "#FFFFFF"
  menu-pill:
    backgroundColor: "#E4E4E41A"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 24px"
    typography: "{typography.label}"
  badge-pill:
    backgroundColor: "#E4E4E41A"
    textColor: "{colors.paper-bright}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  eyebrow:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  accordion-trigger:
    textColor: "{colors.paper}"
    padding: "16px 0"
---

# Design System: Muhammad Sufyan — Portfolio

## 1. Overview

**Creative North Star: "The Scroll Cinema"**

The page is a film strip and scroll is its timeline. Every beat — the preloader's name morph, the manifesto's pinned fill, the skills arrow's damped drift — is scrubbed to scroll progress: it plays forward, freezes when the visitor pauses, and retraces exactly in reverse. Nothing autoplays past the visitor; the visitor is the projectionist. The surfaces are a dark, quiet theater (near-black ink, neutral paper text) and a single ember accent marks moments the way a light hits a stage — rarely, precisely, never as a wash.

The system is cinematic, surgical, confident. It explicitly rejects SaaS landing-page grammar (hero-metric stat rows, identical icon-card grids, gradient text, glassmorphism as default), template developer portfolios (skill progress bars, three-column feature grids, testimonial carousels), and light, airy, pastel "designer resume" aesthetics — this site is dark-only by identity. The engineering IS the brand: every interaction must feel engineered, not assembled, because the site is the first work sample.

**Key Characteristics:**

- Dark-only Void & Ember palette; depth from hairlines and tonal layering, never shadows.
- One ember accent (#E8380F) used like a scalpel — marking moments, never washing surfaces.
- Scrubbed, reversible, damped motion; scroll is the only timeline; every effect ships a reduced-motion fallback.
- Three-family type stack: Instrument Serif (display), Switzer (body/statements), Inter (labels).
- Every color, size, and ease comes from the `@theme` contract in `src/styles/globals.css` — tokens or nothing.

## 2. Colors: The Void & Ember Palette

A near-black void carries neutral paper text; a single ember burns through it at decisive moments.

### Primary

- **Ember** (#E8380F): the one voice of the system — chapter-index digits, focal words, the skills scrub arrow, focus rings, the scroll cue, link hovers, PathDraw strokes. Deep press/pressed state is **Ember Deep** (#B32C0B); **Ember Tint** (#E8380F1F) is the only permitted wash, reserved for focal-word backgrounds.

### Neutral

- **Ink** (#0A0A0A): the page. Near-black, never #000.
- **Surface** (#141414) / **Raised** (#1C1C1C): the two tonal steps above ink — cards, hover surfaces, the skeletons.
- **Paper** (#E4E4E4): primary text. **Paper Bright** (#F0F0F0) is the hover/chrome lift.
- **Muted** (#9A9A9A) / **Faint** (#4D4D4D): secondary and disabled text.
- **Line** (#242424): hairline dividers — the system's structural pencil. **Line Strong** (#8A8A8A) for the rare emphatic rule (hero bar).
- **Invert** (#E8E8E8 bg / #0A0A0A text): the ONE light section (08 Contact) — the single hard contrast cut in the narrative.
- **Success** (#5BAE7C) / **Error** (#D8735E): form states only.

### Named Rules

**The Ember Scalpel Rule.** The accent appears on well under 10% of any viewport, always marking a moment (an index, a focal word, one moving object). An ember background, an ember gradient, or two ember moments competing in one fold are all forbidden. Its rarity is the voice.

**The Tokens-or-Nothing Rule.** Every color is written as a token utility (`bg-ink`, `text-paper`, `text-accent`) resolved from `@theme` in `src/styles/globals.css`. Raw hex in component code fails QA. The cobalt→ember retheme was a one-file change because of this rule; keep it that way.

## 3. Typography

**Display Font:** Instrument Serif (with serif fallback) — roman + true italic
**Body Font:** Switzer variable (with system-ui fallback)
**Label Font:** Inter variable (with system-ui fallback) — served by the `font-mono` utility name; labels are deliberately no longer monospace

**Character:** A grand serif voice for names and focal words, a precise Swiss sans for everything spoken, and a small engineered label face for the chrome. The signature device is the mixed statement: Switzer roman carrying the sentence, Instrument Serif italic igniting the focal phrase.

### Hierarchy

- **Display** (400, clamp(3.5rem, 12vw, 11rem), 0.95): the hero/footer name and display moments only. Hero-specific steps `--text-hero` and `--text-hero-line` extend this role.
- **Headline** (500, clamp(2.5rem, 7vw, 6rem), 1.0): chapter-scale statements (manifesto, gallery heading).
- **Title** (500–700, clamp(1.75rem, 4vw, 3.25rem), 1.15): section statements and accordion group titles (skills titles run this token −6px via tunable).
- **Item** (400, clamp(1.25rem, 2.4vw, 1.75rem), 1.2): index rows and list items — between title and body.
- **Body** (400, clamp(1rem, 1.05vw, 1.15rem), 1.6): prose, capped ≤68ch.
- **Label** (400, 0.8125rem, +0.08em, UPPERCASE): eyebrows, nav, meta. Smaller steps `--text-index` (0.875rem) and `--text-meta` (0.75rem) for counters and fine print.

### Named Rules

**The Statement Grammar Rule.** Emphasis inside a statement is never bold and never colored by default: the focal phrase switches face — Switzer roman → Instrument Serif italic — as React-owned word spans (split-type cannot wrap nested spans). One focal phrase per statement.

**The Fluid Token Rule.** Type sizes come only from the `--text-*` clamp scale; any new step must also be registered in `src/lib/utils.ts`'s twMerge font-size groups or it silently drops in class merges.

## 4. Elevation

This system is flat and shadowless. Depth is conveyed three ways: tonal layering (ink → surface → raised, two steps and no more), hairline rules (`--color-line` 1px dividers doing the structural work), and motion parallax (scrub-driven z-drift in the gallery, damped tilt on the projects preview). Box shadows do not appear anywhere; blur is reserved for the two glass pills (menu, badges) and the manifesto veil, always with a translucent paper fill, never as decoration.

Layering order is a fixed semantic z-scale: page content ≤ 50 < menu popout (60) < site menu (80) < preloader (90) < cursor (100). Never an arbitrary z-index.

### Named Rules

**The Hairline Depth Rule.** If a boundary needs asserting, it gets a 1px `line` rule or a one-step tonal lift — never a shadow, never a border thicker than 1px, never a side-stripe.

## 5. Components

### Buttons

- **Shape:** barely-rounded (4px); pills (9999px) only for the floating chrome.
- **Primary** (shadcn `Button`, restyled): ember background (#E8380F), white text, 36px height, 8px 16px padding; hover deepens toward Ember Deep.
- **Menu pill** (`MagneticButton` + `Button`): translucent paper glass — `paper/10` fill, `paper/15` 1px border, `backdrop-blur-md`, 40px tall, uppercase Inter label; hover lifts to `paper/20`. Magnetic: the pill translates up to 12px toward the pointer, label counter-moves ×−0.35, releases with an elastic spring.
- **Hover / Focus:** every interactive element takes the global focus ring — 2px ember outline, 2px offset. No custom focus styles.

### Chips

- **Style:** the light-glass badge pill — `paper/10` fill, `paper/15` border, `paper-bright` text, fully rounded, 4px 12px padding, `backdrop-blur-md`. Used for tech-stack badges (icon + name).
- **State:** static; no selected/unselected system exists.

### Cards / Containers

- **Corner Style:** 8px maximum (`--radius-lg`).
- **Background:** `surface` at rest, `raised` on hover; refinement comes from hairlines + spacing, not rounding or shadow.
- **Border:** 1px `line` hairline when a boundary is needed.
- **Internal Padding:** from the spacing scale; sections breathe with `--spacing-section`, pages gutter with `--spacing-page-x`.

### Inputs / Fields

Not yet built (land with 08 Contact): underlined 48px fields, Inter labels, ember focus underline, `success`/`error` inline states. No boxes, no filled backgrounds.

### Navigation

- **Chrome:** no header. A glass Menu pill (hero top-right, then a fixed pop-in past 45% viewport scroll) opens the full-screen `SiteMenu` curtain (ink surface, oversized links revealing from `overflow-hidden` line wrappers, 0.06s stagger).
- **In-page:** all navigation is hash-anchor smooth scroll via Lenis; the `ScrollProgressHUD` shows a live page percentage and chapter rail.

### The Chapter Signature (signature system)

`ChapterEyebrow` — `06 — TOOLKIT`: ember index digits + muted em-dash + muted uppercase Inter label. This is a deliberate, named brand system, not scaffolding: the site IS a numbered 10-chapter scroll narrative (00 Preloader → Footer), the numbers carry the film-reel sequence the visitor is inside, and the same digits echo in the menu and the HUD rail. It is the one eyebrow grammar allowed; no other section-label devices may be introduced beside it.

### The Cursor (signature component)

Custom cursor: 8px paper dot + 40px ring following at different damps (0.12s / 0.45s). Over a `data-cursor` labelled target the ring morphs into a white pill with an uppercase ink label ("View Project"). Hidden on coarse pointers and under reduced motion.

### Motion doctrine (applies to every component)

GSAP only, imported from `@/lib/gsap`; Lenis owns scroll (lerp 0.09); eases from tokens (`--ease-out: cubic-bezier(0.16,1,0.3,1)`, `--ease-inout: cubic-bezier(0.83,0,0.17,1)`; durations 0.4/0.8/1.2s). Scroll-bound effects are scrubbed and damped (per-tick exponential chase on the single `gsap.ticker`), so they freeze on pause and retrace exactly in reverse. Every effect ships a `prefers-reduced-motion` branch: opacity-only, Lenis off, cursor hidden, content fully readable.

## 6. Do's and Don'ts

### Do:

- **Do** style exclusively through token utilities from `@theme` (`bg-ink`, `text-paper`, `text-accent`, `font-display`); the QA gate greps for raw hex and fails on any hit.
- **Do** ship a `prefers-reduced-motion` fallback with every effect — opacity-only reveals, no pins, no scrub, native scroll — before the effect is considered built.
- **Do** keep the ember accent under the Scalpel Rule: one marked moment per fold, ≤10% of any viewport.
- **Do** use the numbered `ChapterEyebrow` as the only section-label device, and keep chapter numbers in narrative order.
- **Do** make scroll effects scrubbed, damped, and reversible (ScrollTrigger progress → damp applier on `gsap.ticker`); a scroll effect that cannot play backward is off-voice.
- **Do** convey depth with 1px `line` hairlines and the ink→surface→raised tonal steps.

### Don't:

- **Don't** use SaaS landing-page grammar: "hero-metric stat rows, identical icon-card grids, gradient text, glassmorphism as default" (PRODUCT.md anti-reference, verbatim).
- **Don't** build template developer-portfolio furniture: "skill progress bars, three-column feature grids, testimonial carousels" (PRODUCT.md anti-reference, verbatim).
- **Don't** drift toward "light, airy, pastel designer-resume aesthetics" — the site is dark-only by identity (PLAN v3.1 decision 2); the single permitted light surface is the 08 Contact invert.
- **Don't** write raw hex, magic px, or bespoke easing curves in components — tokens or nothing.
- **Don't** install framer-motion or import `gsap/ScrollTrigger` outside `src/lib/gsap.ts`; one GSAP source, one Lenis owner, one RAF.
- **Don't** add box shadows, side-stripe accents, borders >1px, or gradient text — the flat hairline system is the identity.
- **Don't** let the ember wash a surface: no ember backgrounds, no two ember moments in one fold, no ember body text.
