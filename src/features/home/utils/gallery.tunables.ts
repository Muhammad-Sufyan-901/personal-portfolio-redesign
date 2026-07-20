/** Chapter 07 Gallery tunables — scroll-scrubbed cover conveyor + center heading.
 *
 *  Choreography (owner revision 2026-07-20 v3, matched to
 *  reference/gallery-refine.mp4): covers enter ONE BY ONE through the left
 *  screen edge and traverse the ellipse per item (conveyor into orbit) —
 *  bottom/near arc left→right, edge-on at the right edge (f014), one full
 *  back-arc lap, then FADE OUT at the right extreme, exiting in entry order.
 *  Entry order IS path order (the v1 all-at-once stream stays rejected; the
 *  v2 pop-in-at-slot is superseded). The statement de-veils once the train
 *  is mostly in. Covers hold a small STATIC z-tilt; they never rotate with
 *  the path. All chapter magic numbers live here; tune side by side with
 *  the video. */
export const GALLERY = {
  /** pin runway as a viewport-height multiple */
  pinRunway: 3.4,
  /** exp-damp factor on the master progress — the §7 weighted feel */
  damp: 4.5,
  /** conveyor path — all angle values in TURNS (converted to radians once in
   *  the section). Item i starts at (i ± spacingJitter)·spacingTurns and
   *  travels travelTurns along the ellipse: 0.5 turn to reach the right
   *  edge + one full lap ends back at the right extreme, where it fades. */
  path: {
    travelTurns: 1.5,
    /** gap between consecutive starts — the "one by one" trickle rate */
    spacingTurns: 0.14,
    /** ± slot fraction of jitter on each start (breaks the metronome;
     *  < 0.5 so entry order is never reordered) */
    spacingJitter: 0.25,
    /** fade-in over the first travel span (cover slides in edge-clipped) */
    entryFadeTurns: 0.06,
    /** fade-out over the last travel span (at the right extreme) */
    exitFadeTurns: 0.08,
    /** heading-alone beat after the last cover exits, before unpin */
    tailTurns: 0.06,
  },
  orbit: {
    /** ellipse radii as viewport fractions — radiusX 0.5 puts the extremes
     *  AT the screen edges so covers enter/exit through them (reference
     *  f056 shows covers clipped at both edges) */
    radiusX: 0.5,
    radiusY: 0.26,
    /** short-viewport clamp (px): the ring keeps at least this half-height so
     *  covers clear the heading's legibility box on ~700px viewports */
    minRadiusY: 190,
    /** per-item jitter — r: radius fraction, tilt: max static deg */
    jitter: { r: 0.22, tilt: 12 },
    /** train size (anonymous dummy cards — reference shows ~8–10 visible) */
    ringDensity: 10,
    /** cover base width (vw) + per-item size variance range */
    coverW: 14,
    sizeVariance: [0.78, 1.18],
  },
  depth: { scaleNear: 1.0, scaleFar: 0.62, opacityFar: 0.85 },
  /** perspective yaw while traversing: rotationY = −maxYaw · (x / half-vw) */
  curve: { maxYaw: 55, perspective: 900 },
  heading: {
    /** master-progress window over which the words de-veil — stretched
     *  slow (owner ask): starts once the train is mostly in, completes as
     *  the ring thins near the end of the pin */
    revealSpan: [0.3, 0.8],
    /** per-word stagger inside the reveal timeline (duration-1 units) */
    wordStagger: 0.1,
    blurFrom: 6,
  },
  /** reduced-motion static pose: whole train mid-flight (item 0 just short
   *  of its exit fade, none still hidden) */
  rmProgress: 0.5,
  mobile: { radiusX: 0.55, radiusY: 0.2, ringDensity: 6 },
  /** low-perf tier (≤4 cores): smaller train, narrowed depth range */
  lowPerf: { ringDensity: 6, scaleFar: 0.78 },
} as const;
