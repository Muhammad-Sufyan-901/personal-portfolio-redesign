/** Chapter 09 Articles tunables — pinned section, article "clippings" scrub
 *  sideways past a fixed statement.
 *
 *  Why sideways at all: Journey (08) sits directly above and is entirely
 *  vertical — alternating landscape cards on an ember zigzag. A second
 *  vertical card chapter would read as more of the same. The rail borrows
 *  Gallery's proven pin + exp-damp grammar (freeze-on-pause, exact reverse
 *  retrace) but carries real, readable, clickable content instead of anonymous
 *  covers, and the clipping silhouette is a tall narrow COLUMN so the chapter
 *  reads as a different medium from the card above it.
 *
 *  Travel distance is MEASURED, not tuned — it is `track.scrollWidth −
 *  innerWidth`, so adding or removing an article in `articles.data.ts`
 *  re-lengthens the pin automatically with no number in this file to touch.
 *  Card widths are layout (Tailwind classes on the clipping), not tunables,
 *  for the same reason: they must stay in the responsive class string where
 *  the breakpoints are visible. */
export const ARTICLES = {
  /** exp-damp factor on the master progress. 5 matches the Skills arrow
   *  rather than Gallery's 4.5 — text has to come to REST to be read, and the
   *  slower factor left a visible float after the wheel stopped. */
  damp: 5,
  /** Extra pin runway past the last card, as a viewport-height multiple: the
   *  final clipping needs a beat at rest before the section unpins, or it
   *  reads as snatched away mid-read. */
  tailVh: 0.45,
  heading: {
    /** master-progress window over which the statement words de-veil. Front-
     *  loaded (unlike Gallery's 0.3→0.8) because here the heading is a fixed
     *  frame the cards travel past — it must be fully readable before the
     *  first clipping arrives, not competing with it. */
    revealSpan: [0, 0.16],
    /** per-word stagger inside the reveal timeline (duration-1 units) */
    wordStagger: 0.09,
    blurFrom: 6,
  },
  /** Counter-translation of each cover inside its frame, in px at the two
   *  viewport extremes (±). Deliberately small: this is depth, not motion —
   *  at 40+ the covers visibly slide against their own frames while you are
   *  trying to read the card. Set to 0 to remove the effect entirely.
   *
   *  HARD CEILING: the cover img is `scale-115`, i.e. it overhangs its frame
   *  by 7.5% per side — 22px on the narrowest card (78vw at 390px ≈ 304px).
   *  Raising this past ~20 exposes the frame edge at the travel extremes, so
   *  raise the img scale in the same commit if you raise this. */
  coverParallaxPx: 16,
} as const;
