/** Chapter 10 Workflow tunables — a pinned process rail. Five step nodes travel
 *  leftward along one dashed track; whichever is at horizontal centre is the
 *  active step, and its title + description resolve out of a blur below it.
 *
 *  Owner reference `reference/workflow-reference.mp4` (16s). Its rail carries 3
 *  steps; ours carries 5 (owner ask: Quality Testing + Maintenance after
 *  Development), so the spacing and pin length here are derived from ours, not
 *  copied from its frames.
 *
 *  ENGINE: Gallery's pin + exp-damp applier, via Articles — one ScrollTrigger
 *  scrub feeding a damped value applied by `gsap.quickSetter` on the single
 *  `gsap.ticker`. Freeze-on-pause and exact reverse retrace come free with it.
 *  What is deleted vs Articles: the measurement step. Articles measures
 *  `track.scrollWidth − innerWidth` because its travel depends on how many
 *  cards there are; here travel is choreography (n steps × `gap`), so every
 *  position is arithmetic and the only per-refresh read is `innerWidth`.
 *
 *  NOTHING here is a layout size. Node and bubble diameters and the 45% track
 *  height live in the section's class strings, where the responsive breakpoints
 *  are visible — Articles' documented rule for card widths, and the reason
 *  `discScaleFrom` below is annotated as coupled rather than free. */
export const WORKFLOW = {
  /** exp-damp factor on the master progress. 5, matching Articles rather than
   *  Gallery's 4.5, for Articles' reason: the payload is TEXT and text has to
   *  come to rest to be read. 4.5 leaves a visible float after the wheel stops. */
  damp: 5,

  pin: {
    /** Opening beat, in viewport heights: the playhead is held on step 1 while
     *  the intro card (eyebrow + statement + lede) blurs away and the rail
     *  fades up. Without it the chapter has no entrance — at progress 0 the
     *  rail would already be settled. 0.6 is two comfortable wheel flicks at
     *  Lenis `lerp 0.09`, enough to read the statement before it goes. */
    headVh: 0.8,
    /** Scroll cost of ONE step-to-step transition. Four transitions → 3.0vh;
     *  total pin 3.95vh, between Gallery's 3.4 and the Manifesto's 5.2. Below
     *  ~0.6 the titles strobe past unread; above ~0.9 the rail feels stuck. */
    perStepVh: 0.75,
    /** Rest beat on step 5 before the section unpins, so the last step is not
     *  snatched away mid-read. Shorter than Articles' 0.45 because the payload
     *  is one line, not a whole card.
     *  Unlike Articles this is a REAL hold: `TRAVEL_FRAC` excludes it from the
     *  playhead map, so the playhead reaches step 5 and then genuinely sits
     *  there. Articles' tail only slows its last card down. */
    tailVh: 0.35,
  },

  /** Horizontal spacing between adjacent step nodes, as a fraction of viewport
   *  width, clamped. The reference's neighbour bubbles sit ~190px out at a
   *  ~1000px stage ≈ 19vw.
   *  `min` 150: at 390px the neighbours land at ±150, i.e. spanning 126–174 from
   *  centre against a 195 half-viewport — both stay on screen, which is what
   *  makes the rail read as a rail on a phone and why there is no mobile branch.
   *  `max` 260: past this the neighbours drift into the corners of a 2560
   *  display and the cluster stops reading as one object. */
  gap: { vw: 0.19, min: 150, max: 260 },

  /** How far the icon bubble lifts above the node as a step becomes active, in
   *  px. DERIVED, not dialled: disc radius 64 (`size-32`) + ~24px clearance for
   *  the ember connector dot + bubble radius 24 (`size-12`). At the reference's
   *  own ~78 the bubble's bottom edge lands inside the disc — no room for the
   *  dot to exist between them. */
  liftPx: 112,

  /** Disc scale at rest, i.e. when a step is a neighbour rather than the active
   *  one. 48/128 = `size-12` / `size-32`, so the active fill blooms out of
   *  exactly the bubble's own footprint and shrinks back into it.
   *  COUPLED: change either size class in the section and this must change with
   *  it, or the bloom no longer starts where the bubble is. */
  discScaleFrom: 0.375,

  /** Resting opacity of a step two or more slots from centre. Low enough to
   *  read "not now", high enough that the track still looks populated. It never
   *  exposes text to a contrast failure: at this distance the fill wrapper is
   *  already at opacity 0, so the numeral simply is not drawn. */
  farAlpha: 0.18,

  /** Span of that ambient fade, in step units. 2 = twice the morph's own span,
   *  so distant steps ghost out gradually instead of hard-cutting at the
   *  neighbour boundary. */
  alphaSpan: 2,

  /** How close to centre (in step units) a step must be before its title and
   *  description show at all. Deliberately NARROWER than the node's own 1.0
   *  band, because the reference does not crossfade its titles THROUGH each
   *  other: measured across its 1→2 transition (`burst1`, 10 fps), "Diskusi"
   *  is fully gone for ~2 frames before "Perencanaan" starts arriving. Sharing
   *  the node's band put both titles at 0.5 on top of each other mid-transit,
   *  which renders as one illegible smear (screenshot `.artifacts/wf-mid12.png`
   *  from the first build).
   *  0.55 leaves a real dark beat between titles while still overlapping the
   *  node crossfade, so the disc keeps moving through a gap the copy takes. */
  copyBand: 0.55,

  /** Blur on an inactive step's title + description, in px. The house
   *  `blurFrom` is 6 for `--text-statement` words; a `--text-chapter` title
   *  needs slightly more to read as veiled rather than merely soft.
   *  This is also the paint-cost ceiling — the applier only ever lets two
   *  copies carry a filter at once, but raising this still costs on every one
   *  of those frames. Re-measure on Safari before going past ~10. */
  blurPx: 8,

  /** Statement de-veil, then the handoff to the rail. All four numbers are
   *  positions/durations on ONE paused timeline whose total is exactly 1.0, so
   *  `introTl.progress(p / HEAD_FRAC)` maps straight onto the opening beat.
   *
   *  KEEPING THE TOTAL AT 1.0 IS THE WHOLE CONTRACT, and it is easy to break.
   *  The first build used Articles' per-word `stagger: 0.09` with
   *  `duration: 0.5`; at 19 words that is a 2.12s cascade, GSAP sized the
   *  timeline to its longest child, and the handoff placed at "0.55" landed at
   *  26% of a 2.12s timeline instead of 55% of a 1.0s one — so the rail faded
   *  in over a statement that was still less than half revealed (owner bug
   *  report 2026-08-26, screenshot). `stagger.amount` is the fix: it spreads
   *  the starts across a FIXED window no matter how many words there are, so
   *  re-voicing `WORKFLOW_STATEMENT` can never re-break the timing.
   *
   *  Invariant to preserve: `wordSpread + wordDuration <= handoffAt` and
   *  `handoffAt + handoffDuration === 1`. */
  heading: {
    /** total spread of the word starts (NOT per-word) */
    wordSpread: 0.38,
    /** per-word de-veil duration → cascade ends at 0.60 */
    wordDuration: 0.22,
    /** ...then 0.08 of read beat before anything moves */
    handoffAt: 0.68,
    /** intro blurs out / rail fades in, landing exactly on 1.0 */
    handoffDuration: 0.32,
    blurFrom: 6,
  },
} as const;
