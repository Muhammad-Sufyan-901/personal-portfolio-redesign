# Journey — connector dot, heavier line, badge icons, title scale

- **Date:** 2026-07-25
- **Author:** main
- **Type:** style
- **Chapter/Area:** 05 Journey (on-screen 08)

## Summary

Five owner-requested refinements after in-browser review of the 2026-07-24 gradient-card pass. The drawn line tucks under each card's inner edge, but nothing marked the join — it read as the card covering the line rather than sitting on it, so a pulsing connector node now marks the contact point. The line itself was outweighed by the new heavy cards and got thicker; the stack pills gained the brand glyphs 04 Projects' identical pills already had; the bullet markers went from near-invisible `faint` to ember; and the card title was re-weighted against its body copy. No choreography, data, or type changes.

## Files touched

- `src/features/home/sections/JourneySection.tsx` — connector dot (new, sibling of the tilt box inside `.journey-reveal`); title `text-item font-medium` → `text-[length:calc(var(--text-body)*1.5)] font-semibold leading-tight`; bullets `marker:text-faint` → `marker:text-accent`; stack pills map now looks up `TECH_ICONS` and renders a `size-3` glyph.
- `src/features/home/utils/journey.tunables.ts` — `line.strokeWidth` `clamp(0.75rem, 2.5vw, 3rem)` → `clamp(1rem, 3.5vw, 4rem)` (~40% heavier; 50px @1440).
- `src/features/home/utils/tech-icons.ts` — +5 entries for Journey's stacks (`Firebase`, `MySQL`, `Angular`, `GraphQL`, `Jira`); doc comment now says Projects **and** Journey. `Docs` stays text-only (no Simple Icon, same as `Blade`).

## Notable decisions

- **Dot needs no measurement.** The row `li[data-side]` is `flex items-center` and is itself what the ResizeObserver measures for the line tip, so `top-1/2` on `.journey-reveal` IS the tip's y. Rejected: a second measurement pass / passing tip coords back down as props.
- **Placement is a sibling of `.journey-card-tilt`, not a child** — the tilt box is `overflow-hidden` and would clip a half-outside dot. Inside `.journey-reveal` it also rides the ±120px scrub slide-in, so the node travels with the card and lands on the line.
- **`ring-ink` on the core is load-bearing, not decoration.** First render had an ember dot on an ember stroke and the node dissolved into the line it was meant to mark; a 3px ink gap is what makes it read.
- **Reduced motion via the `motion-safe:` variant, not `usePrefersReducedMotion`.** The pulse is a CSS loop, so Tailwind's `@media (prefers-reduced-motion: no-preference)` wrapper is the whole fallback — no hook, no GSAP, no JS branch. Verified in the compiled CSS.
- **Dot is `hidden md:block`.** Below `md` the card is `w-full` while tips stay at `0.4w`/`0.6w`, so the card edge is nowhere near the line — a dot there would point at nothing.
- **Title size derived, not hardcoded:** `calc(var(--text-body)*1.5)` keeps the owner's "1.5× the description" literal and survives a type-scale re-theme. `leading-tight` is required — an arbitrary font-size does not carry `--text-body--line-height`. The `length:` hint stops Tailwind parsing the `calc()` as a color.
- Reused `TECH_ICONS` + the exact `ProjectsSection.tsx:212–234` badge shape rather than a second lookup map.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] Computed values at 1440px: title 24px / weight 600, body 16px → ratio exactly **1.500**; marker `rgb(232, 56, 15)`; badge `<svg>` present; ping animation running.
- [x] Both sides verified in-browser: dot on the card's left edge for `side="right"`, right edge for `side="left"`, sitting on the stroke through the scrub slide-in.
- [x] 390×844: dot `display: none`, nothing else shifts.
- [x] reduced-motion: `.motion-safe\:animate-ping` confirmed nested in `@media (prefers-reduced-motion: no-preference)` — ring renders static, dot still present.
- [x] Hygiene greps clean on all three files (no raw hex, no bare tags).
- [ ] Lighthouse — not re-run (cosmetic-only diff, no new JS or network work).

## Follow-ups

- `line.strokeWidth` and the dot's `size-4` / `ring-[3px]` are eye-tuned — adjust with the owner in-browser if the node reads heavy at other widths.
- The impeccable design hook flags `RIM_FADE`'s `rgb(0 0 0 / 0.12)` (JourneySection L23–24) as an off-palette color. It is an **alpha mask stop**, not a color — false positive, pre-existing, left unchanged.
