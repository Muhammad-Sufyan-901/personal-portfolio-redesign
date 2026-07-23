# Journey card — 50vw width + bold reference-match ember bloom/aura

- **Date:** 2026-07-22
- **Author:** main (via /impeccable bolder)
- **Type:** style
- **Chapter/Area:** 05 Journey (eyebrow "08 — The Path")

## Summary

Follow-up to the same-day `2026-07-22-journey-overdrive-cards.md` restyle, which left an
explicit TODO ("glow intensity/height tunable... if the owner wants it livelier after
seeing it in situ"). The owner has now seen it and asked for the work/education cards to
be ~50% of viewport width on tablet/desktop, and to match an owner-supplied reference
image more closely: a bold bottom gradient (with bottom padding so it renders as a clean
band) plus a gradient aura/halo around the card. Confirmed via AskUserQuestion: keep the
color on-brand **ember** (not the reference's literal purple/blue — Void & Ember is
tokens-or-nothing, ember-only), and push the intensity to **bold**, knowingly reversing
this morning's "subtle" Scalpel-Rule pick.

## Files touched

- `src/features/home/utils/journey.tunables.ts` — `card` group: `glowDeep`/`glowAccent`
  raised (22/14 → 55/42), new `bloomHeight` (bottom-band clamp, decoupled from card
  height), new `auraDeep`/`auraAccent` for the outer halo.
- `src/features/home/sections/JourneySection.tsx` — work/education card branch only
  (award pills + all GSAP untouched): card wrapper widened to `w-full md:w-[50vw]`
  (was `max-w-xl`); split into an outer `journey-reveal` wrapper (unclipped, holds a new
  `aria-hidden` aura layer painted first/behind) + an inner `overflow-hidden` card (holds
  content + the bolder bottom bloom); inner card padding gets `pb-28 md:pb-36` so content
  clears the brighter bloom band.

## Notable decisions

- Aura and bloom stay `color-mix(in oklab, var(--color-accent[-deep]) N%, transparent)` —
  zero new tokens, zero raw hex, `globals.css` untouched (`--radius-card: 24px` already
  existed from the morning pass). Keeps the QA hex-grep clean and the re-theme story
  one-file.
- The GSAP slide-in target (`row.querySelector(".journey-reveal")`) stays on the outer
  wrapper, so the aura rides in in sync with the card — verified via computed-style probe
  (off-screen rows sit at `opacity:0` + `±120px`/`24px` transform pre-reveal, matching the
  reveal tunables exactly), not just visually.
- Aura layer has no z-index/blur: DOM order (aura first, card second) is enough for the
  card's opaque `bg-raised` to naturally occlude the aura under itself, so the halo only
  reads where it spills past the card edges — no stacking-context or filter cost.
- Card width uses `md:w-[50vw]` (viewport-relative, not container-relative) per the
  literal "50% of screen width" ask; `overflow-x-clip` already on the section (from the
  serpentine line) guards against any edge-case horizontal scroll — confirmed no overflow
  at 1440/768/390 via `document.documentElement.scrollWidth`.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] bare-tag grep and raw-hex grep clean on both touched files
- [x] Browser-checked via chrome-devtools MCP at 1440 / 768 / 390 — bold bloom band, aura
      visible around all four sides, 50vw on desktop/tablet, full-width on mobile, no
      horizontal overflow at any width
- [x] reduced-motion path unaffected by inspection (no GSAP touched; aura/bloom are plain
      static children, same as the existing bloom layer)
- [x] scrub reversibility unaffected: pre-reveal computed style on untouched rows matches
      the existing `JOURNEY.reveal` transform/opacity contract exactly

## Follow-ups

- None outstanding; the prior pass's TODO is resolved by this change.
