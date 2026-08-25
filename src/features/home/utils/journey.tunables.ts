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
 *  mid-flight and retrace exactly while the undamped line leads. */
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
  /** Gradient-card treatment (owner reference match 2026-07-24, adapted from
   *  a borrowed 21st.dev "gradient card" per the animated-ui-references rule —
   *  recolored purple→ember, static CSS only; it retires the 2026-07-23 frame
   *  lines + orbiting dot). Ink card, ember bloom rising from the bottom
   *  corners, paper edge highlight, halo via box-shadow on the card itself. */
  card: {
    /** glass sheen wash (2026-07-23, owner-approved) — diagonal paper-tint
     *  gradient stop %, clipped to the card; brightens slightly on hover
     *  via group-hover (CSS-only, no GSAP needed) */
    sheenPaper: 10,
    /** bottom bloom radials — color-mix % of ember into transparent:
     *  bottom-right ellipse (accent), bottom-left ellipse (accent-deep),
     *  bottom-center circle (accent-deep) */
    bloomCornerAccent: 45,
    bloomCornerDeep: 55,
    bloomCenterDeep: 50,
    bloomBlur: "40px",
    /** The rim: ONE ring (border-only element + `RIM_FADE` mask) that follows
     *  the card's 24px radius — it replaces both the neutral `border-line`
     *  and the straight paper edge bar/ticks a rounded corner always clipped
     *  (owner ask 2026-07-24: brown, thicker, wrapping the bottom corners). */
    rimWidth: "2px",
    /** brown strength at the bottom — color-mix % of accent-deep. Tuned
     *  in-browser 2026-07-24: 85 read as a vivid orange-red outline, 55
     *  blended into the bloom; 70 keeps a defined edge that still reads
     *  brown. */
    rimOpacity: 70,
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
    /** center-column thread. Re-weighted 2026-07-25 (owner ask: thicker) from
     *  `clamp(0.75rem, 2.5vw, 3rem)` — the gradient cards outweighed it. */
    strokeWidth: "clamp(1rem, 3.5vw, 4rem)",
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
  },
} as const;
