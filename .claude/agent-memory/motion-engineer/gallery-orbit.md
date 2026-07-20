# 07 Gallery — cover orbit engine (built 2026-07-20; choreography revised ×3 same day)

`sections/GallerySection.tsx` + `utils/gallery.tunables.ts` (`GALLERY`).
Dissection source: `reference/gallery-refine.mp4` (re-extracted 4fps for
v3). Owner-revised flow (v3, CONVEYOR): covers enter ONE BY ONE through the
LEFT screen edge and traverse the ellipse PER ITEM — bottom/near arc
left→right, edge-on at the right edge, one full back-arc lap
(`travelTurns` 1.5 = 0.5 to reach right + 2π lap), then FADE OUT at the
right extreme, exiting in entry order. Entry order IS path order. History:
v1 slide-from-left was rejected as "a stream from the page edge" — the
objection was SIMULTANEOUS entry, not left entry; v2 (pop-in at slots +
global ring rotation) is superseded by this owner ask. The statement
de-veils once the train is mostly in (revealSpan [0.30, 0.52] — fully in
right as the first exit fade starts ≈ p 0.50). Yaw stays purely
position-driven (`rotationY ∝ screen x`, f028/f014: edge-on sliver at the
screen edge = flat-plane rotateY, NOT a bowed surface), so covers enter
and wrap near edge-on for free. Covers hold a STATIC per-item z-tilt —
they never rotate with the path. Covers are currently the 04-style ember
radial-gradient DUMMY cards, pure gradient, no text (owner decision — ring
is data-free; swap back to `Image` when real covers ship, engine unchanged).

## Engine (reusable patterns)

- **ORBIT_ITEMS at module scope**: `Array.from({length: ringDensity})`,
  DETERMINISTIC jitter (`sin(i*127.1 + salt*311.7)` fract hash — stable
  beat screenshots across renders/HMR; no Math.random) for radius/size
  variance, static tilt, and a sequential jittered conveyor `startAngle` =
  `(i ± spacingJitter)·spacingTurns·2π`, clamped ≥ 0 — jitter < 0.5 slot so
  entry order can never reorder and nothing is visible at p=0.
- **Damp applier on `gsap.ticker`** (FrameDriver precedent, no second RAF)
  eases ONE scalar — the master progress: `rendered += (target - rendered)
  * (1 - exp(-damp*dt))`; on convergence lands ONE exact write then idles →
  motion exactly 0 at rest. `position(p)` derives EVERYTHING from the
  damped p so all channels stay mutually consistent and reversible by
  construction. Scrub `onUpdate` only sets `state.target`; the heading veil
  maps to RAW progress.
- **Per-item travel** (v3 core): `t = clamp(master − startAngle, 0,
  TRAVEL)`, `angle = π − t` (θ decreasing: left edge → bottom/near → right
  → back arc → fade at right extreme); entry fade over the first
  `entryFadeTurns` (cover slides in edge-clipped), exit fade over the last
  `exitFadeTurns`. `t ≤ 0 || t ≥ TRAVEL` → ONE hide write (`lastHidden`
  flag), then skip. `measure()` sets `totalMaster = startAngle(last VISIBLE
  cover) + TRAVEL + TAIL` per breakpoint — mobile hides the train tail via
  CSS, so its pacing must not inherit the desktop tail. At p=1 every cover
  is exited by construction; the section unpins on the heading alone after
  a `tailTurns` beat.
- **All path values are in TURNS** in `GALLERY.path`, converted to radians
  once at module scope (`TURN = 2π`). `orbit.radiusX` 0.5 puts the ellipse
  extremes AT the screen edges — entry/exit clipping is free
  (`overflow-hidden` section), no slide-distance px needed.
- **Curved traversal**: `rotationY = -maxYaw · clamp(x/halfVw)` via
  quickSetter + one-time `transformPerspective` (900) — entering covers
  arrive near edge-on and unfurl. Literal surface bowing would need
  strip-slicing/WebGL; not built, revisit only on owner ask.
- **cos-depth mid-plane**: `depth = (sin(angle)+1)/2` (near = ring bottom);
  scale + opacity lerp far→near; `zIndex = 1 + round(depth*39)` straddles
  the heading's static `z-20` — near covers pass IN FRONT of the text, far
  behind. z written only when the rounded value changes. Per-item
  quickSetters x/y/scaleX/scaleY/rotationY/opacity (never the "scale"
  shorthand).
- **Heading**: StatementWords-pattern React-owned word spans (mixed-face
  roman `font-display-lead` + focal `font-display-tail italic` — split-type
  can't nest faces), de-veiled (autoAlpha + blur) by a PAUSED timeline
  driven with `headingTl.progress(mapped scrub p)` → reversibility free.
- **No settle phase** (removed in the v1→v2 revision): rotation runs
  linearly to p=1; the exit replaces the settle beat. `will-change`
  set/cleared in pin `onToggle` only.
- **RM branch**: early return = static mid-flight pose
  (`position(GALLERY.rmProgress)`, 0.5 — whole train visible, item 0 just
  short of its exit fade) + heading visible by markup default, plus a
  passive `resize` re-place — needed because no ScrollTrigger refresh runs
  in that branch (audit F2).
- **Breakpoint trap (2nd recurrence)**: JS reads must be rem-based
  (`matchMedia("(width >= 64rem)")`) to match Tailwind `max-lg` cover
  hiding — `innerWidth < 1024` diverges at non-default root font size.
- **Insertion-tolerant**: the section self-registers (own pin, `#gallery`
  already in navLinks); 05/06 slot between 04 and 07 in HomePage only.

## Tuning notes

- Radius jitter r .22 (spec .12 read mechanical); slot jitter `a` is GONE
  in v3 — its role is taken by `spacingJitter` (±0.25 slot on each start).
  The tighter-radius items are what let near covers cross the heading (the
  G2 occlusion proof).
- Mobile (<64rem): 6 covers (`max-lg:hidden` on index ≥ mobile density —
  CSS does the density switch, no JS; `measure()` still derives
  `totalMaster` from cover 5), radii .55vw/.20vh, train holds at 390×844.
- v3 gate tuning knobs: `path.spacingTurns` (trickle rate),
  `path.travelTurns`, `pinRunway` (scroll pace), `heading.revealSpan`.
- Heading STATEMENT is a PLACEHOLDER (PRD has no gallery line) — swap the
  const when the owner picks a line.
