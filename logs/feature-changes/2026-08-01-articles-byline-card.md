# Articles card → full-bleed byline card, and 12 placeholder entries

- **Date:** 2026-08-01
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 09 Articles

## Summary

The article card was a framed layout — cover photo on top, text block below
(meta → title → `Read ↗`). The owner asked for an Aceternity-style **author
card** instead: one full-bleed photograph with everything overlaid on it, byline
at the top, title + standfirst at the bottom, and a "View Details" affordance
under them. They also asked for 12 entries (up from 4) so the horizontal rail is
actually testable.

The rail engine is untouched. Travel is still measured (`track.scrollWidth −
innerWidth`), so going 4 → 12 articles lengthened the pin by itself: ~4 900px of
scroll at 1440px, ≈ 5.4 viewports.

The pasted reference was a Next.js component (`"use client"`, `next/image`,
`text-gray-50`, `bg-black`). It was adapted, not copied — primitives, tokens, no
new dependency — and it did **not** go in `src/components/ui/`, which is
shadcn-generated primitives only. A data-bound feature card belongs to its
section.

## Files touched

- `src/types/portfolio.ts` — `Article`: added required `description`; promoted
  `cover` from optional to required. Both tightenings are deliberate, so `tsc`
  fails loudly on any un-migrated entry.
- `src/features/home/data/articles.data.ts` — new `ARTICLES_AUTHOR` const;
  4 stubs → 12 placeholder entries; docblock rewritten to record the new
  ship-guard.
- `src/features/home/sections/ArticlesSection.tsx` — card markup replaced;
  `staticMode` branch on the `li` reworked; rail comment rewritten; `focusin`
  index→scroll mapping corrected.
- `logs/feature-changes/2026-08-01-articles-byline-card.md` — this file.
- `.claude/agent-memory/frontend-engineer/MEMORY.md` — Articles entry corrected.

## Notable decisions

- **Two prior decisions superseded, and rewritten rather than left stale:**
  1. *"No `summary`: the card is deliberately minimal (owner ask 2026-07-26)."*
     Reversed by the owner 2026-08-01 — the new card's whole premise is a title
     plus a line of context over the photograph.
  2. *"The cover absorbs whatever height is left after the text block."* Gone
     with the frame it described. The cover is `absolute` now, so it neither
     absorbs nor demands height; the in-flow content is byline + text block,
     pushed apart by `justify-between`. The 900px-clip / 1024px-oversize failure
     that once killed `aspect-*` on the cover cannot recur — there is no cover
     frame to size.

- **Cover is an `absolute inset-0` `Image`, not `style={{ backgroundImage }}`.**
  A CSS background gets no `loading="lazy"` (12 cards are all in the DOM at
  once), no `Image` error fallback, and would push the parallax onto
  `background-position` — a paint-layer property repainted every ticker frame
  instead of a composited transform.

- **"View Details" is a styled `Box as="span"`, not a shadcn `Button`.** The whole
  card is one anchor; a real button or link nested inside one is invalid
  interactive content, and it would add a second tab stop per card that the
  `focusin` handler assumes does not exist. Rejected alternative: un-link the
  card and stretch the CTA with `after:absolute after:inset-0` — it works, but
  the pseudo-element resolves against the nearest *positioned* ancestor, so the
  day someone adds `relative` to the content column two-thirds of the card
  silently stops being clickable. Noted as the upgrade path in a `ponytail:`
  comment for when a card needs two destinations.

- **No `author` field on `Article`.** Every piece is the owner's, so 12 identical
  `{name, avatar}` objects would be 24 duplicated strings and a lie about the
  shape of the data. One `ARTICLES_AUTHOR` const instead; the avatar reuses the
  About portrait, which chapter 03 has already fetched by the time this chapter
  scrolls into view, so the twelve 32px avatars cost one cache hit between them.

- **Permanent scrim, not a hover one.** The reference's overlay is `opacity-60`
  on a box whose `bg-black` only exists on `group-hover` — so at rest it is fully
  transparent and there is no scrim at all. Replaced with a permanent
  `from-ink via-ink/85 via-40% to-ink/25 to-80%` gradient: opaque under the text,
  a 25% floor up top so the photograph still reads. Hover is
  `group-hover:brightness-75` on the cover, so contrast only ever improves.

