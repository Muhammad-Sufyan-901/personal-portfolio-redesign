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
- **Scrubbed rail** (line `scaleY 0→1`) → Journey timeline.
- **Marquee** (infinite x loop, hover-pause) → Craft keywords, footer name.
- **Magnetic** (pointer-follow ≤12px) → CTAs, links.

## Principles
- One orchestrated moment per chapter; keep most of the page still.
- Numbered eyebrows `01 — LABEL` (mono) open every chapter — the story IS a sequence.
- Consistent left-aligned narrative spine; work + footer may be full-bleed.
- Section rhythm: `padding-block: clamp(6rem, 14vh, 12rem)`.
