# 02 Manifesto — pinned scroll-fill statement

- **Date:** 2026-07-08
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 02 Manifesto

## Summary
Built chapter 02 per PLAN v3.1 §3: the pinned scroll-fill statement (design_system §7.2/§11.2), re-applying the pre-reset recipe preserved in agent memory. Words are pre-split in JSX from `profile.manifesto.lines` (static data — no split-type, no revert cost); one scrubbed tween fills them `opacity 0.15→1` (stagger 0.06, `ease:"none"`) through a `start:"top top" end:"+=175%"` pin. The focal word "learning" carries a static `text-accent bg-accent-tint` ember wash so it reads correctly without JS. Replaced HomePage's temporary 150vh scroll runway with the real section.

## Files touched
- `src/features/home/sections/ManifestoSection.tsx` — new section (chapter shell `id="manifesto"`, eyebrow `02 — WHO I AM`, `Box as="h2"` statement at `text-statement` — not `Heading`, per the twMerge trap).
- `src/features/home/pages/HomePage.tsx` — mount `<ManifestoSection />`, delete the ponytail runway Box.
- `logs/qa-shots/manifesto-mid-pin.png` — mid-pin verification screenshot.

## Notable decisions
- Focal-word matching is punctuation/case-insensitive (`"learning," → learning`) so the data line's comma doesn't break the wash.
- `min-h-svh flex justify-center` on the section so the pinned statement sits centered for the whole scrub; statement capped `max-w-4xl`.
- Reduced motion = early return before any `gsap.set` — words are full-opacity in JSX, no pin/scrub at all (verified via a matchMedia-override initScript in Chrome).

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked — RM: no pin-spacer, all 21 words opacity 1; DoD greps clean (no raw hex / bare tags / off-token palette / stray ScrollTrigger import)
- [x] Lighthouse (dev server, desktop): A11y 100 · Best Practices 100 · SEO 100; scrub verified mid-pin (sequential fill, distinct opacities) and at pin end (all 1); console clean. Perf deferred to the whole-site audit (dev bundle unrepresentative).

## Follow-ups
- None for this chapter. Next per PLAN v3.1: 03 About.
