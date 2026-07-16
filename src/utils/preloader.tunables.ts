/** Single source of truth for the name-morph preloader (P0–P5). Tune ONLY
 *  here, side-by-side against reference/preloader-refine.mov (measured phase
 *  table in reference/preloader-refine-notes.md). Consumed by Preloader
 *  (P0–P3 + unlock timing) and HeroSection (P4 chrome stagger). */
export const PRELOADER_REFINE = {
  /** P0+P1 loading-gate bounds (s): min floor even when assets are instant;
   *  max is a HARD cap — never hold the door longer, remaining assets stream. */
  hold: { min: 0.7, max: 4.0 },
  center: {
    scaleFrom: 0.92,
    scaleTo: 1.0,
    /** Wordmark's vertical center while parked (reference cy ≈ 0.51). */
    y: "50vh",
    /** Also quantizes the door-open (P2 fires at a breath boundary): tuned
     *  1.3→1.55 so a fast local gate opens at ~1.7 s like the reference. */
    breathDur: 1.55,
    /** Centered wordmark size + word gap (reference: ~40% viewport width). */
    fontSize: "clamp(2.25rem, 6vw, 5rem)",
    gap: "0.35em",
  },
  /** P1 char cascade (reference 4.23→4.60 s abs): chars rise UNCLIPPED from
   *  below with a slight settling rotation, staggered from the center of the
   *  combined name outward (Baffait fills left→right, Luke right→left). */
  chars: { delay: 0.35, dur: 0.5, rise: "1.1em", rotation: 14, staggerEach: 0.03 },
  /** P2 morph onto the hero h1's word rects. */
  travel: { dur: 0.35, ease: "power3.inOut" },
  /** P3 exit: ember sheet wipes bottom→top ending exactly at the name's
   *  landing → full-cover hold (the swap window) → ink sheet wipes bottom→top
   *  over it; at ink full-cover the cut to the page is invisible (ink == bg).
   *  Durations measured from the reference; ease = site curtain vocabulary. */
  sheets: { emberIn: 0.28, hold: 0.3, inkIn: 0.25, ease: "power4.inOut" },
  /** Post-reveal aurora glow ramp (reference 6.5→6.7 s abs). */
  auroraIn: 0.25,
  /** P4 hero chrome stagger — group keys are the [data-chrome] tags in
   *  HeroSection; order is the reveal order. Starts AT the reveal. */
  chrome: { stagger: 0.09, itemDur: 0.7, order: ["tagline", "socials", "nav", "meta"] },
  /** Scroll unlocks when the LAST chrome group starts (not ends) — the
   *  Preloader keeps the overlay mounted exactly that long. */
  unlockScrollAt: "chrome-start",
  reducedMotion: { holdMax: 1.0 },
} as const;
