# Accessibility & Performance

> Twin: `.claude/rules/accessibility.md` (path-scoped Claude Code mirror — same rule, keep in sync).

- Semantic landmarks; one `h1` (hero name); logical heading order. Visible **accent focus ring** (ember `#E8380F` per design_system v2 §3.3 — the v1 "brass ring" wording is superseded; the ring is token-driven via `:focus-visible { outline: 2px solid var(--color-accent) }` either way); full keyboard nav; skip link.
- All media has descriptive `alt`; decorative duplicates `aria-hidden`. AA contrast (paper `#E4E4E4` on ink `#0A0A0A`).
- Media: `.avif`/`.webp`, explicit `width/height`, lazy below the fold. Preload display font.
- Code-split routes; keep GSAP timelines scoped + killed on cleanup.
- Target Lighthouse ≥ 90 across Performance, Accessibility, Best Practices, SEO.

**Why this matters here:** the site's identity is its motion — which is precisely what breaks for keyboard, screen-reader, and motion-sensitive visitors unless these floors hold. The shipped `Image` primitive (lazy default, quality 75, skeleton) and font pipeline (`@fontsource` + self-hosted General Sans, `font-display: swap`) exist to make the perf half achievable; the Hero QA round already caught overlay-focus and off-token regressions once. Claude Code mirror: `.claude/rules/accessibility.md`.
