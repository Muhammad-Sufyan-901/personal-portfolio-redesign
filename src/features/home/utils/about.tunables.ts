/** Single source of truth for the About refine choreography (H1 word-blur
 *  reveal, description + finale beats on own-position triggers, D4 ember-glow
 *  portrait + focus blur). Headline spans are fractions of About's
 *  entry-reveal progress (`top bottom` → `top overlap%`, owned by
 *  MANIFESTO_ENTRY.veil.aboutResolve.overlap — the G seam contract). Numbers
 *  start from the measured reference beat table (reference/about-refine.mp4)
 *  — tune ONLY here. */
export const ABOUT_REFINE = {
  headline: {
    blurFromPx: 12,
    yDrift: 14,
    /** VISIBLE reveal window — the statement resolves word-by-word while it
     *  sits mid-viewport (reference Image #2), not below the fold. */
    span: [0.3, 0.75],
    /** Words concurrently mid-resolve — the soft sharp→blur boundary width. */
    trail: 3,
  },
  description: {
    blurFromPx: 10,
    lineStagger: 0.12,
    /** v4: own-position reveal range (the section is >100vh now — the
     *  headline→description gate is physical layout distance, no runway
     *  math). `spanVh` = scrub length as a viewport fraction. */
    reveal: { start: "top 85%", spanVh: 0.5 },
  },
  /** Odometer-ignition finale (overdrive 2026-07-19, supersedes the old
   *  `finale` block-reveal) — ONE scrubbed master timeline on the
   *  .about-final trigger; cards ignite in staircase order (shell → border
   *  draw → digit roll → glare sweep), the version line rides the tail.
   *  LAST-SECTION CONSTRAINT: `trigger.end` must resolve ABOVE max scroll or
   *  the tail hygiene sets never fire — invariant: finale height + space
   *  below it ≥ (1 − endFraction)·viewport. Verify after any height change:
   *  `st.end <= ScrollTrigger.maxScroll(window)`. */
  stats: {
    /** Window tuned so card 2 (≈366px below the block top at desktop scale)
     *  is ABOVE the fold during its roll — end earlier than "top 20%" and
     *  the crescendo settles off-screen (found in browser QA 2026-07-19). */
    trigger: { start: "top 85%", end: "top 20%" },
    /** Per-card ignition span (unitless timeline durations) — card 2
     *  stretched for the "10" ones-strip 0→9→0 crescendo. */
    spans: [1, 1, 1.5],
    /** Next card ignites at prev start + prev span × this (<1 = cascade). */
    cardStagger: 0.85,
    /** Card entrance drift px (was the block veil's hardcoded 24). */
    yDrift: 24,
    /** Within-card beat windows as [start, end] fractions of that span. */
    beat: {
      shell: [0, 0.3],
      border: [0.05, 0.75],
      roll: [0.15, 0.85],
      glare: [0.8, 1],
    },
    roll: {
      /** Decel lives HERE only — the timeline defaults stay ease:"none"
       *  (scrub grammar); this eases each last-slot strip within its beat. */
      ease: "power3.out",
      /** Higher-order slots (the "1" of 10) flip linearly across this final
       *  fraction of the roll beat, riding the eased ones-strip 9→0 carry
       *  (exact sync under power3.out = 0.1^(1/3) ≈ 0.464). */
      tensFlipFrac: 0.45,
    },
    /** Band sweep in xPercent of the band's own width (band = 55% card). */
    glare: { fromX: -150, toX: 250 },
    border: { strokePx: 1 },
    /** Version tail: position = card2 start + card2 span × `at`. */
    version: { at: 1, dur: 0.5 },
  },
  portrait: {
    /** Token NAMES (no raw hex) — resolved as var(--color-<stop>). Opaque
     *  accent stops + mix-blend-color = the FULL orange duotone grade (photo
     *  luminance preserved, hue pulled entirely into the ember family).
     *  v8: the portrait is the static fully-orange box at ALL times — the
     *  entry blur/vignette/halo overlays were removed by owner request. */
    tint: { stops: ["accent-deep", "accent"] },
  },
  /** Damped feel for the description/finale scrubs (numeric scrub = 3/damp
   *  seconds). The entry timeline stays scrub:true — numeric scrub there
   *  would lag About behind the manifesto veil it must stay in lockstep
   *  with. */
  damp: 5,
  /** Pre-reveal floor for H1 words + H2 lines — veiled, not invisible. */
  veiledOpacity: 0.35,
  /** Single low-perf switch: false ⇒ text blur channels degrade to
   *  opacity+y reveals. */
  blurEnabled: true,
} as const;
