# 04 Projects — scroll-activated index (2026-07-20; renamed from Craft same day)

File `sections/ProjectsSection.tsx`, selectors `.projects-*`, anchor `#projects`, tunables `utils/projects.tunables.ts` (`PROJECTS`). Owner revision 2026-07-20 removed everything above the index (RevealText "Web & Mobile" headline, Web/Mobile pillars grid, keyword Marquee — skills content waits for chapter 06); rows widened to `py-10 md:py-14` via a shared `rowPad` const.

## Activation

- Per-row `ScrollTrigger.create` focal band (`start/end: "top|bottom ${PROJECTS.focal*100}%"`, onToggle → React `activeIndex`) + ONE list-level trigger on `.projects-rows` clearing to null outside the list (above the list / in the finale).
- Drives: row brighten/scale (CSS `transition-[color,scale]` — **v4 scale utilities set the standalone `scale` property, NOT transform**), description `grid-rows-[0fr→1fr]` expand. Tech badges (Simple Icons via `react-icons`, map `utils/tech-icons.ts`) live INSIDE the same expanding container — no own animation, statically expanded under RM for free.
- `displayIndex` is held (never cleared) so the preview counter doesn't flash a wrong number during fade-out.

## Preview crossfade (useGSAP block 2)

GSAP `autoAlpha` on `.projects-preview` (panel) + per-`.projects-preview-layer` keyed on activeIndex; layers start CSS-hidden `invisible opacity-0`. **Deliberately NO `revertOnUpdate`** — reverting snaps the outgoing layer to its CSS-hidden state and flashes the box through black; `overwrite:"auto"` + the RM `hidden` class cover it.

## Preview mouse tilt (useGSAP block 3 — separate on purpose)

- A THIRD block so it never re-runs on `activeIndex`: `gsap.quickTo` rotationX/rotationY on `.projects-preview-frame`, `transformPerspective` set on the frame itself (no parent style needed).
- **Listeners (mousemove/mouseleave) go on the SECTION** — the panel is `pointer-events-none` + aria-hidden, so it never receives mouse events.
- Rotation-only, so it can't fight the crossfade's autoAlpha; safely uses `revertOnUpdate: true` (rotation snapping to 0 on an RM toggle is correct). quickTo's duration IS the lerp.
- Tunables `PROJECTS.tilt { max: 7 (deg/axis), duration: 0.6 (s), perspective: 500 (px — bigger = subtler) }`.

## Path thread + finale

PathDraw px-space thread behind the rows (ResizeObserver-measured layer + `scalePathD` — see the PathDraw primitive entry's two gotchas); finale = 90svh empty runway the path sweeps through and exits right (no pin).

## Gotchas

- react-icons 5.7.0: **type declarations export `SiCss3` but the runtime module only has `SiCss`** (Simple Icons v14 rename) — tsc passes while the browser throws. Caught only by live smoke.
- Dev-only `window.__ScrollTrigger` handle in `lib/gsap.ts` (`import.meta.env.DEV`) for MCP smoke probes of live trigger start/end/progress.
