# Design System Brief: Muhammad Sufyan Portfolio (Redesign)

**Target Audience:** UI/UX Designer, Frontend Developer, Frontend AI Agents
**Design Theme:** Elegant Editorial, Void & Ember Dark Mode (neutral near-black + one vivid accent, not warm-toned), Typography-Driven, Scroll-Telling / Motion-First, Desktop-First Responsive
**Styling Framework:** Tailwind CSS **v4** + **shadcn/ui** (Radix primitives)
**Motion Stack:** **GSAP** (+ ScrollTrigger) · **Lenis** (smooth scroll) · **split-type** (text splitting)
**Visual Reference (motion & class, NOT content):** `lukebaffait.fr`
**Palette source (v2):** sampled programmatically from `reference/lukebaffait-scroll.mp4` (19 frames across the full 93s scroll, color-histogram analysis) — see §3.0. Supersedes the v1 speculative "Warm Ink + Brass" palette.
**Content Source:** `.agents/context/product_requirements.md` (all facts embedded there — no old repo needed)

## 1. Overview

This document defines the visual + motion standards for the redesigned personal portfolio of Muhammad Sufyan, a software engineer working across **web** (React, TypeScript, Tailwind, shadcn/ui, Laravel, Livewire) and **mobile** (Flutter, React Native). The redesign moves the site away from its previous "clean & modern, blue-accent" identity toward an **elegant, editorial, motion-first** experience where scroll is the primary narrative device — a **scroll-telling** journey that answers a single question: _who is this person?_

The visual hierarchy is built from three signatures: **a large, tightly-tracked display face** (serif or grotesk — see §4.1 for the open decision), **a neutral off-white/gray on a near-black void** (never pure black / pure white, and — per direct video analysis — not warm-toned either), and **an orchestrated motion layer** (line-by-line text reveals, clip-path image reveals, parallax, a custom cursor, and a preloader). Color is deliberately quiet — one vivid accent, used like a signal flare, not a wash; the "premium" feeling comes from typography, negative space, and choreography more than from color.

**shadcn/ui Integration Strategy:** shadcn/ui provides accessible primitives only where needed (Dialog for a project lightbox, Tooltip, form controls on the contact section). Visual styling is overridden with our token system via Tailwind v4 arbitrary values and the component's own `className`. Most of the portfolio is bespoke layout + motion, so shadcn is a **thin utility layer**, not the visual driver.

> **DO NOT** use shadcn/ui default theme colors when they conflict with the tokens below — always override with our `@theme` tokens or arbitrary values.

## 2. Design Principles

- **Void Hierarchy:** A neutral near-black (`#0A0A0A`) is the foundation; a neutral off-white/gray (`#E4E4E4`) is primary text — desaturated, not warm-toned (confirmed by direct color sampling of the reference, §3.0). The single accent (**ember `#E8380F`**, a vivid red-orange) is used sparingly — for the active nav marker, links on hover, the scroll cue, and one or two hero details. Never fill large areas with the accent. One section may briefly **invert** to a light neutral background (`#E8E8E8`) as a borrowed contrast technique — see §7.2.
- **Type is the interface.** Personality lives in the type pairing (editorial serif × modern grotesk × mono), not in decoration. Display type is set tight (negative tracking, ~1.0 leading); body is generous (leading ~1.6). Big type is a feature, not an accident.
- **Motion is choreographed, not sprinkled.** One orchestrated moment per section beats ten scattered effects. Movement earns attention _because most of the page is still_. Every animation has a `prefers-reduced-motion` fallback (opacity-only, no transforms/pins).
- **Structure encodes the story.** Chapters are numbered (`01 — 06`) because the page _is_ a sequence (a narrated journey). Mono eyebrows/labels carry the "engineer" voice; serif carries the "creative" voice.
- **Negative space is a material.** Sections breathe. Restraint is the point — this is an elegant, not a maximal, brief.

## 3. Color Palette

A **"Void & Ember"** system: neutral near-black + neutral grayscale text + one vivid accent. Dark-first (primary identity). Light mode is optional (see §10, note 8) — separate from the light-invert _section_ technique below, which is a momentary accent, not a mode.

### 3.0 Evidence (sampled from the reference video)

`reference/lukebaffait-scroll.mp4` was extracted twice: first pass 19 frames (`fps=1/5`), second pass **47 frames** (`fps=1/2`, every 2s) plus a per-frame brightness scan and a direct fetch of the live page (`lukebaffait.fr`) to cross-check against real DOM content. Findings that drove every value below:

