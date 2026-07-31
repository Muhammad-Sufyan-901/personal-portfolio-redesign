# Articles: "View All Articles" action in the header, and taller cards

- **Date:** 2026-08-01
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 09 Articles

## Summary

Two owner asks on the chapter shipped in `e690d5d`:

1. A "View All Articles" action to the right of the section title, with
   space-between alignment.
2. Taller cards.

Both landed. The header is now a `justify-between` flex row, and cards gained
18–24% height across viewports.

## Files touched

- `src/features/home/sections/ArticlesSection.tsx` — header becomes a wrapping
  flex row with the CTA; pinned-branch vertical padding reclaimed; track
  `max-h` raised.
- `src/features/home/data/articles.data.ts` — new `ARTICLES_INDEX_URL`.
- `logs/feature-changes/2026-08-01-articles-cta-taller-cards.md` — this file.

## Notable decisions

- **The CTA reuses the house pattern, not a new one.** `MagneticButton`
  wrapping a `Link` whose inner `.magnetic-label` gets the counter-move — the
  same shape as About's "Download CV" and Skills' "Contact Me". Sized at
  `text-eyebrow` rather than About's `text-item`: it sits beside a
  display-scale statement and is a secondary path, so it should read as an
  offer, not compete for the same voice. Deliberately not a shadcn `Button` —
  its `default` variant is a full ember fill, which this chapter's Scalpel Rule
  note rules out.

- **`ARTICLES_INDEX_URL` is a placeholder, and has to be.** There is no
  articles index to point at: the PRD lists no blog, Medium, dev.to or Hashnode
  profile (§5/§6 defer a blog entirely), and the site is a single page with no
  `/articles` route. Rather than invent a destination or point the button
  somewhere wrong (the GitHub profile is not articles), it is an
  `example.com` url matching the entries' existing ship-guard. The common
  `Link` will classify a real URL as external and open it in a new tab with no
  code change.

- **`items-end`, not `items-center`.** The statement is a four-line block at
  1440×900; centring the action against it floats it in dead space. Sitting it
  on the last baseline reads as a deliberate pairing.

- **`flex-wrap` is load-bearing.** Below ~1024 the statement takes the full
  measure and the action drops beneath it, left-aligned, instead of crushing
  the statement's line length. Verified at 390 and 1024×600, where it wraps,
  and at 768/1440/1920, where it does not.

- **"Taller" meant reclaiming space, not raising the cap.** Measured first: at
  1440×900 the card was 383px, with header 372 + rail 57 + row padding 88
  consuming 517 of the 900. The `max-h-[34rem]` cap was not the binding
  constraint anywhere — at 1920×1080 it happened to sit at 544px against 545px
  of available height, so raising it alone would have bought exactly 1px.
  What actually moved the number:
  | Lever | Was | Now |
  | --- | --- | --- |
  | header top padding | `pt-[10svh]` | `pt-[6svh]` |
  | rail row padding | `pt-12 pb-10` | `pt-6 pb-6` |
  | progress-meter padding | `pb-10` | `pb-6` |
  | track ceiling | `max-h-[34rem]` | `max-h-[42rem]` |

  The cap still had to go up, or it would have swallowed the reclaimed padding
  before a pixel reached a card. Result: **1440×900 383 → 475px (+24%)**,
  **1920×1080 544 → 644 (+18%)**, **1440×760 430 → 516 (+20%)**, **390×844
  410 → 444**, **1024×600 293 → 317**.

- **Padding is lean on purpose now, and that is a rule for this section.** It
  is a pinned `h-svh` section, so every vertical gutter is subtracted directly
  from card height. Anyone adding breathing room here is taking it from the
  cards; both padding sites carry a comment saying so.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] `npm run build` clean
- [x] DoD greps: 0 bare tags, 0 raw hex, 0 off-token palette classes
- [x] CTA geometry measured at 390 / 768 / 1024×600 / 1440×900 / 1920×1080 —
      never overflows the viewport, never collides with the ScrollProgressHUD
      right rail (47px clear at 1440), wraps only below 1024
- [x] card height measured at all five viewports, up everywhere (table above)
- [x] reduced motion re-checked — flow layout, no pin, zero console errors
- [x] zero console errors at every viewport
- [ ] Lighthouse ≥ 90 — still deferred to the global QA pass

## Follow-ups

- **`ARTICLES_INDEX_URL` needs a real destination** before this chapter ships.
  It is one line in `articles.data.ts`.
- **Cards are still near-square at 1440×900** (461×475, ratio 1.03) even after
  the height gain — the header cannot give up more without damaging the
  statement. The remaining lever is *width*: narrowing to
  `lg:w-[clamp(18rem,26vw,26rem)]` makes them read properly portrait (≈374×475,
  ratio 1.27) and, as a bonus, cuts roughly 20% off the pin length flagged in
  `2026-08-01-articles-byline-card.md`. Not applied — the ask was "taller", and
  narrowing changes how many cards are in frame, which is a layout call.
- At 1024×600 the statement's `max-w-[58ch]` short-viewport override now forces
  the CTA to wrap. Accepted: two statement lines plus a wrapped CTA is shorter
  than four statement lines with the CTA inline.
