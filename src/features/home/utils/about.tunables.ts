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
  /** Final beat — the stats + version block's reveal range (trigger = the
   *  .about-final block). Last-section constraint: the end anchor must
   *  resolve ABOVE max scroll or the hygiene `.set` at progress 1 never
   *  fires — retune with any height change. */
  finale: { start: "top 90%", end: "top 70%" },
  portrait: {
    glow: {
      /** Halo spread: the radial-gradient layer is oversized by 3× this
       *  (no CSS filter — the softness lives in the gradient falloff).
       *  The halo is an ENTRY-ONLY bell riding the veil-resolve span
       *  (in over its first 40%, out by its end) — past 20% traversal the
       *  box is fully orange with no glow/blur overlay at all. */
      blurPx: 56,
    },
    /** Token NAMES (no raw hex) — resolved as var(--color-<stop>). Opaque
     *  accent stops + mix-blend-color = the FULL orange duotone grade (photo
     *  luminance preserved, hue pulled entirely into the ember family). */
    tint: { stops: ["accent-deep", "accent"] },
    /** Focus beat: the portrait is blurred (edge vignette feathers it into
     *  the ink) ONLY during the section's entry — blur + vignette clear
     *  over the first `resolveSpan` fraction of the section's total
     *  traversal (sectionHeight + vh from `top bottom`), leaving the clean
     *  orange box for the bio + finale views (reference Images #10–12). */
    veil: { blurFromPx: 16, resolveSpan: 0.2 },
  },
  /** Damped feel for the description/finale scrubs (numeric scrub = 3/damp
   *  seconds). The entry timeline stays scrub:true — numeric scrub there
   *  would lag About behind the manifesto veil it must stay in lockstep
   *  with. */
  damp: 5,
  /** Pre-reveal floor for H1 words + H2 lines — veiled, not invisible. */
  veiledOpacity: 0.35,
  /** Single low-perf switch: false ⇒ blur channels degrade to opacity+y,
   *  portrait focus blur + halo off. */
  blurEnabled: true,
} as const;