- **Contrast is bought locally, never globally.** A veil dark enough for the top
  of the card would drown the photograph. Bottom block rides the gradient
  (≈ 8.6:1 worst case); the byline gets its own `bg-ink/85 backdrop-blur-md` pill
  (≈ 7.4:1). `text-muted` is banned over a photo at `text-meta` — it needs 4.5:1
  and does not clear it — so the secondary line is `text-paper/70`.

- **Byline carries name + reading time only.** First build put
  `publication · date · readingTime` in the pill; it wrapped "7 min read" onto a
  second line at 390px and again at 1024×600, leaving one ragged pill in a rail
  of tidy ones. `publication · date` moved to a meta line above the title where
  the full card width is available (and hides under `max-height:768px`, where
  those pixels belong to the title and CTA). Side effect: the pill now matches
  the reference's shape exactly.

- **`focusin` index→scroll mapping fixed.** It mapped `index / lastIndex`,
  assuming the last card is reached at progress 1 — it isn't, `ARTICLES.tailVh`
  eats ~8% of the range, so every card landed short and the last landed past
  itself. Now derived from the card's own measured centre via `metrics`, which
  was already in closure scope. Latent before; 12 cards is what made it visible.

- **`articles.tunables.ts` unchanged.** Verified rather than assumed: the
  `coverParallaxPx: 16` ceiling note is still exact. Measured in-browser at
  1440px — cover 527.6px inside a 460.8px card = 33.4px of overhang per side
  against a 16px shift.

- **`scale-115` looked broken and is not.** Computed `scale` reads `none` because
  GSAP absorbs Tailwind's standalone `scale` property into the transform matrix
  it owns; the computed transform is `matrix(1.15, 0, 0, 1.15, 16, 0)` — scale
  and parallax both live. Worth knowing before someone "fixes" it.

- **Card radius 8px → 24px** (`rounded-lg` → `rounded-card`, owner ask, same
  day). Reused the existing `--radius-card` token rather than minting one — it
  is exactly "the card radius" in this system, and its *journey-only* note in
  `globals.css` was already stale (`ui/hover-card.tsx` is a second consumer).
  That comment now reads as a scope rule instead of an exclusivity claim: full
  card surfaces yes, controls/badges/hairline blocks no. No other change was
  needed — `overflow-hidden` was already on the link, so the absolute cover
  clips to the new corner by itself. Radius on the two inner pills is unchanged
  (`rounded-full`), which the softer card now sits with more comfortably.

