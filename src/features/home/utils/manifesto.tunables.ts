/** Single source of truth for the hero→manifesto ENTRY choreography (T1) and
 *  the exit-veil retune — the center-born stage grammar (2026-07-17) that
 *  supersedes the E-refine slot rig. T2's story fractions stay in PHASE inside
 *  ManifestoSection; the `channels` singleton stays the 3D story's contract.
 *  Numbers start from the measured reference beat table
 *  (reference/manifesto-about-refine.mp4.mp4) — tune ONLY here. */
export const MANIFESTO_ENTRY = {
  /** T1 pin distance (ScrollTrigger end string — 120% of viewport = 120vh). */
  t1Span: "+=120%",
  /** Sub-beat windows as [start, end] fractions of T1 progress. Overlaps are
   *  intentional — the reference births the box while the name still shows. */
  beats: { rise: [0, 0.42], birth: [0.38, 0.55], growth: [0.5, 1] },
  /** Chrome fade window — must END before beats.birth[0] (acceptance gate:
   *  chrome fully gone before the box is born). Starts a hair after 0 so the
   *  scrub never renders it at rest (the preloader owns the chrome at load). */
  chromeFade: [0.02, 0.35],
  /** The h1's landing line: its center rests at this viewport-height fraction. */
  riseToY: 0.5,
  /** Birth box — the viewport-centered rect the stage is clipped to at birth.
   *  minWPx floors phone widths; maxHFrac caps short viewports (<700px). */
  birth: { wVw: 16, minWPx: 200, aspect: 1.5, maxHFrac: 0.38, radius: 12, fromOpacity: 0 },
  /** Entry-applier damp lambdas (MathUtils.damp style — match the T2 feel). */
  damp: { rise: 5, growth: 4 },
  veil: {
    /** T2-progress anchor where the veil begins (unchanged from the story build). */
    at: 0.84,
    /** Fast collapse: blur target + span as a fraction of the COMBINED
     *  120vh + 520vh runway (T1 span + manifesto height — keep in sync). */
    collapse: { blurPx: 28, span: 0.08 },
    /** About resolves FROM blur while the veil tail clears; `overlap` maps to
     *  About's scrub-trigger end (`top ${overlap * 100}%`). */
    aboutResolve: { blurFromPx: 14, overlap: 0.35 },
  },
} as const;
