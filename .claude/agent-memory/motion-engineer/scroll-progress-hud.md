# ScrollProgressHUD (2026-07-19, reworked 2026-07-20; replaces the scroll-spy TODO)

`src/components/shared/ScrollProgressHUD.tsx` — left-edge "(22)" page-% (`left-6`) + right-edge 70svh paper rail segmented ∝ chapter scroll spans (flexGrow per frame, elapsed fill scaleY, label rides the rail at overall-progress y), after-hero reveal à la MenuPopout. Keys off live `navLinks` anchors — future chapters (and renames, e.g. Craft→Projects) auto-appear without touching the HUD.

## CRITICAL pattern

Never cache ScrollTrigger `.start`/`self.end`/`self.progress` for cross-section math in chrome that mounts before the sections — the hero's scroll room IS a pin spacer that doesn't exist yet at chrome-effect time, and the fonts-ready refresh can fire pre-mount (cached fonts) so nothing re-measures. Read everything live in `onUpdate`:

- section doc-top = `getBoundingClientRect().top + scroll` of the `.pin-spacer` parent when present (a pinned el goes position:fixed mid-pin; the spacer stays in flow)
- page end = `ScrollTrigger.maxScroll(window)`
