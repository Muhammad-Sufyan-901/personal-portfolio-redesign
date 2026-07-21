/** Chapter 06 Skills tunables — left sticky statement + scrubbed ember arrow,
 *  right all-open grouped accordion.
 *
 *  Beat map (dissected from reference/skills-refine.mp4 at 8 fps, 2026-07-21):
 *  the arrow enters FROM BELOW over ~1.5 s, settling into a lane at y≈0.65 of
 *  the viewport at x≈14vw; it scrubs right to ≈28–31vw (freeze verified at
 *  t≈9–12.5 s, exact reverse retrace at t≈18–20 s, forward/back play t≈20–26);
 *  it exits UPWARD with a slight rightward drift as the next chapter arrives.
 *
 *  All chapter magic numbers live here; the group order lives in `skillGroups`
 *  (data), and the accordion toggle duration is the `--dur-fast` token
 *  (globals.css keyframes) — CSS can't read this file. */
export const SKILLS_SECTION = {
  arrow: {
    /** Lane top is LAYOUT, not a tunable: the arrow flows after the CTA in
     *  the sticky h-svh column (≈67svh on tall viewports, clamping below the
     *  CTA on short ones — the measured centroid was ≈0.65). */
    /** CSS width of the arrow glyph (reference ≈9vw at 1920) */
    width: "clamp(5rem, 9vw, 11rem)",
    /** horizontal scrub travel in vw across the whole scrub window. The
     *  dissection shows x FIXED during entry and still DRIFTING during exit —
     *  enter/exit are the sticky lane scrolling in/out (layout owns y; the
     *  engine owns x only). Measured ≈14vw while pinned + ≈10vw over the exit
     *  window (cx 14→38). */
    travelVw: 24,
    /** exp-damp factor on the master progress (gallery precedent, §7 feel) */
    damp: 5,
  },
  accordion: {
    /** one-shot entry reveal (rows), seconds between rows */
    entryStagger: 0.07,
    itemReveal: { dur: 0.6, y: 12 },
    /** group-title font size — statement token nudged down (owner request
     *  2026-07-21: "4–8px smaller"); unitless token line-height/tracking
     *  still apply */
    titleSize: "calc(var(--text-statement) - 6px)",
  },
  logos: {
    /** owner-supplied full-color brand SVGs (src/assets/icons, 2026-07-21 —
     *  supersedes the monochrome react-icons treatment); rendered at this
     *  square size. The arrow is omitted below lg (no sticky lane in
     *  single-column flow), so there are no mobile arrow tunables. */
    sizePx: 16,
  },
} as const;
