/** Chapter 04 Craft tunables — scroll-activated project index + path thread.
 *
 *  Path geometry is normalized to the index wrapper (viewBox "0 0 100 100" +
 *  preserveAspectRatio "none" — coordinates are percentages of the wrapper).
 *  Stroke width is a CSS length so it can track the viewport like the
 *  reference (~5vw: ≈96px @1920, ≈20px @390; non-scaling-stroke keeps it). */
export const CRAFT = {
  /** viewport-height fraction of the activation focal line (reference ≈ 0.55–0.6) */
  focal: 0.62,
  /** preview crossfade duration (s) — mirrors --dur-fast */
  crossfade: 0.4,
  /** enter-reveal stagger between rows (s) */
  rowStagger: 0.08,
  /** enter-reveal rise distance (px) */
  revealY: 28,
  /** per-row left-indent cascade (rem) — the reference's organic left-edge wander */
  indents: [0, 1.5, 3.25, 2.25, 4.25, 5.5],
  /** path-only handoff beat after the last row (owner decision e — full finale) */
  finaleRunway: "90svh",
  path: {
    /** Normalized 0–100 coordinates (absolute M/C only) — CraftSection scales
     *  them into pixel space against the measured layer (scalePathD), because
     *  Chrome's screen-space dashing fragments on stretched viewBoxes.
     *  Shape: enters off-canvas left near the list top, S-curves down the
     *  left/center behind the rows, then sweeps full-width through the finale
     *  runway and exits off-canvas right (reference: list → gallery handoff). */
    d: "M -6 10 C 16 13, 30 15, 30 21 C 30 27, 12 28, 11 35 C 10 42, 27 43, 26 49 C 25 55, 10 56, 12 63 C 14 70, 34 71, 50 78 C 68 85, 82 82, 106 76",
    strokeWidth: "clamp(1.25rem, 5vw, 6.5rem)",
    start: "top 75%",
    end: "bottom 92%",
  },
} as const;
