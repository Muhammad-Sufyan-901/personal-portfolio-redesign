---
paths:
  - "src/**/*.tsx"
---

# Accessibility & reduced motion — mirrors `.agents/skills/accessibility-reduced-motion` + `.agents/rules/accessibility-performance.md`

## prefers-reduced-motion (mandatory for EVERY effect)

- Read via `usePrefersReducedMotion()` (`src/hooks/`). When reduced: replace reveals with a single `opacity 0→1` (no transforms/pins/scrub/parallax/marquee), **disable Lenis** (native scroll — `useLenis()` already returns `null` in this mode), **hide the custom cursor** (`Cursor` returns `null`).
- Build the fallback alongside the effect, not after — all 7 shipped primitives (`RevealText` … `Preloader`) already follow this contract; match it in any new one.

## Accessibility

- Semantic landmarks (`header`, `main`, `section`, `footer` via `Box as=…`); correct heading order — exactly one `h1` (the hero name in `HeroSection.tsx`).
- Visible focus: accent ring `:focus-visible { outline: 2px solid var(--color-accent) }` (ember `#E8380F` per design_system v2 §3.3; the shipped globals.css still uses the pre-migration cobalt value). Full keyboard nav; skip-to-content link.
- All media has descriptive `alt`; decorative duplicates (`Marquee`'s cloned track) are `aria-hidden`. AA contrast (paper `#E4E4E4` on ink `#0A0A0A` passes comfortably); don't rely on the accent alone for meaning.
- Overlays trap correctly: `MobileMenu` (z-80) and `Preloader` (z-90) use the React 19 `inert` pattern on background content (established in the Hero chapter QA round).

**Why this matters here:** this is a motion-first site — without the reduced-motion path the entire narrative (pinned manifesto, scrubbed journey rail, char reveals) becomes unusable for motion-sensitive visitors, and the QA Definition of Done (`system_architecture.md §8`, Lighthouse A11y ≥ 90) fails the chapter. The Hero audit already caught overlay-focus and off-token issues once; this rule keeps them from recurring.
