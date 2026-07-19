# Scroll HUD revision — left-edge alignment + segmented rail

- **Date:** 2026-07-20
- **Author:** main
- **Type:** feat
- **Chapter/Area:** site chrome

## Summary

User revision of the ScrollProgressHUD (shipped 2026-07-19). The left "(22)" percentage moves from `left-page-x` to `left-6` so it rails exactly with About's `(3+)` gutter echo (24px, matching the lukebaffait.fr reference). The right indicator becomes a 70svh white hairline rail at `right-6`, split into per-chapter segments whose heights are proportional to each chapter's scroll length; elapsed portions fill bright `bg-paper` over a `bg-paper/20` base, and the current-chapter label rides along the rail at overall-progress position (quickSetter `y`, `yPercent: -50` centering). Accent is gone from the HUD (user asked for white).

## Files touched

- `src/components/shared/ScrollProgressHUD.tsx` — left class swap + right rail rework; live-measurement driver unchanged

## Notable decisions

- 8 segments are rendered statically from `navLinks`; segments without a live anchor get `gsap.set(display: "none")` in `useGSAP` — future chapters light up with zero HUD changes, no React state.
- Segment proportions via per-frame `style.flexGrow = span` around constant `gap-1` gaps (spans only actually change on refresh; ≤8 writes/frame is negligible and avoids a separate refresh hook).
- Label travel = `overallProgress × rail.offsetHeight` — same live-read philosophy as the thresholds (no cached rail height).
- Fill/label/number writes remain direct DOM sets; reduced-motion branch unchanged (only the label fade and reveal tween become `gsap.set`).

## Verification

- [x] `npm run build` + `npm run lint` clean
- [x] Browser probe (1440×900): number left = 24px = About `(3+)` echo left; rail 630px/24px from right; 3/8 segments visible, heights 113/391/118 ∝ spans 1350/4680/1412; fills [1, 0.27, 0] mid-manifesto → [1,1,1] at bottom; label y exact (overall × 630) at every sample; "(100)" at true bottom
- [x] Reduced-motion (matchMedia stub): tracks on the 2813px static page, instant show/hide
- [x] Segments before first scroll are equal-height (flexGrow unset until first onUpdate) — invisible in practice: the HUD only reveals past 0.45·vh and the app lands every load at the hero top

## Follow-ups

- None. (The About-portrait overlap note from 2026-07-19 still stands, now milder — the rail is white, which reads better over the red duotone than the ember fill did.)