| Sample point                                | Raw sampled swatches                                         | Reading                                                                                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Background (all frames)                     | `#080808` (60–79% of frame), `#000000`, `#101010`, `#202020` | Overwhelmingly one near-black, not pure `#000`. No warm cast. Matches the live page's own `theme-color: #0a0a0a` meta tag.                                 |
| Foreground / hero text (0–16s)              | `#e0e0e0`, `#d8d8d8`                                         | Neutral, very slightly cool — **not** cream/warm.                                                                                                          |
| Foreground / mid-page text (56–68s, Skills) | `#989898`, `#a0a0a0`, `#b0b0b0`, `#c0c0c0`                   | Fully neutral mid-gray, zero color tint.                                                                                                                   |
| Footer (88–93s)                             | `#f0f0f0`, `#f8f8f8`, `#e8e8e8`                              | Near-white, still neutral.                                                                                                                                 |
| Accent (28–40s, Work section)               | `#f81800`, `#c01010`, `#b81010`, `#880810`                   | One vivid red-orange, appears in a narrow window (project graphics/badges), nowhere else.                                                                  |
| Section background (68–81s, Awards)         | `#e8e8e8` (51–61% of frame)                                  | A distinct section **inverts to a light neutral background** — the only such flip in the whole scroll.                                                     |
| Hero background, full-frame avg (0–16s)     | avg RGB shifts from `(95,39,37)` toward neutral by ~18s      | Confirms an **aurora/gradient glow** (diffuse red-orange blur, upper-right-weighted) sits behind the hero, fading out as you scroll — see §3.0b and §11.1. |

Conclusion: the reference is **not** warm-toned anywhere. The earlier "Warm Ink + Brass" direction (v1 of this doc) was a reasonable original creative proposal but is now superseded by this measurement — the tokens in §3.1–3.2 reflect the real site, refined slightly (e.g. `#f81800` → `#E8380F`) for legibility/contrast at UI sizes rather than used as raw-sampled.

### 3.0b Reference Site — Section-by-Section Map (corrected, denser pass)

The first evidence pass under-differentiated the middle of the scroll. Re-extracting at 2s intervals plus a direct fetch of `lukebaffait.fr` (its on-page section indicator + real DOM copy) gives the actual section sequence — corrects the earlier analysis, which had missed **About** and **Gallery** as named, distinct moments:

| #   | Section (on-page label)                        | Approx. time | What's there                                                                                                                                                                                                                                                                       | Detail to borrow                                                                                                                                                                                  |
| --- | ---------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero**                                       | 0–16s        | Name + tagline ("Quiet creator, bringing ideas to life, through motion, detail and softness.") over a diffuse red-orange **aurora glow** background, upper-right-weighted, fading to black at the edges                                                                            | The aurora background itself — see §11.1, cross-ref §7.5 React Bits                                                                                                                               |
| 2   | **About**                                      | ~16–28s      | Bio statement + portrait photo: "As a creative developer, I craft tailor-made web experiences, blending technical precision and emotion." + short personal paragraph                                                                                                               | Two-tier statement (short punchy line + smaller supporting paragraph)                                                                                                                             |
| 3   | **Work — Projects**                            | ~28–40s      | Vertical list of project names (8: CyberDiag website, Anima, CyberDiag app, Zenith, SkymcDB, ChromaBlock, Symphony, Echo) with a single live cover-image preview swapping per item; closing line "Chaque projet est une occasion d'apprendre…" (Each project is a chance to learn) | List-hover-swaps-preview interaction; closing statement after the list                                                                                                                            |
| 4   | **Work — Gallery**                             | ~40–56s      | Same project set, re-presented as loosely scattered cover images (not a strict grid)                                                                                                                                                                                               | A second, looser "gallery" pass on the same work data — two treatments of one dataset, not two separate datasets                                                                                  |
| 5   | **Skills (Compétences)**                       | ~56–68s      | Bio restatement + categorized, expandable skill list: **Frontend**, **Animation & 3D** (GSAP, Lenis, Barba.js, Three.js, WebGL, Blender — validates our own GSAP+Lenis stack choice), Backend, Databases, DevOps & Tools, System & Security, Design                                | Expand/collapse category disclosure pattern                                                                                                                                                       |
| 6   | **Awards & Misc** _(the light-invert section)_ | ~68–81s      | A light-background list of 5 recognitions: GSAP "Site of the week", Awwwards "Honorable Mention", YouTube "Featured on Codegrid", Awwwards "Portfolio Honors nomination", landing.love "Best animations"                                                                           | Confirms the invert-section (§3.1b) is specifically an **awards/recognition** moment — a strong parallel to Sufyan's own Awards data already folded into Journey (`product_requirements.md §3.5`) |
| 7   | **Contact**                                    | ~81–88s      | Two short availability statements (apprenticeship search / open to freelance) each paired with a small line-art illustration, social links, email                                                                                                                                  | Short paired statement + illustration rhythm, distinct from the footer                                                                                                                            |
| 8   | **Footer**                                     | 88–93s       | Email + copyright, nav repeated, a **dual glyph/particle ornament** (two sparse ember-colored ASCII/dot-matrix clusters positioned symmetrically, reading almost like abstract hand or wing shapes), giant `Luke Baffait.` marquee                                                 | See §11 Footer — optional convergence/merge flourish                                                                                                                                              |

