/** Chapter 09 Achievements tunables — a flat recognition table whose rows fill
 *  with a light bar that wipes in from the left.
 *
 *  Why a table: PRD §3.5 gives three facts per award and no imagery, so there
 *  is nothing to build a card out of. It also earns its place by contrast —
 *  Journey (08) above is alternating cards on an ember zigzag and Articles (10)
 *  below is a pinned horizontal rail; the flattest possible chapter between
 *  them reads as a deliberate exhale rather than a third card grid.
 *
 *  Choreography (owner reference `reference/achievement-refine.mp4`, matched
 *  frame by frame): each row owns its own ScrollTrigger and fills as it crosses
 *  `start`, retracts leftward once its top passes `end`, and refills on the way
 *  back — `toggleActions: "play reverse play reverse"`. The stagger is NOT
 *  authored: rows are ~93px apart, so they cross their own trigger lines in
 *  sequence, which is what produces the reference's top-down wave. Nothing here
 *  is scrubbed and nothing is pinned.
 *
 *  The fill is one `mix-blend-difference` bar over neutral text, so the text
 *  inverts exactly at the bar's moving edge (the reference flips mid-string).
 *  CONSEQUENCE: only neutral text may sit under the bar — accent-deep comes
 *  back cyan through difference. The ember hover tick therefore renders AFTER
 *  the bar, outside the blend. */
export const ACHIEVEMENTS = {
  reveal: {
    /** row top crossing this viewport line fills the row */
    start: "top 88%",
    /** ...and crossing this one retracts it (reference measures ~22–25%) */
    end: "top 22%",
    /** seconds — the reference wipe reads as ~0.35s at 12fps; 0.5 with a
     *  decelerating ease lands on the same felt speed without snapping */
    duration: 0.5,
    ease: "power3.out",
    /** idle text opacity. 0.6 of paper over ink lands around 6.4:1 — dim like
     *  the reference's un-revealed rows, still AA on its own. */
    idleOpacity: 0.6,
  },
} as const;
