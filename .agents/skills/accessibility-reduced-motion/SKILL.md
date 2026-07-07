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
- Color contrast: paper (`#E4E4E4`) on ink (`#0A0A0A`) passes AA; don't rely on the accent (ember `#E8380F`, design_system v2 §3.2 — formerly brass in v1) alone for meaning.

## As built
`usePrefersReducedMotion()` lives in `src/hooks/`; `useLenis()` returns `null` under reduced motion (consumers fall back to native scroll — the common `Link` does this); `Cursor` and `Preloader` return `null`/skip entirely. All seven shipped primitives carry the fallback. Overlays (`MobileMenu` z-80, `Preloader` z-90) use the React 19 `inert` pattern for focus containment (established in the Hero QA round). Claude Code mirror: `.claude/rules/accessibility.md`.
