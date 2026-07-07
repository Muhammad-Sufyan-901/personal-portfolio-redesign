---
name: scrollytelling
description: Choreograph the 7-chapter scroll narrative (Preloader→Hero→Manifesto→Craft→Journey→Work→Contact). Activate when building or sequencing sections.
---

# Scrollytelling Choreography

Authoritative: `context/design_system.md §11` (per-chapter spec), `context/product_requirements.md §4` (narrative mapping).

## Reveal vocabulary (pick per chapter)
- **Line/char reveal** (`split-type` + `yPercent 100→0`, stagger) → hero name, chapter titles.
- **Scroll-fill** (ScrollTrigger `scrub`, words `opacity 0.15→1`) → Manifesto (the "who I am" peak).
- **Clip reveal + parallax** (`clip-path inset(100%→0)` + `yPercent` scrub) → Work media, portrait.
- **Scrubbed rail** (line `scaleY 0→1`) → Journey timeline — design_system v2 §7.2 upgrades this to a **bold path draw**: thick (3–4px) organic SVG path via `stroke-dashoffset` scrub, not a straight 1px line. Aceternity UI's Timeline is the reference sketch (see the `animated-ui-references` skill).
- **Marquee** (infinite x loop, hover-pause) → Craft keywords, footer name.
- **Magnetic** (pointer-follow ≤12px) → CTAs, links.

## Principles
- One orchestrated moment per chapter; keep most of the page still.
- Numbered eyebrows `01 — LABEL` (mono) open every chapter — the story IS a sequence.
- Consistent left-aligned narrative spine; work + footer may be full-bleed.
- Section rhythm: `padding-block: clamp(6rem, 14vh, 12rem)`.

## As built (chapters 00–04 shipped)

The vocabulary above is live in `src/features/home/sections/`: hero char reveal (gated on `useUIStore.preloaderDone`), manifesto pinned scroll-fill (words `opacity 0.15→1`, accent focal word), craft full-bleed marquee (21 skills, 30s/loop), journey rail scrub + once-only entry rises. Remaining: Work (05, clip reveals + parallax), Contact (06, magnetic CTA), plus v2 upgrades (hero aurora §11.1, bold path draw §11.4/11.5, optional footer ornament converge).
