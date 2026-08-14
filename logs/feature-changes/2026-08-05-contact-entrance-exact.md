# 10 Contact — entrance matched frame-for-frame to `contact-refine.mp4`

- **Date:** 2026-08-05
- **Author:** main
- **Type:** fix
- **Chapter/Area:** 10 Contact (motion)

## Summary

The circle wipe shipped 2026-08-04 was derived from the whole-site recording at 1:11, where the
transition occupies a small part of the frame. The owner supplied a dedicated recording
(`reference/video/sections/contact-refine.mp4`, 27.5 s, 1920×1080, 48.9 fps) and asked for an exact
match. Frame analysis of the wipe window (t = 3.5–8.5 s, extracted at full rate into the session
scratchpad — the repo's `reference/` tree was not touched) showed the concept was right and three
measurable properties were wrong. All three are fixed; nothing else about the chapter changed.

## The three deltas

1. **Only the circle should be light.** Reference frame `b_0045` (t = 4.40 s): the disc spans just
   x≈625–1300 at the viewport's bottom edge and **both bottom corners are dark**. The previous build
   let the sheet paint its own `bg-invert-bg` the moment its top edge entered the viewport, so the
   screen read as a rising light **rectangle with a bulge on top** — not a circle. This was the
   actual visual mismatch the owner was seeing.
2. **The wipe ran ~2× too slow.** Measured rate: radius grows 2.63 px per 1 px of scroll
   (r 178 → 780 across 229 px of scroll). Cover radius at 1920×1080 is `hypot(960,1080) = 1445`, so
   the wipe completes in ≈ 549 px ≈ **0.51 viewport**. The trigger ran `top bottom → top top`, a full
   viewport.
3. **The heading slide was ~6× too short.** The reference enters from beyond the right viewport edge
   and decelerates hard over ≈ 1.2 s (left edge 1655 → 995 → 840 → 390 → 200 across t 5.15–6.03 s).
   The build used `xPercent: 20` ≈ 259 px over 0.6 s — a nudge, not a slide.

## Files touched

- `src/features/home/sections/ContactSection.tsx` — sole code change (below).
- `.claude/agent-memory/motion-engineer/circle-wipe.md` — recipe updated with the layer model and
  pacing; the old version documented the `top top` end and said nothing about the sheet background,
  which is precisely the trap that made the wipe read as a rectangle.

## Notable decisions

- **The layer model is the fix for #1, and it needs no mid-animation z-index juggling.** The sheet
  gets a *static* `relative z-50` (above the `z-40` disc) and its background is held **transparent**
  until the handoff:

  | phase | disc | sheet bg | sheet content |
  | --- | --- | --- | --- |
  | wipe (`top bottom` → `top 50%`) | growing | transparent | `autoAlpha: 0` |
  | beat (`top 50%` → `top top`) | held at cover | transparent | timeline plays |
  | settled (past `top top`) | hidden | opaque | visible |

  During the wipe the sheet is above the disc but paints nothing, so the only light thing on screen
  is the circle. Because the sheet is *above* the disc, the heading can slide in over a full-cover
  disc while the sheet is still transparent — which is how the beat starts at full cover yet
  finishes before the sheet has travelled to the top of the viewport.
- **Transparency is set in JS, not the class list** (`gsap.set(sheet, { backgroundColor: "transparent" })`,
  after the reduced-motion early-return). The `bg-invert-bg` class stays the default so the
  reduced-motion and no-JS paths render an opaque sheet, and `useGSAP`'s revert restores it.
- **The handoff is a real `ScrollTrigger.create`, not the scrub's `onLeave`.** It has to resolve
  correctly when the page loads *already scrolled into the section*; ScrollTrigger evaluates
  `onEnter` against the current position on refresh, a scrub's `onLeave` does not. Requires importing
  `ScrollTrigger` from `@/lib/gsap` (permitted — that module re-exports it; `ArticlesSection.tsx:112`
  is the precedent).
- **`overflow-x-clip` restored on the sheet.** It was removed on 2026-08-04 along with the 130vw
  dome, but a full-viewport heading slide re-introduces real horizontal overflow.
- The eyebrow now **trails** the heading (`-=0.75`) instead of leading it — the video shows "Contact"
  first and everything else after.
- Content still starts strictly at full cover. The video actually begins the heading ~3 frames
  (60 ms) before the last corner fills; firing exactly at cover satisfies the owner's stated
  requirement and is visually indistinguishable.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] Browser QA via puppeteer-core (chrome-devtools MCP could not attach — a browser already owned
      its profile; used the `qa-auditor/runtime-smoke-testing.md` fallback). Probes parked at exact
      trigger positions via the dev-only `window.__ScrollTrigger` handle rather than guessed offsets:
  - **`b_0045` assertion** — screenshots at 35 % / 60 % / 85 % of the scrub show a clean circle with
    dark on both sides at the bottom edge and no light rectangle. Sheet `backgroundColor` reads
    `rgba(0,0,0,0)` throughout the wipe.
  - **Pacing** — scrub distance 450 px against a 900 px viewport = **exactly 0.5 viewport**.
  - **Ordering** — heading opacity 0 at 35 %, 60 %, 85 %, 90 % and at cover; then the slide starts at
    `m41 = 1440` (= `innerWidth`, fully off-screen) and decelerates 1158 px over the first four
    sampled frames vs 1 px over the last four, settling at `matrix(1,0,0,1,0,0)`.
  - **Handoff** — swept ±120 px across `top top`: at every offset ≤ 0 the sheet is transparent *and*
    the disc is visible and covering; from +8 px the sheet is opaque *and* the disc is hidden.
    Zero frames with a transparent sheet and no covering disc → **no dark flash is possible**.
  - **Overflow** — `scrollWidth === innerWidth` at 1440 and 390, `scrollX` 0 after `scrollTo(80,0)`.
  - **Reduced motion** — no disc, sheet `rgb(232,232,232)` (never transparent), heading
    `transform: none` / opacity 1, words, panels and form all visible.
  - **Deep-link load** — refreshed while parked inside the section: sheet opaque, all four corners
    resolve to the sheet, heading visible. (This is what the `ScrollTrigger.create` exists for.)
  - Zero console/page errors across all four browser contexts.
- [ ] Lighthouse ≥ 90 — **not re-run.** Last measured 2026-08-03 (a11y 98 / BP 100 / SEO 100). This
      change is motion-only: no DOM added, no new interactive surface.

## Follow-ups

- Unchanged carries from 2026-08-04: `GradientPanel` is still the owner's placeholder for real
  artwork; the form still needs one live send with real `VITE_EMAILJS_*` keys; `mt-[70svh]` is
  unconditional including under reduced motion.
- Pre-existing, untouched: ProjectsSection `as="h3"` heading order; Articles card label/content name
  mismatch; cold-reload skeleton pulse churn; bundle split + favicon/OG at final QA.