This is evidence for **borrowing techniques and rhythm**, not for renaming Sufyan's own chapters to match — his chapters (§11) stay driven by his own content (`product_requirements.md`). Where a technique is worth adopting, §11 says so explicitly and cites this table.

### 3.1 Core / Foundation Colors

| Category           | Name           | Token             | Hex       | Primary Usage                                        |
| ------------------ | -------------- | ----------------- | --------- | ---------------------------------------------------- |
| **Background**     | Void           | `--color-ink`     | `#0A0A0A` | Page background (neutral near-black, NOT pure black) |
| **Surface**        | Surface        | `--color-surface` | `#141414` | Cards, elevated panels                               |
| **Surface Raised** | Surface Raised | `--color-raised`  | `#1C1C1C` | Hover surfaces, nested panels                        |
| **Text Primary**   | Paper          | `--color-paper`   | `#E4E4E4` | Headings, body — neutral off-white (not warm)        |
| **Text Muted**     | Muted          | `--color-muted`   | `#9A9A9A` | Secondary text, captions                             |
| **Text Faint**     | Faint          | `--color-faint`   | `#4D4D4D` | Disabled, timestamps, index numbers pre-reveal       |
| **Border**         | Line           | `--color-line`    | `#242424` | Hairline dividers, 1px borders                       |

### 3.1b Invert Section (borrowed technique)

| Token                 | Hex       | Usage                                                                   |
| --------------------- | --------- | ----------------------------------------------------------------------- |
| `--color-invert-bg`   | `#E8E8E8` | Background for the one section that flips light (§7.2 "Section invert") |
| `--color-invert-text` | `#0A0A0A` | Text on that section — reuses `--color-ink`                             |

### 3.2 Accent (Signature)

| Token                 | Hex                    | Usage                                                                                                                                                                                        |
| --------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-accent`      | `#E8380F`              | **Signature ember** — a vivid red-orange, directly sampled from the reference (raw range `#c01010`–`#f81800`, cleaned up for UI use). Active nav dot, link hover, scroll cue, hero underline |
| `--color-accent-deep` | `#B32C0B`              | Pressed/hover-deep, gradient end                                                                                                                                                             |
| `--color-accent-tint` | `rgba(232,56,15,0.12)` | Faint accent wash behind a focal word / selection                                                                                                                                            |

> **Documented alternates** (if you'd rather not literally echo the reference's red-orange): **Brass `#C8A46A`** (warmer, more "craft") or **Elevated Cobalt `#3B5BFF`** (continuity with the old blue brand). Ember is the default because it's what's actually in the reference; either alternate is a valid deliberate departure. Keep everything else identical either way. Decide once, at planning approval.

### 3.3 Functional Colors

| Purpose    | Hex       | Usage                                 |
| ---------- | --------- | ------------------------------------- |
| Success    | `#5BAE7C` | Contact form success state            |
| Error      | `#D8735E` | Contact form validation error         |
| Focus Ring | `#E8380F` | Keyboard focus outline (accent-based) |

### 3.4 Text Selection & Overlays

| Token           | Value                                                           | Usage                          |
| --------------- | --------------------------------------------------------------- | ------------------------------ |
| `selection-bg`  | `rgba(232,56,15,0.25)`                                          | `::selection` background       |
| `overlay-scrim` | `rgba(10,10,10,0.72)`                                           | Preloader / transition curtain |
| `image-scrim`   | `linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.65))` | Work image legibility overlay  |

## 4. Typography

