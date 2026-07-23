# Journey — 35vw card (full-width bloom) + measured center-zigzag line

- **Date:** 2026-07-23
- **Author:** main (via /impeccable)
- **Type:** feat
- **Chapter/Area:** 05 Journey (eyebrow "08 — The Path")

## Summary

Follow-up revision to the 2026-07-22 card passes, driven by a new owner reference image and
two explicit asks: (1) shrink the card to **35vw** on tablet/desktop (was 50vw) and swap the
interior bloom from two corner blobs to a **single full-width bottom band**, matching the
reference's silhouette (color kept ember, not the reference's purple/blue — tokens-or-nothing
holds); (2) rework the serpentine line so it **enters from the left, zigzags down the CENTER
COLUMN ONLY** (not a full-width sweep) while **visibly touching each card's inner edge**, then
**exits off-canvas right** through a finale runway once the content ends — mirroring how the
04 Projects thread hands off to Journey.

## Files touched

- `src/features/home/utils/path.ts` — new `buildZigzagPath(w, h, tips, opts)` (+ `ZigzagTip`/
  `ZigzagOptions` types), pixel-space builder that curves through measured card centers with
  vertical-tangent S-curves, entering/exiting off-canvas via `entryX`/`exitX`. `scalePathD`
  untouched (still used by Projects).
- `src/features/home/utils/journey.tunables.ts` — `line` group replaced its hand-authored
  full-width `d` string with `leftX`/`rightX`/`entryX`/`exitX` (fractions of layer width) +
  lighter `strokeWidth` (center-column thread, not the old 04-weight full sweep) + new
  `finaleRunway: "60svh"`. `card` group: doc comment updated for the full-width bloom;
  `auraDeep`/`auraAccent` bumped (26/20 → 32/26) to match the reference's stronger halo.
- `src/features/home/sections/JourneySection.tsx` — the `ResizeObserver` effect now also
  collects every `[data-side]` card's measured vertical center (`getBoundingClientRect()`
  relative to the line layer) into `lineTips` state; `PathDraw`'s `d` comes from
  `buildZigzagPath(lineBox.w, lineBox.h, lineTips, JOURNEY.line)` instead of a static
  `scalePathD` string. Card wrapper `md:w-[50vw]` → `md:w-[35vw]`. Interior bloom background
  swapped from two `radial-gradient` blobs to `linear-gradient(to top, …) + radial-gradient(…
  at 50% 100%, …)` for a full-width wash. New `aria-hidden` finale-runway spacer
  (`JOURNEY.line.finaleRunway`) after the `<ul>`, mirroring `ProjectsSection.tsx`'s
  `finaleRunway` spacer, so the line layer has room for its exit sweep.

## Notable decisions

- **Measured, not hand-authored.** Card heights vary 3–4× (a full highlights+stack card vs.
  an award pill vs. a one-line education card) and reflow per viewport, so a fixed-`y` path
  could not reliably "touch" every card. The line's tips are read from real DOM rects in the
  same `ResizeObserver` callback that already measures the line layer, then handed to the new
  pure `buildZigzagPath` builder — verified mathematically (not just visually) in the browser:
  every generated tip's `y` matched the corresponding card's measured center exactly, and tip
  `x` (0.4w / 0.6w) matched each card's true inner edge to the pixel (derived from `page-x +
  35vw` geometry, confirmed against live `getBoundingClientRect()` output).
- Tip x-columns stay **constants**, not measured — card reveals only translate X (never Y),
  so a measured x would jitter mid-scrub; only y (stable pre-reveal) is read from the DOM.
- Card `data-side` stays on the `<li>` (full row width) rather than the inner card — fine
  since only `.dataset.side` and the row's vertical center are read from it; x always comes
  from the tunable fractions.
- No `globals.css` change — bloom/aura/line all stay `color-mix` over the existing
  `--color-accent[-deep]` tokens.
- Mobile (`w-full` cards) is not special-cased: the zigzag still renders behind the full-width
  card at the same tip fractions; "touching an inner edge" is moot at full width, matching how
  the previous line already behaved on mobile.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] bare-tag and raw-hex greps clean on all three touched files
- [x] Browser-verified via chrome-devtools MCP at 1440 / 768 / 390: 35vw card, full-width
      bottom bloom + halo; math cross-check confirmed every zigzag tip lands exactly on its
      card's real inner edge (not just eyeballed); line stays center-column between tips
      (screenshotted mid-scrub); exit sweep runs through the finale runway to the right edge
      and clips cleanly (no h-scroll) at every width tested
- [x] scrub reversibility unaffected: pre-reveal computed style on untouched rows still
      matches the `JOURNEY.reveal` transform/opacity contract exactly (same probe as
      2026-07-22)
- [x] reduced-motion path unaffected by inspection — `PathDraw`, `usePrefersReducedMotion()`,
      and the reveal GSAP are untouched; the new tip-measurement and finale spacer are static,
      non-animated additions

## Follow-ups

- None outstanding.
