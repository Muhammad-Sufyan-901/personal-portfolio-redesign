/** Chapter 08 Journey tunables — intro + center-column zigzag ember line
 *  (measured-and-generated, owner ask 2026-07-23) + fully scrubbed zigzag
 *  card conveyor (owner overdrive 2026-07-22).
 *
 *  Choreography: the line enters off-canvas top-left and slopes down through
 *  an `entryRunway` into the center column (the mirror of its exit sweep,
 *  owner ask 2026-07-23), then zigzags straight down touching each card's inner edge
 *  (`buildZigzagPath` in `utils/path.ts`, tips = real measured card
 *  centers — a hand-authored path can't track viewport-dependent card
 *  heights); after the last card it sweeps out to the right edge through a
 *  finale runway (mirrors 04 Projects' path handoff). Each card's arrival
 *  side scrub-slides in from its OUTER edge (right cards from +x, left
 *  cards from −x) — damped via GSAP numeric scrub, so cards freeze
 *  mid-flight and retrace exactly while the undamped line leads. Awards are
 *  compact hover-invert moments between sweeps. */
export const JOURNEY = {
  /** Gallery-clone statement de-veil (owner overdrive 2026-07-22): centered
   *  serif-lead h2, words blur→clear on a scrubbed window (section not
   *  pinned, so the window is viewport-relative on the h2 itself). */
  heading: {
    start: "top 80%",
    end: "top 45%",
    /** per-word stagger inside the reveal timeline (duration-1 units) */
    wordStagger: 0.1,
    blurFrom: 6,
  },
  card: {
    /** glass sheen wash (2026-07-23, owner-approved) — diagonal paper-tint
     *  gradient stop %, clipped to the card; brightens slightly on hover
     *  via group-hover (CSS-only, no GSAP needed) */
    sheenPaper: 10,
  },
  /** "Moving dot card" frame (owner reference-image match, 2026-07-23) —
   *  a single top-left light source + 4 FULL-SPAN guide lines (the corner
   *  L-brackets they replaced are retired, owner ask same day: a solid border
   *  that fully surrounds the content, not just the corners), adapted from a
   *  borrowed 21st.dev idea per the animated-ui-references adaptation rule
   *  (GSAP, our tokens/primitives — no framer-motion, no tw-animate-css). */
  frame: {
    /** top-left radial light — color-mix % of accent into transparent */
    glowAccent: 30,
    glowSize: "70% 70%",
    /** inset of the 4 full-span guide lines from the card edge — this IS the
     *  "padding outside the border" the owner asked to grow (was 14px) */
    inset: "20px",
    /** full-span lines read heavier than the old fading stubs did, so both
     *  thickness and opacity come down (was 1.5px / 55) */
    thickness: "1px",
    opacity: 45,
  },
  /** perimeter-orbiting dot (owner: animate, 2026-07-23) — GSAP loop visiting
   *  the same 4 points `frame.inset` anchors the guide lines to (not a
   *  separate %-based inset — that put the dot's straight-edge legs right
   *  through the card's text padding), so it now rides ALONG those lines and
   *  parks on their intersections, as the reference image does; reduced
   *  motion renders it parked bottom-center, static, instead of running the
   *  loop. */
  dot: {
    size: "8px",
    fillOpacity: 90,
    glowOpacity: 60,
    /** seconds per leg — 4 legs per full loop */
    legDuration: 1.4,
  },
  /** mouse-follow 3D tilt + hover lift (2026-07-23, adapted from
   *  ProjectsSection's preview-tilt recipe — quickTo on rotationX/rotationY,
   *  per-card listeners since Journey has 6 independent cards vs. Projects'
   *  one preview panel). */
  tilt: {
    /** deg — matches the reference component's own "Max 5 degrees rotation" */
    max: 5,
    /** s — quickTo lerp, matches Projects' tilt feel */
    duration: 0.4,
    /** px — matches Projects' preview tilt */
    perspective: 500,
    /** px — hover Y lift */
    lift: -5,
  },
  line: {
    /** Tip columns as a fraction of the full-bleed line-layer width w.
     *  Geometry: page-x ≈ 5vw + card 35vw ⇒ a card's inner edge sits
     *  ≈0.40w (left card) / ≈0.60w (right card) — starting point only,
     *  tuned in-browser against real measured card rects so the stroke
     *  visibly overlaps each card's inner edge. */
    leftX: 0.4,
    rightX: 0.6,
    /** off-canvas entry (left) / exit (right) columns, fraction of w */
    entryX: -0.06,
    exitX: 1.08,
    /** center-column thread — lighter than the old full-bleed sweep */
    strokeWidth: "clamp(0.75rem, 2.5vw, 3rem)",
    start: "top 65%",
    end: "bottom 85%",
    /** path-only intro runway BEFORE the first row (owner ask 2026-07-23) —
     *  the mirrored entry sweep needs room to slope down gradually from the
     *  left page edge instead of diving across half a card */
    entryRunway: "40svh",
    /** path-only handoff runway after the last row (mirrors PROJECTS.finaleRunway) */
    finaleRunway: "60svh",
  },
  reveal: {
    /** per-row scrub window (row top crossing these viewport lines) */
    start: "top 88%",
    end: "top 45%",
    /** numeric scrub = GSAP's damped catch-up (the conveyor trail) */
    scrub: 1.2,
    /** card slide-in distance from its outer edge, px */
    x: 120,
    /** award moments rise instead of sliding */
    awardY: 24,
  },
} as const;