Three families with strict roles — this pairing tells the "creative × engineer" dual identity.

> **From the reference video:** the display type reads as a clean, tightly-tracked **grotesk/sans** at large sizes — no serif characteristics visible across any sampled frame. This is a real tension with the serif direction below. **Open decision (confirm at planning approval):**
>
> - **(A) Keep Fraunces** _(default recommendation)_ — the editorial serif still earns "elegant," and the reference's real signature is its motion choreography + restrained neutral palette, not its specific type family. Lower literal fidelity to the reference, same narrative intent.
> - **(B) Swap to a grotesk display** (e.g. push General Sans itself larger for `--font-display`, or a Neue-Montreal/Founders-Grotesk-style family) — higher literal fidelity to what's actually on screen in the video, sacrifices some of the serif's distinctiveness.
>   Everything below assumes (A); if (B) is chosen, replace `--font-display` references with the chosen grotesk and drop the `opsz`/`SOFT`/`WONK` note.

### 4.1 Font Families

| Family                  | Token            | Role                                                          | Source                          |
| ----------------------- | ---------------- | ------------------------------------------------------------- | ------------------------------- |
| **Fraunces** (variable) | `--font-display` | Hero name, chapter titles, large editorial statements         | `@fontsource-variable/fraunces` |
| **General Sans**        | `--font-sans`    | Body, navigation, buttons, paragraphs — **default UI face**   | Fontshare (self-host)           |
| **JetBrains Mono**      | `--font-mono`    | Chapter numbers, eyebrows, labels, metadata, tech-stack chips | `@fontsource/jetbrains-mono`    |

> Fraunces `opsz` (optical size) should be pushed high on the hero (`opsz` ~120) and `SOFT`/`WONK` kept low for a refined, not decorative, look. Satoshi is an acceptable swap for General Sans if preferred.

### 4.2 Font Weight Scale

Display (Fraunces): `300` (Light), `400` (Regular), `500` (Medium) — used large, never heavy-black.
Sans (General Sans): `400` (Regular), `500` (Medium), `600` (Semibold).
Mono: `400`, `500`.

### 4.3 Type Scale & Hierarchy (fluid, `clamp`)

| Style               | Font               | Size (`clamp`)                   | Line Height | Tracking  | Case      | Use Case                         |
| ------------------- | ------------------ | -------------------------------- | ----------- | --------- | --------- | -------------------------------- |
| **Display / Name**  | Fraunces 400       | `clamp(3.5rem, 12vw, 11rem)`     | `0.95`      | `-0.03em` | —         | Hero name, footer marquee        |
| **Chapter Title**   | Fraunces 400       | `clamp(2.5rem, 7vw, 6rem)`       | `1.0`       | `-0.02em` | —         | Section titles ("Selected Work") |
| **Statement**       | Fraunces 300       | `clamp(1.75rem, 4vw, 3.25rem)`   | `1.15`      | `-0.01em` | —         | Manifesto lines (scroll-fill)    |
| **H3 / Item**       | General Sans 600   | `clamp(1.25rem, 2.4vw, 1.75rem)` | `1.2`       | `-0.01em` | —         | Work title, journey role         |
| **Body**            | General Sans 400   | `clamp(1rem, 1.05vw, 1.15rem)`   | `1.6`       | `0`       | —         | Paragraphs, descriptions         |
| **Body Small**      | General Sans 400   | `0.9375rem`                      | `1.55`      | `0`       | —         | Secondary paragraphs             |
| **Eyebrow / Label** | JetBrains Mono 500 | `0.8125rem`                      | `1.4`       | `0.08em`  | UPPERCASE | Section eyebrow, field labels    |
| **Chapter Index**   | JetBrains Mono 400 | `0.875rem`                       | `1`         | `0.05em`  | —         | `01 — 06` markers                |
| **Meta / Chip**     | JetBrains Mono 400 | `0.75rem`                        | `1.4`       | `0.04em`  | —         | Tech stack, dates, links         |

## 5. Spacing System

### 5.1 Base Scale

4px base unit. Tokens: `2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160`.

### 5.2 Layout Spacing

| Purpose                   | Value                                       |
| ------------------------- | ------------------------------------------- |
| Page horizontal padding   | `clamp(1.25rem, 5vw, 6rem)`                 |
| Content max width         | `1280px` (text blocks capped `~68ch`)       |
| Wide/full-bleed max width | `1440px`                                    |
| Section vertical rhythm   | `clamp(6rem, 14vh, 12rem)` padding-block    |
| Grid                      | 12 columns, gutter `clamp(1rem, 2vw, 2rem)` |
| Stack gap (within block)  | `24–48px`                                   |

