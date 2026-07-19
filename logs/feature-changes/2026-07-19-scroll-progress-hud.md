# Scroll-progress HUD (center-left % + center-right section indicator)

- **Date:** 2026-07-19
- **Author:** main
- **Type:** feat
- **Chapter/Area:** site chrome

## Summary

Added the deferred scroll wayfinding (PLAN.md "scroll-spy" item, reference lukebaffait.fr): a fixed center-left mono "(22)" overall page-scroll percentage and a fixed center-right current-chapter label + within-chapter accent progress track. Hidden over the hero, fades in at 0.45·vh mirroring MenuPopout (user's choice). Keys off whichever `navLinks` anchors are live in the DOM, so chapters 04–08 appear in it with zero changes.

## Files touched

- `src/components/shared/ScrollProgressHUD.tsx` — new; one global ScrollTrigger driver + live layout reads
- `src/components/layouts/RootLayout.tsx` — mount after `MenuPopout` inside the menu-inert Box (z-60, under SiteMenu z-80)

## Notable decisions

- **Live layout reads, not cached ScrollTrigger `.start` values.** First attempt used N position-only threshold triggers (`start: "clamp(top center)"`); browser probing showed their starts were stale — the HUD's effect runs before the sections' effects, the hero's scroll room IS a pin spacer that doesn't exist yet at that point, and no later full `ScrollTrigger.refresh()` re-measures (fonts-ready refresh can fire pre-mount when fonts are cached). Same staleness hit `end: "max"` / `self.progress` after the document height drifted post-refresh. Fix: a single driver trigger whose `onUpdate` reads everything live — section doc-tops via `getBoundingClientRect().top + scroll` (measuring the `.pin-spacer` parent when present, since a pinned element goes `position: fixed` mid-pin but its spacer stays in flow) and `ScrollTrigger.maxScroll(window)` for the percentage.
- Active chapter = last one whose mid-viewport threshold was passed (position-only, no `end` semantics) — the manifesto's multi-vh pin can't open a dead zone between chapters.
- DOM-ref writes only (`textContent` + `quickSetter` scaleY) — no React state at scroll rate; no store slice (derivable state).
- `aria-hidden` + `pointer-events-none` (SiteMenu is the real nav; `role="progressbar"` would churn announcements at scroll rate); hidden below `lg`.
- Reduced motion: HUD stays functional (wayfinding, like a scrollbar); only the label fade and reveal tween become `gsap.set`.

## Verification

- [x] `npm run build` (tsc -b + vite) clean
- [x] `npm run lint` clean
- [x] Browser probe (chrome-devtools MCP, 1440×900): Intro 0→1350, Who Am I through the full 520vh pin (no dead zone), About from 6030; bar math exact at every sample; true document bottom → "(100)" + full bar; hidden at top, visible past 0.45·vh; SiteMenu covers it; `display: none` at 800px width
- [x] Reduced-motion (matchMedia stub): page 2813px (no pins), HUD tracks correctly, instant show/hide, 100% at bottom

## Follow-ups

- Right-side indicator overlaps the About portrait (photo bleeds to the viewport edge) — ember fill on the red duotone is low-contrast there. Revisit if it bothers in QA (e.g. `mix-blend-difference` on the HUD root).
