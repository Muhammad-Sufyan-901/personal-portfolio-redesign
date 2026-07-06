# Accessibility & Performance

- Semantic landmarks; one `h1` (hero name); logical heading order. Visible brass focus ring; full keyboard nav; skip link.
- All media has descriptive `alt`; decorative duplicates `aria-hidden`. AA contrast (paper on ink).
- Media: `.avif`/`.webp`, explicit `width/height`, lazy below the fold. Preload display font.
- Code-split routes; keep GSAP timelines scoped + killed on cleanup.
- Target Lighthouse ≥ 90 across Performance, Accessibility, Best Practices, SEO.