- **`ARTICLES_STATEMENT` is real copy now** (owner ask, same day) — no longer a
  `TODO(owner)` placeholder. Written under the treatment `profile.skillsStatement`
  and `profile.journeyStatement` already use: **re-voiced from PRD facts only**,
  since the PRD carries no writing line to transcribe. "three years" → stats §2;
  "building for web and mobile" → role §2; "what I learned" → bio §2 ("keep
  learning something new"); "helps someone else" → tagline §2 ("help many
  people"). Focal word `learned` renders in the Instrument Serif italic device.
  Nothing in it claims a piece was published — that is the entries' job, and
  they are still placeholders.

- **Statement measure now responds to viewport HEIGHT, not just width.** Real
  copy is longer than the stub was: at 1024×600 the statement went from 2 lines
  to 4, and every line it takes comes straight off the pinned rail — cards fell
  from 293px to 234px, which squeezed the photograph out of a photo-led card
  entirely. Fixed at the cause (the 26ch measure), not by shortening the
  sentence: `[@media(max-height:768px)]:max-w-[58ch]` trades reading measure for
  height on short viewports, where horizontal room is exactly what is abundant.
  Cards back to 293px. This was latent — any real statement would have hit it;
  the stub was just short enough to hide it.

- **Covers are programming photography now** (owner ask, same day), which meant
  leaving Lorem Picsum: it serves random photographs by seed and cannot be
  steered to a subject. Switched to hot-linked Unsplash URLs, same
  `?auto=format&fit=crop&w=700&h=900&q=70` params for the 3:4 crop and a
  60–116 KB payload. **Every one of the 12 was `curl`-verified 200 before being
  written in** — a wrong ID is a silent grey fallback card, so a candidate pool
  of 20 was fetched, rendered to a contact sheet, and eyeballed before picking.
  Selected for darkness and *variety* (code screens, hardware macro, server
  room, desks, people) so the rail is not twelve identical editor screenshots,
  and loosely paired to each title — circuit macro on the bundle-size piece,
  server room on the migration piece, and so on.

- **Covers are damped at rest (`brightness-50`), not only on hover.** This is the
  consequence of programming imagery: most of the photos are screenshots of
  code, so the card title landed on top of *other legible text*
  (`<button class="add-memento">` sat directly behind "Strict mode is not the
  enemy"). No scrim tuning fixes that — the gradient runs bottom-up and never
  reaches the code behind the byline. Halving brightness makes the image read as
  texture and atmosphere, which is the only job it has here; hover deepens to
  `brightness-[.35]`, so contrast still only improves. The scrim also went
  `via-ink/85 → /90` and `to-ink/25 → /30`. **Rule worth keeping: a photograph
  that contains text is a different problem from a photograph that doesn't — the
  earlier landscape covers hid this entirely.**

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] `npm run build` clean (the >500 kB chunk warning is pre-existing —
      `ManifestoCanvas`)
- [x] DoD greps: 0 bare tags, 0 raw hex, 0 off-token palette classes, 0 stray
      `gsap` imports
- [x] reduced-motion checked — emulated `prefers-reduced-motion: reduce`: flow
      layout, no pin (page height 20 085 vs 30 713), cards untranslated at x=72,
      `aspect-[3/4]` capped to 544px by `max-h-[34rem]`, no progress rail
- [x] a11y checked in-browser — exactly **1 focusable per card** across all 12,
      `aria-label` on each, external links get `target="_blank"` +
      `rel="noopener noreferrer"`
- [x] viewports 390×844, 1024×600, 1440×900 — no overflow, title clamps at 2,
      description drops to 1 line under 768px tall, CTA always visible
- [x] legibility sweep on the brightest cover in the set (backlit grass, entry
      01) — title and standfirst both read
- [x] `transition-property` on the cover is `filter` only, never `transform`
- [x] zero console errors at every viewport
- [ ] Lighthouse ≥ 90 — deferred to the global QA pass, as for this whole chapter

## Follow-ups

- **Content is still placeholder.** All 12 entries are invented shapes, not real
  articles — the PRD defers a blog, so there was nothing to transcribe. The
  ship-guard is now the `https://example.com/…` urls plus the Picsum covers
  rather than the old `TODO(owner) —` string prefixes, which were dropped
  (owner decision) because ~15 characters of boilerplate per field distorted the
  two-line clamp the 12 entries exist to exercise.
- **`ARTICLES_STATEMENT` is now real copy** (see Notable decisions). It is a
  re-voicing of PRD facts, not the owner's own words — worth a read-through, and
  it is one line in one file to change.
- **Covers are hot-linked Unsplash URLs** (all 12 verified 200, 60–116 KB each).
  Two things to weigh before shipping: they are a third-party runtime dependency
  on `images.unsplash.com`, and they are generic stock — a real article deserves
  its own image. Swap for `public/assets/images/articles/*` when the real pieces
  land; the type accepts either. If they stay for a while, add
  `<link rel="preconnect" href="https://images.unsplash.com" crossorigin>` to
  `index.html` to save a DNS+TLS round trip.
- **`about-profile.png` is 1.6 MB** for a 32px avatar. Free here (chapter 03
  already fetched it) but a small crop is worth shipping at global QA.
- **Pin length:** ~4 900px at 1440px, ≈ 5.4 viewports, on a page that already
  pins the manifesto and gallery. Measured and working, but worth a look. If it
  drags, narrow to `lg:w-[clamp(18rem,26vw,26rem)]` — a pure class change, ~20%
  off the pin. Do **not** decouple x-travel from y-travel; the 1:1 mapping is
  what makes freeze-on-pause and exact reverse retrace read correctly.
- **Known and accepted:** the `ScrollProgressHUD` right-rail label overlays cards
  at the right edge while they travel (matches Gallery — pre-existing).
- **Out of scope, spotted in passing:** `ProjectsSection.tsx:270` has a literal
  `text-whiteß` typo (the class does nothing), and lines 238/254/270 use
  off-token `text-white`.