### 5.3 Component Sizing

| Component             | Size / Rule                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Header height         | `72px` (transparent → solid on scroll)                                                                              |
| Custom cursor (dot)   | `8px`; ring `40px` (scales on hover)                                                                                |
| Work card media       | `aspect-[4/3]` (grid) / `aspect-[16/9]` (feature)                                                                   |
| Journey timeline rail | `3–4px` organic/hand-drawn curve (SVG path, not a straight line), node `12px` — see §7.2 "Bold path draw", §3.0b #6 |
| Contact input         | `h-12`, hairline underline (not boxed)                                                                              |

## 6. Border Radius & Borders

### 6.1 Radius Scale

| Use Case           | Radius   | Tailwind       |
| ------------------ | -------- | -------------- |
| Base / cards       | `4px`    | `rounded`      |
| Media / work image | `8px`    | `rounded-lg`   |
| Chips / buttons    | `9999px` | `rounded-full` |

> Elegant ≠ round. Keep radii small; the accent of refinement is hairlines + spacing, not soft corners.

### 6.2 Borders

| Weight                   | Use Case                                         |
| ------------------------ | ------------------------------------------------ |
| `1px`                    | Default — dividers, card outline, `--color-line` |
| `1px` + `--color-accent` | Hover/active emphasis (nav, links)               |

## 7. Motion System (Signature Layer)

Motion is the defining feature. All motion runs through **GSAP** on top of a **Lenis** smooth-scroll canvas, driven by **ScrollTrigger**.

### 7.1 Motion Tokens

```css
@theme {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* expo-out — reveals */
  --ease-inout: cubic-bezier(0.83, 0, 0.17, 1); /* pins, transitions */
  --dur-fast: 0.4s;
  --dur-base: 0.8s;
  --dur-slow: 1.2s;
}
```

GSAP custom eases (register in `lib/gsap.ts`): map `power4.out` / `expo.out` to the above. Lenis config: `lerp: 0.09`, `wheelMultiplier: 1`, `smoothWheel: true`, `syncTouch: false`.

### 7.2 Reveal Vocabulary

