# MacBook corner render — canvas measured through the stage transform

- **Date:** 2026-07-13
- **Author:** main (Claude Code, user bug report #2)
- **Type:** fix
- **Chapter/Area:** 02 Manifesto — R3F island sizing

## Summary

Root cause of the "object sits in a corner for ~a second, then snaps to center" report — and this time reproduced and proven by numbers. R3F measures its container with `react-use-measure`, whose default reports `getBoundingClientRect` — **which includes CSS transforms**. Since the zoom-in seam rework, the stage sits at `transform: scale(0.14)` on load, so the canvas was sized to ~14% of the viewport (~200×113 CSS), anchored top-left inside the fullscreen stage — the scene rendered tiny in the corner. Scroll events triggered re-measures (`scroll: true`, 50ms debounce) that chased the growing scale until it snapped to full size ≈ when the seam completed. Fixed with one Canvas prop: `resize={{ scroll: true, debounce: { scroll: 50, resize: 0 }, offsetSize: true }}` — `offsetSize` measures layout dimensions (`offsetWidth/Height`), which ignore ancestor transforms.

## Files touched

- `src/features/home/components/manifesto-3d/ManifestoCanvas.tsx` — the `resize` prop (+ comment documenting the trap).

## Verification

- [x] Fresh load at scroll 0 (stage at scale 0.14): canvas buffer **2520×1410** (full res, dpr 1.75), CSS size 1440×806 — full from the first frame
- [x] Mid-zoom (stage scale 0.59): buffer unchanged — zero re-measure churn through the seam (and through the veil's 1.05 scale)
- [x] Mid-zoom screenshot: MacBook dead-center of the small box (the earlier "high-left in the box" artifact — previously misread as perspective — is gone)
- [x] `npx tsc -b`, `npm run lint`, `npm run build` green

## Notes

- This also explains the first "upper-right/center snap" report; the earlier by-construction hardening (aimCamera onCreated, primed damp values, size-derived fit clamp) remains correct and necessary for the mid-scroll-arrival cases, but the measurement trap was the visible culprit.
- Durable rule (memory): **any transform-scaled ancestor of an R3F Canvas requires `resize={{ offsetSize: true }}`** — the default gBCR measurement sizes the buffer to the transformed rect.
