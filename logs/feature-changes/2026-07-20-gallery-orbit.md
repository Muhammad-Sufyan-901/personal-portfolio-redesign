# 07 Gallery — scroll-driven cover orbit + center heading

- **Date:** 2026-07-20
- **Author:** main (Claude, chapter build)
- **Type:** feat
- **Chapter/Area:** 07 Gallery

## Summary
Built chapter 07 per the owner's beat-mapped spec (dissection of
`reference/gallery-refine.mp4`, 192 frames @ 8 fps): an images-only orbit of
project covers revolving around the viewport center, scrub-bound to a 260vh
pin, with the statement heading living at the orbit's depth mid-plane — near
covers pass in front of it, far covers behind. Covers were sourced per owner
decision: live-site hero captures at 1440×1080 (Phantom, Petabyte, Balinese
Cultural Portfolio); KHASS's domain (`khass.my.id`) no longer resolves, so it
joins the owner-supplied remainder (9 files pending).

## Phase 0 dissection findings (frames win over prompt expectations)
- Covers hold a **static per-item tilt** (~±5–15°) while revolving — they do
  NOT counter-rotate or follow the orbit tangent (f037/f062/f102).
- Orbit is a wide **ellipse** ≈ 34vw × 26vh @1920; 5–9 covers visible, ~8–10
  distinct in the reference (duplicates permitted as texture).
- Heading reveals **per-word with a veiled blur/dim**, scrub-tied and fully
  reversible (f118 shows re-veiling on reverse); mid-plane occlusion proven
  both directions (f062 covers behind text, f102 in front).
- Reference recording ends scrolling back up past 04's red PathDraw band —
  the 04 finale runway reproduces that exact handoff; G0 idle-in follows it.

## Files touched
- `src/features/home/sections/GallerySection.tsx` — NEW: ORBIT_ITEMS
  derivation (deterministic hash jitter), damped rotation applier on
  `gsap.ticker`, cos-depth mid-plane (scale/opacity/z from ring angle),
  StatementWords-pattern heading with scrubbed per-word veil, pin + settle.
- `src/features/home/utils/gallery.tunables.ts` — NEW: `GALLERY` (runway,
  rotation, orbit radii/jitter/density, depth, heading reveal, settle,
  mobile, low-perf) — all chapter magic numbers.
- `src/data/projects.data.ts` — `thumbnail` wired for phantom / petabyte /
  balinese-cultural-portfolio; header comment updated (capture provenance).
- `public/assets/images/projects/*.webp` — NEW: 3 live-site hero captures.
- `src/features/home/pages/HomePage.tsx` — mounts `GallerySection` after
  Projects (05/06 slot in between later; the section self-registers).

## Notable decisions
- **Heading uses the StatementWords pattern** (React-owned word spans, roman
  `font-display-lead` + focal `font-display-tail italic`), not `RevealText`:
  the documented split-type caveat (nested spans line-group atomically) rules
  it out for mixed-face statements. The veil is a paused timeline scrubbed by
  pin progress — reversibility for free.
- **Ring derives from `projects.filter(p => p.thumbnail)`** and repeats
  covers to `ringDensity` (10): works at N=3 today, upgrades to N=12 with
  zero code change as owner assets land. Low-perf tier (≤4 cores) drops
  dupes and narrows the depth scale range.
- **Rotation completes at progress 0.88** and rests through unpin — the G3
  settle is the arrangement at full rotation, motion exactly 0 at rest
  (damp applier lands one exact write on convergence, then idles).
- Heading statement is a clearly-marked **PLACEHOLDER** (PRD has no gallery
  line, PLAN decision 13) — owner-voice options presented at the gate.
- Jitter tuned up from spec defaults (r 0.12→0.22, a 0.15→0.35) after the
  first side-by-side: the even ring read as mechanical vs the reference's
  scatter, and tighter-radius items are what let near covers cross the text.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (no pin, static G3, heading revealed,
      will-change auto; real `h2` in document order, covers `alt=""`)
- [x] Beat grid captured down AND up (G0 / 3×G1 / G2 / G3); up-pass at
      p=0.45 pixel-identical to down-pass; zero drift at rest verified twice
- [x] Mid-plane proof: covers at z=12 (behind) and z=30 (front) intersecting
      the z-20 heading box simultaneously
- [x] Mobile 390×844: 6-cover tightened orbit holds; no drift-past needed
- [x] Perf trace during scrub: no forced-reflow / long-task insights
      (transform-only); sole CLS event = pin engage under programmatic scroll
- [x] qa-audit scope=gallery: 0 blockers/majors; Lighthouse (prod preview)
      a11y 98 / best-practices 100 / SEO 100 / perf 62 (page-level,
      pre-existing — preloader LCP gate + bundle split, deferred to final
      QA). In-diff lows F1 (px→rem breakpoint read) and F2 (RM resize
      re-place) fixed post-audit; tsc + lint re-verified clean.

## Follow-ups
- Owner to supply 9 covers (`public/assets/images/projects/<slug>.webp`):
  khass-e-ticketing (domain dead — flag the stale `livePreviewURL`), hoobank,
  kna, personal-portfolio, opto, point-of-sales-saas, pundi,
  personal-finance, create-my-react-boilerplate.
- Heading statement: replace PLACEHOLDER once owner picks a line.
- Fine side-by-side pass vs reference at matched progress once N=12 (density
  and settle arrangement re-judged with the full cover set).
