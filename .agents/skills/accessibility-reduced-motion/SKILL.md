---
name: accessibility-reduced-motion
description: Accessibility + prefers-reduced-motion handling. Activate for every animated component and before any QA sign-off.
---

# Accessibility & Reduced Motion

## prefers-reduced-motion (mandatory for EVERY effect)
- Read via `usePrefersReducedMotion()`. When reduced: replace reveals with a single `opacity 0→1` (no transforms/pins/scrub/parallax/marquee), **disable Lenis** (native scroll), **hide the custom cursor** (restore native).
- Build the fallback alongside the effect, not after.

## Accessibility
- Semantic landmarks (`header`, `main`, `section`, `footer`), correct heading order (one `h1` = hero name).
- Visible focus: brass ring (`:focus-visible outline`). Full keyboard nav; skip-to-content link.
- All media has descriptive `alt`; decorative marquee duplicates are `aria-hidden`.
- Color contrast: paper on ink passes AA; don't rely on brass alone for meaning.