| Pattern                                      | Technique                                                                                                                                                                                             | Where                                                                                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Line reveal**                              | `split-type` → lines wrapped in `overflow-hidden`; GSAP `yPercent 100→0`, stagger `0.08s`, `ease-out`                                                                                                 | Chapter titles, statements                                                                                                 |
| **Char reveal**                              | `split-type` chars; `yPercent`/`opacity` stagger `0.02–0.03s`                                                                                                                                         | Hero name                                                                                                                  |
| **Scroll-fill**                              | ScrollTrigger `scrub`; words go `opacity 0.15 → 1` across pin range                                                                                                                                   | Manifesto (chapter 02)                                                                                                     |
| **Clip reveal**                              | image `clip-path: inset(100% 0 0 0) → inset(0)`, `dur-slow`, `ease-out`                                                                                                                               | Work media, portrait                                                                                                       |
| **Bold path draw** _(confirmed, §3.0b #6)_   | a **thick (3–4px), organic/winding** SVG `<path>` (hand-drawn feel, not a straight rail) animated via `stroke-dasharray`/`stroke-dashoffset` `100%→0` on scroll `scrub` — replaces a plain `1px` line | Journey rail (§11.4) **and** Selected Work connecting line (§11.5) — this was under-specified before the denser video pass |
| **Parallax**                                 | ScrollTrigger `scrub`; media `yPercent -8 → 8`                                                                                                                                                        | Work images, hero bg                                                                                                       |
| **Pin + horizontal**                         | ScrollTrigger `pin` + `x` translate for one work row (desktop only)                                                                                                                                   | Selected Work (optional)                                                                                                   |
| **Section invert** _(from reference §3.0)_   | background-color hard-cut or short crossfade `--color-ink`→`--color-invert-bg` (+ text `--color-paper`→`--color-invert-text`) at scroll entry                                                         | One optional chapter, for a beat of contrast — see §11                                                                     |
| **Marquee**                                  | infinite `x` loop, pauses on hover, direction flips per row                                                                                                                                           | Craft keywords, footer name                                                                                                |
| **Magnetic**                                 | pointer-follow translate on buttons/links (max `~12px`), spring back                                                                                                                                  | CTAs, work links                                                                                                           |
| **Ornament converge** _(optional, §3.0b #8)_ | two small clusters of ember-tinted glyphs/dots, positioned symmetrically, animate toward center (`x`/`opacity` scrub) as the footer enters                                                            | Footer only, purely decorative — see §11 Footer                                                                            |

### 7.3 Cursor & Preloader

- **Custom cursor:** a dot + trailing ring (`mix-blend-difference` optional). Ring scales up + label appears ("View", "Drag") over interactive targets. Hidden on touch devices; native cursor restored under `prefers-reduced-motion`.
- **Preloader:** counter `0 → 100` (Mono) + name mask-reveal; on complete, a curtain (`--overlay-scrim`) wipes upward (`ease-inout`) into the hero, which begins its char reveal. Runs once per session.

### 7.4 Reduced Motion (mandatory)

Under `prefers-reduced-motion: reduce`: disable Lenis (native scroll), disable pins/scrubs/parallax/marquee/cursor; replace all reveals with a single `opacity 0 → 1` (`dur-fast`). No `yPercent`, no clip animation. The site must be fully legible and navigable.

### 7.5 Reference Component Libraries (borrow patterns, not code verbatim)

These are **inspiration + markup/layout sources** for specific moments below — not drop-in dependencies. Browse for the visual idea, then rebuild the animation on our stack (see the adaptation rule after the table).

| Library           | URL               | Native engine                                                                                                                                                        | Best fit here                                                                                                                                                                                                 |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React Bits**    | reactbits.dev     | **GSAP-native variants available** (also React-Spring, Framer Motion, Three.js — pick the GSAP version of a component)                                               | Hero/Preloader flourishes (text-split reveals, particle/aurora backgrounds); lowest adaptation cost of the four since it can already speak GSAP                                                               |
| **Magic UI**      | magicui.design    | Motion (Framer Motion) + Tailwind, shadcn-installable                                                                                                                | Craft chapter's keyword `Marquee`, Contact's shimmer/magnetic button feel, Selected Work bento-style grid layout ideas                                                                                        |
| **Aceternity UI** | ui.aceternity.com | Motion (Framer Motion) + Tailwind, also ships as shadcn blocks                                                                                                       | Its **Timeline** (sticky header + scroll-beam-follow) is a near-literal reference for our Journey chapter's scrubbed rail (§11.4); Spotlight/Lamp effect for Hero; sticky-navbar-hides-on-scroll matches §8.A |
| **21st.dev**      | 21st.dev          | Marketplace/registry aggregating community components (shadcn-compatible; usually Motion-based) — not one curated style, use as a search engine across the ecosystem | When you need "a [specific micro-interaction]" and don't know which named library has it; install via `npx shadcn@latest add "https://21st.dev/r/<author>/<component>"`                                       |

> **Mandatory adaptation rule:** all four are copy-paste sources for **layout, Tailwind classes, and the visual idea** — never install `framer-motion`/`motion` as a project dependency (it would violate §10 note 3's single-motion-stack rule and double the animation runtime). For any component pulled from Magic UI, Aceternity UI, or 21st.dev: (1) strip the `motion.div`/Framer Motion logic and reimplement the same effect with `gsap`/`ScrollTrigger` inside `useGSAP`, (2) replace every raw HTML tag (`div`, `p`, `span`, etc.) with our primitives (`Box`, `Text`, `Heading`, …) per §8 and `.claude/rules/custom-components.md`, (3) re-express any hard-coded colors/spacing as our `@theme` tokens. React Bits components already using its GSAP variant need only step 2–3. Treat every borrowed pattern as a sketch to rebuild, not a package to install.

## 8. Core UI Components

Bespoke components; shadcn only where noted.

### A. Header / Nav

- Fixed, `h-72px`, transparent over hero → `--color-ink` + hairline bottom on scroll (GSAP class toggle at scrollY > 40).
- Left: monogram "MS" (Fraunces). Right: chapter links (Mono, `--color-muted` → `--color-paper` on hover, active = ember dot). Mobile: full-screen overlay menu (staggered link reveal).

### B. Chapter Eyebrow

- `01 — WHO I AM` pattern: Mono index + em-dash + uppercase label, `--color-muted`, ember index. Sits above every chapter title. This is the primary structural signature.

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

- Underlined inputs (not boxed), Mono labels, ember focus underline. Reuse existing **EmailJS** integration from the old repo. shadcn form primitives optional; native handlers, no page reload.

## 9. Tailwind v4 Configuration

Tailwind **v4** only — no `tailwind.config.ts`. All tokens via `@theme` in `src/styles/globals.css`.

```css
@import "tailwindcss";

@theme {
  /* === Colors === */
  --color-ink: #0a0a0a;
  --color-surface: #141414;
  --color-raised: #1c1c1c;
  --color-paper: #e4e4e4;
  --color-muted: #9a9a9a;
  --color-faint: #4d4d4d;
  --color-line: #242424;

  --color-invert-bg: #e8e8e8;
  --color-invert-text: #0a0a0a;

  --color-accent: #e8380f;
  --color-accent-deep: #b32c0b;
  --color-accent-tint: rgba(232, 56, 15, 0.12);

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
  --color-overlay-scrim: rgba(10, 10, 10, 0.72);
}

/* Base */
::selection {
  background: rgba(232, 56, 15, 0.25);
}
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
html {
  scrollbar-width: none;
} /* Lenis handles scroll; hide native bar */

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
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

1. **Void, not pure.** Background is `#0A0A0A`, text is `#E4E4E4` — a neutral near-black and neutral off-white, directly sampled from the reference (§3.0), not warm-toned. Never `#000`/`#fff`. This single choice separates "elegant" from "default dark template".
2. **Accent is a scalpel.** Ember appears only on: active nav marker, link hover, scroll cue, ≤2 hero details, focus rings. If accent is everywhere, delete most of it.
3. **Lenis ↔ GSAP sync is non-negotiable.** Feed `lenis.raf` via `gsap.ticker`, call `ScrollTrigger.update()` on Lenis `scroll`, and `ScrollTrigger.refresh()` on route change + resize. A desync here breaks every pinned/scrubbed section.
4. **Every reveal wraps in `overflow-hidden`.** Line/char reveals need a clipping parent or text bleeds during the `yPercent` move.
5. **Split once, clean up always.** `split-type` mutates the DOM; revert on unmount (`useGSAP` scope handles this). Re-split on resize for correct line breaks (`ScrollTrigger` `invalidateOnRefresh`).
6. **Reduced motion is a first-class path**, not an afterthought — build the opacity-only fallback alongside each effect (see §7.4).
7. **Fonts must be self-hosted / bundled** (Fraunces + JetBrains Mono via `@fontsource`, General Sans via Fontshare files) with `font-display: swap` and preload for the display face to avoid FOUT on the hero name.
8. **Light mode is optional.** Ship dark-only for a stronger identity (recommended), OR add a `[data-theme="light"]` token block (ink→`#F4F1EA`, paper→`#1A1A1F`, accent→`#B32C0B`). Decide at planning approval. This is separate from note 11's _section_-level invert, which stays regardless of this choice.
9. **Content is ported, not invented.** All facts (projects, skills, experience, education) come from `product_requirements.md`. Microcopy may be rewritten to sound narrative; facts may not change.
10. **Performance budget.** Lighthouse ≥ 90 on Perf/A11y/Best/SEO. Lazy-load below-fold media (`.avif`/`.webp`, explicit `width/height`), code-split routes, keep GSAP timelines scoped and killed on cleanup.
11. **The invert-section technique is optional, not structural.** At most one chapter (§11) may flip to `--color-invert-bg`/`--color-invert-text` for a beat of contrast, mirroring what's actually in the reference (§3.0). If unused, delete the `--color-invert-*` tokens rather than leaving them dead.

## 11. Section (Chapter) Breakdown

The homepage is a single vertical narrative of numbered chapters. Order top → bottom:

`00 Preloader → 01 Hero → 02 Manifesto → 03 Craft → 04 Journey → 05 Selected Work → 06 Contact → Footer`

### 11.0 Preloader

- Full-screen `--color-ink`. Center: Mono counter `0→100` + name mask-reveal. On complete: curtain wipe up (`ease-inout`, `dur-slow`) → unmount → hero timeline plays. Once per session (guard via a Zustand flag or `sessionStorage`).

### 11.1 Hero — `01 — INTRO`

- Layout: full viewport. Name in Fraunces `display` (char reveal, stagger). One-line tagline (Sans) + role line (Mono): "Software Engineer · Web & Mobile". Scroll cue (ember) bottom.
- Motion: char reveal on load; subtle mouse-parallax on name/portrait (`~10px` max); scroll cue bob. Optional portrait with clip reveal.
- **Aurora background** _(confirmed, §3.0b #1):_ a diffuse, slow-drifting `--color-accent`-tinted glow (blurred radial/conic gradient or a canvas/WebGL blob), upper-right-weighted, fading to `--color-ink` toward the edges and as the user scrolls past the hero. Cross-ref `design_system.md §7.5` — React Bits ships GSAP-native aurora/background components as a starting point; keep it subtle (this is atmosphere, not the §3.2 accent rule's "scalpel" usage — it's a soft wash, not a UI-state signal).

### 11.2 Manifesto — `02 — WHO I AM` _(the storytelling peak)_

- 2–3 short Fraunces `statement` lines. On scroll (pinned range, `scrub`), words fill from `--color-faint` → `--color-paper`, one focal word tinted ember (`--color-accent-tint` wash). This is the emotional center of "who I am".

### 11.3 Craft — `03 — WHAT I DO`

- Two narrative pillars: **Web** (React · TypeScript · Tailwind · shadcn/ui · Laravel · Livewire) and **Mobile** (Flutter · React Native). Presented as two editorial blocks, not an icon grid. A `Marquee` of keyword/tech terms separates or underlines the pillars. Skills reveal line-by-line.
- _Optional (§7.2, §10 note 11):_ this is **one** candidate slot for the borrowed **Section invert** — the reference actually pairs its light-invert with an _awards/recognition_ moment (§3.0b #6), which for us maps more naturally to the Awards data folded into Journey below. Pick whichever chapter — Craft or Journey — the invert serves better; don't use it in both. Decide at planning approval; skip entirely if it feels gimmicky for this content.

### 11.4 Journey — `04 — THE PATH`

- Merge Experience + Education + **Awards** (`product_requirements.md §3.5`) into one vertical timeline; each entry (role/title, org, dates in Mono, one-line summary) reveals on enter. Chronological, most recent first.
- **Bold path draw** _(corrected from a plain 1px rail — see §3.0b #6, §7.2, §5.3):_ the rail is a **thick (3–4px), organic/winding SVG path** — not a straight line — that draws itself (`stroke-dashoffset 100%→0`, scrub) as you scroll. This was under-specified in the first evidence pass; the denser 47-frame re-analysis + direct site review confirmed it.
- If the Awards items get their own beat, this is the **other** candidate slot for Section invert (see 11.3) — the reference's own light-invert section is specifically an awards/recognition list.

### 11.5 Selected Work — `05 — SELECTED WORK`

- Curated subset of the projects listed in `product_requirements.md`. `WorkCard` grid (`grid-cols-1 md:grid-cols-2`) with `ParallaxImage` clip reveals + hover; optionally one **pinned horizontal** feature row on desktop. Tech chips in Mono. Link → `/work/$slug` (multi-page) or shadcn `Dialog` lightbox (single-page). Include live/repo links from data.
- **Bold path draw**, same technique as Journey (§7.2): if cards are connected by a visual line (e.g. a spine linking featured items), draw it thick and organically curved, not a thin straight rule.
- _Reference note (§3.0b #3–4):_ the reference presents its work data twice — once as a hover-swaps-preview list, once as a looser "gallery" scatter of the same covers. Consider whether Selected Work wants a similar list↔gallery toggle, or stays a single grid; not required, just an option surfaced by the denser pass.

### 11.6 Contact — `06 — LET'S TALK`

- Oversized Fraunces line "Let's build something." + `MagneticButton` (mailto / EmailJS form with underlined inputs) + social links (Mono, magnetic). Reuse existing EmailJS config.

### Footer

- Giant `Marquee` of the name (Fraunces `display`), muted, slow. Copyright + built-with line (Mono). Back-to-top magnetic link.
- **Ornament converge** _(optional, confirmed §3.0b #8):_ the reference's footer includes two sparse, ember-tinted glyph/dot-matrix clusters positioned symmetrically (readable almost as abstract hand or wing shapes) that read as a quiet flourish behind the marquee. If adopted: keep it decorative and `aria-hidden`, low-opacity, and let the two clusters drift/converge slightly (`x`, `opacity` scrub) as the footer enters — don't let it compete with the marquee or contact links for attention. Skip if it doesn't earn its place next to Sufyan's own content.

### 11.7 Vertical Rhythm Recap

- Every chapter: `padding-block: clamp(6rem, 14vh, 12rem)`, opens with the eyebrow (`01 — LABEL`), then title, then content. Consistent left alignment for the narrative spine; work + footer may go full-bleed.
