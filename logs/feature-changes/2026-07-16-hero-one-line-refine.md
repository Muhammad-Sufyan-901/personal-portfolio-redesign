# 2026-07-16 — Hero refine: one-line name, chosen display faces, horizontal seam, interactive aurora

## What changed

- **Fonts (v2.1 hero-display amendment, owner-approved 2026-07-16):** hero name now sets `Muh.` in **Switzer Medium 500** (`--font-display-lead`) and `Sufyan.` in **Instrument Serif Italic 400** (`--font-display-tail`), picked at the Turn-1 specimen gate (pairing A of 8 candidates vs the lukebaffait.fr reference). Self-hosted in `public/fonts/<family>/` with licenses beside the files; `@font-face` (`font-display: swap`) + `rel=preload` in `index.html`. Fallback chains end on the settled faces (General Sans / Fraunces italic), never system-ui.
- **Font provenance (no mirror sites):**

  | File | Source | License |
  | --- | --- | --- |
  | `public/fonts/switzer/Switzer-Medium.woff2` (20 KB) | Official Fontshare `switzer` download zip (api.fontshare.com), WEB static | `FFL.txt` beside it (ITF Free Font License) |
  | `public/fonts/instrument-serif/InstrumentSerif-Italic-latin.woff2` (16 KB) | Official Google Fonts serving API (fonts.gstatic.com latin subset, css2 v5) | `OFL.txt` beside it (from google/fonts repo) |

- **Data:** `Profile.heroName { lead, tail }` added to `src/types/portfolio.ts` + `profile.data.ts` (`{ lead: "Muh.", tail: "Sufyan." }`) — owner-approved display abbreviation, NOT PRD content; the h1 `aria-label` keeps the full name.
- **Hero layout (`HeroSection.tsx`):** h1 is one line ≥lg — `.hero-word` lead · `.hero-slot` (aria-hidden, flex-1, min-width tunable) · `.hero-word.hero-word-tail` — at the new `--text-hero-line` token (`clamp(3rem,15.5vw,18rem)`, registered in `utils.ts` twMerge font-size groups); stacks to the shipped two rows below lg (`--text-hero`). Split/seam selectors migrated `.hero-name > span` → `.hero-name .hero-word` (the slot is never split). New `hero.tunables.ts` exports `HERO_REFINE` (single source for all new magic numbers, incl. the `useReferenceFaces` licensed-upgrade slot). Opt-in `surnameHoverFlash` wired but **OFF** (`--color-flash #66EACC`, sampled from the reference tail word).
- **Seam re-rig (`ManifestoSection.tsx`, T1 only — first width-conditional seam):** `gsap.matchMedia` split. ≥lg: stage clipped to the measured slot rect (`inset(T R B L round r)`, accumulated `offsetTop/offsetLeft` to `#hero` + pin shift, never gBCR) expanding to full-bleed; words exit horizontally (±1.2 × own span, function-based px). <lg: the shipped scale-0.14 zoom + vertical row exits, verbatim. T2 master unchanged (built once, outside matchMedia). Stage lifecycle contract (alpha ownership split, `stageState.active`, backdrop-root rule) preserved. Stale clip-path doc comment corrected. Reverse-scrub verified: clip returns to the exact re-measured slot rect at scroll 0.
- **Aurora (`AuroraBackground.tsx`):** promoted `uIntensity` (0.6 × `HERO_REFINE.aurora.intensity` 1.5) and `uMidPoint` (coverage 0.55, **coupled ×intensity** — the alpha smoothstep reads scaled intensity, so an uncoupled brightness boost silently doubles coverage; measured 60% frame chroma vs reference 37% before the coupling). New `uMouse`/`uHotspotRadius` hotspot: one `pointermove` on window, damped in the existing `gsap.ticker` tick (`1−exp(−4·dt)`), idle sin/cos drift after 2 s or on touch. Restored the DPR≤1.5 cap lost in the ogl rewrite. Fallback gradient widened to match the bolder coverage.
- **Chrome (D4):** hero bar hairline `border-line` → `border-line-strong` (`#8A8A8A`, sampled frame_0001 y986), role + anchors `text-muted` → `text-paper`, anchor hover → `text-paper-bright` (`#F0F0F0`). Measured: border 36→138, labels 154→228; contrast 15.6:1 / 17.4:1. Owner decision: keep role text, no version mark.
- **design_system.md:** v2.1 amendment blockquote under §4 + rows in §3.1/§3.2/§4.1/§4.3.

## Why

Owner-approved re-composition toward the reference's hero grammar (the name is the door the manifesto opens through) with licensed faces replacing the faux-slant Fraunces italic (the true italic was never imported — `globals.css` loaded only the upright wght subset).

## Files touched

`public/fonts/{switzer,instrument-serif}/*`, `index.html`, `src/styles/globals.css`, `src/lib/utils.ts`, `src/types/portfolio.ts`, `src/features/home/data/profile.data.ts`, `src/features/home/sections/{HeroSection,ManifestoSection}.tsx`, `src/features/home/sections/hero.tunables.ts` (new), `src/features/home/components/AuroraBackground.tsx`, `.agents/context/design_system.md`, `.impeccable/config.json` (owner-confirmed Instrument Serif ignore-value).

## QA round (same day)

qa-auditor verdict: **releasable**, no blockers. Its two low findings were fixed immediately: F1 — `useReferenceFaces` comment now states the slot is unwired (no-op until licensed files + FontFace wiring land); F2 — breakpoint queries unified in rem (`oneLineMinBp: "(min-width: 64rem)"`, mobile derived as `not all and …` so one constant owns the split). Post-audit, a **live-resize bug** was found and fixed: `gsap.matchMedia` revert does not reliably clear the other context's inline styles, so each seam context's initial `gsap.set(stage, …)` now explicitly neutralizes the other rig (desktop adds `scale:1, borderRadius:"0px"`; mobile adds `clipPath:"none"`) — verified with a 390↔1440 round-trip.

## Follow-ups

- Pre-existing (NOT this change, T2 markup untouched): the manifesto statement renders without inter-word spaces ("Basically,Iwritecode.") — inline-block spans swallow the trailing spaces; needs a spacing fix in `StatementWords` when 02 is next opened.
- `public/fonts/_candidates/` + `public/_specimen.html` remain on disk (deletion was declined mid-session); untracked, excluded from the commit — owner to delete or keep.
- Aurora chroma measures 56–61% by the r>60 threshold vs reference 37% (visual matches the "upper two-thirds" target); `HERO_REFINE.aurora.{intensity,coverage}` are the two knobs if the owner wants it quieter.
