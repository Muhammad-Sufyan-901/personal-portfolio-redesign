# Journey award pills — hover card explaining the achievement

- **Date:** 2026-07-25
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 08 Journey (award rows), `src/components/ui`, tokens

## Summary

Owner ask: hovering an award in the Journey timeline should reveal a card explaining the achievement. The three award rows previously rendered as compact hover-invert pills carrying `title · org · period` and nothing else. They now wrap a Radix HoverCard whose panel is a shrunken sibling of the journey card (Award icon badge, title, issuer · date, divider, summary, ember-marker bullets).

Blocker hit during planning: **there is no award explanation text anywhere in the project.** PRD §3.5 is three bare lines — title, issuer, date — all of which the pill already showed, and `.agents/rules/content-integrity.md` forbids inventing award facts. Owner chose (2026-07-25) to ship the interaction on `PLACEHOLDER — owner to replace` copy, following the exact convention the two education `highlights` already use.

## Files touched

- `src/components/ui/hover-card.tsx` — **new.** shadcn-shaped Radix HoverCard (`HoverCard` / `HoverCardTrigger` / `HoverCardContent`), hand-written rather than `npx shadcn add`-then-rewrite. Imports from the unified `radix-ui` package per the `accordion.tsx` precedent. Defaults `openDelay 120` / `closeDelay 80` / `sideOffset 12` / `collisionPadding 16`; content styled to tokens (`bg-raised border-line text-paper rounded-card`).
- `src/styles/globals.css` — added the `--animate-hover-card` token + `hover-card-in` keyframes (fade + 0.96 scale + 4px rise), plus a reduced-motion redefinition of the same keyframe.
- `src/features/home/data/journey.data.ts` — the three award entries gained `summary` + two `highlights` each, every one PLACEHOLDER. Header note extended to cover awards.
- `src/features/home/sections/JourneySection.tsx` — award branch only: pill wrapped in `HoverCard` / `HoverCardTrigger asChild` + `tabIndex={0}`; new `HoverCardContent` panel. `Award` added to the lucide import.

## Notable decisions

- **`tabIndex={0}` on the pill is load-bearing, not decoration.** Radix HoverCard opens on **focus** as well as hover, so one attribute buys keyboard access *and* touch access (a tap focuses) for a primitive that is otherwise pointer-only — and it retires the pill's long-standing lack of any keyboard affordance (noted in `2026-07-22-journey.md`, where award rows were deliberately left non-focusable *because* nothing was hover-gated; that premise no longer holds).
- **Reduced motion via a media-query `@keyframes` redefinition**, not a `motion-safe:` / `motion-reduce:` class pair. One token, one utility class, and the panel still reveals on opacity alone. **Verified in the browser** that both definitions survive Tailwind v4's build and reach the CSSOM — worth knowing, since Tailwind hoists theme-referenced keyframes and could plausibly have dropped the nested copy.
- **No `tw-animate-css` classes.** shadcn's stock hover-card ships `animate-in fade-in-0 zoom-in-95`; that package is uninstalled here, so those are dead classes — the same trap `tooltip.tsx` is already sitting in (it still carries them, but has zero call sites so it never showed). Same fix as the accordion: real keyframes in `globals.css`.
- **Pill hover changed from near-white invert to FULL EMBER** (owner ask, same day — the panel was built first against the original `hover:bg-invert-bg` echo of design_system §450, then the owner asked for orange). `hover:bg-accent hover:border-accent hover:text-ink`. Consequence worth recording: `--color-invert-bg` / `--color-invert-text` now have **no consumer anywhere in `src/`**; they stay defined in `globals.css`, reserved for the planned 08 Contact section invert. This is a deliberate divergence from design_system §450, which still describes award rows as carrying the hover-invert micro-echo.
- **Three knock-ons of the ember hover, none of them polish:**
  - The dot is ember at rest, so it needed `group-hover:bg-ink` or it dissolved into its own pill.
  - The pill needed `ring-[3px] ring-transparent hover:ring-ink` — **the identical problem the connector node already solves at `:304`** ("dot and stroke are both ember, so without an ink gap the node dissolves into the line it is meant to mark"). The `<ul>` is `z-10` over the line layer, so an ember pill sits on the ember zigzag and the two fuse where the stroke crosses. Transparent at rest so only the colour transitions; invisible against the ink page.
  - The meta line's `group-hover:text-invert-text/70` became full `text-ink`. **Measured, not guessed:** ink at 70% over ember is ~3.5:1, under AA for 12px text; full ink is **4.72:1** (verified in-browser). Ember is dark enough that ink passes AA but `text-paper` would NOT (3.30:1) — a useful ceiling for any future `bg-accent` fill.
- **Portalled content**, which is what lets the panel escape the section's load-bearing `overflow-x-clip`. An in-flow absolute panel would be cropped on the pill row.
- **No sub-component extraction, no GSAP.** One call site, and the section's own precedent is a single flat file; CSS `data-[state]` covers the motion without a second reduced-motion branch.
- **`HoverCardContent` has no `role` and Radix wires no `aria-describedby`** — that is Radix's documented position (hover cards are supplementary, not critical, content). Acceptable here *because* the summary is enrichment: the pill itself still carries the complete PRD facts. Revisit if the panel ever becomes the sole carrier of a fact.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked — reduced-motion keyframe confirmed present in the CSSOM (opacity-only); focus opens the panel with the 2px ember `:focus-visible` ring; 390×844 touch viewport opens on tap, panel fits (41→349 of 390) with no horizontal page scroll
- [x] Hover verified on all three pills at 1440×900: panel opens, pill goes full ember with ink text/dot/ring, no clipping, no fusing with the zigzag
- [x] Contrast measured in-browser from computed styles, not estimated — title and meta both **4.72:1** on the ember fill (AA pass for normal text)
- [x] **Scroll tracking under Lenis** (the one flagged risk): panel holds `centerDelta 0` against the trigger and re-runs collision detection mid-scroll, flipping `top`→`bottom` when headroom runs out — correct behavior, not drift
- [x] QA greps clean — no bare tags in `src/features`, no new raw hex
- [ ] Lighthouse ≥ 90 — deferred to `/qa-audit`, no section shipped here

## Follow-ups

- **The nine PLACEHOLDER strings are the deliverable's open end.** Owner supplies the real award accounts; ideally they land in **PRD §3.5** first so `journey.data.ts` returns to transcription-only. Until then the Journey data file carries five placeholder blocks total (three awards + the two pre-existing education `highlights`).
- `src/components/ui/tooltip.tsx` still carries dead `tw-animate-css` classes and zero call sites. Not touched — out of scope, but it will render unanimated the first time anyone uses it.
