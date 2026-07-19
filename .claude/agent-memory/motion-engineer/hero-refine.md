# Hero one-line refine (2026-07-16, owner-approved v2.1) — as-built detail

## Name layout

- Content from `profile.heroName` (`{ lead: "Muh.", tail: "Sufyan." }`, owner-approved display abbreviation, NOT PRD; h1 `aria-label` keeps the full name).
- **≥lg one line:** `.hero-word` lead (`font-display-lead font-medium` = Switzer 500) · `.hero-slot` (`aria-hidden`, `hidden lg:block lg:flex-1 lg:self-stretch`, `minWidth: HERO_REFINE.seam.slotWidthIdle` inline style — the seam's door; renders the macbook poster under reduced motion) · `.hero-word.hero-word-tail` (`font-display-tail italic` = Instrument Serif). Size `--text-hero-line` `clamp(3rem,15.5vw,18rem)` (lead+tail ≈ 4.77em → slot lands ≈15–18% of the line, the reference's gap ratio). h1: `flex flex-col text-hero lg:flex-row lg:items-baseline lg:text-hero-line`; words `self-start`/`self-end` + `lg:self-auto`.
- **<lg:** the shipped two stacked rows, unchanged.
- **Selector contract:** split + seam queries target `.hero-name .hero-word` — NEVER bare `> span` (the slot must not be char-split or exit-animated). DEV warn guards `length !== 2`.
- Tunables: `src/features/home/utils/hero.tunables.ts` (`HERO_REFINE`) — name (re-exports profile.heroName), `oneLineMinBp: "(min-width: 64rem)"` (**rem** so it tracks Tailwind `lg:` under non-default browser font size), FONTS (incl. `useReferenceFaces` — an UNWIRED upgrade slot, flipping is a no-op until licensed Apparel/Factory Grotesk files + FontFace wiring land), aurora, chrome, `surnameHoverFlash` (wired in HeroSection's useGSAP behind `enabled: false` — pointerenter/leave color tween to `--color-flash`), seam (`slotWidthIdle`, `wordExit ±1.2`).
- HeroSection's useGSAP now accumulates cleanups in an array (split revert + flash listeners + parallax listener) → single cleanup fn.

## Seam breakpoint split (ManifestoSection T1; T2 untouched)

- `gsap.matchMedia` inside the existing useGSAP, after the shared lifecycle closures. Mobile query derived: `` `not all and ${HERO_REFINE.oneLineMinBp}` `` — one constant owns the split.
- **≥lg (clip-path rig):** stage keeps full layout size (no scale → R3F canvas measures full-res from frame 1; keep `resize={{ offsetSize: true }}` — T2's veil still scales 1.05). Initial + from: `clipPath: slotClip()` — shape-matched `inset(T R B L round r)` both ends (r from `--radius-lg`), function-based values, `invalidateOnRefresh` (T1 only). Slot rect: accumulated `offsetTop/offsetLeft` up the offsetParent chain to `#hero` + `min(0, innerHeight − hero.offsetHeight)` pin shift — never gBCR. Grammar preserved: appear at `SEAM_APPEAR 0.42` (autoAlpha 0.08) → clip → `inset(0px 0px 0px 0px round 0px)` by pin end; words exit horizontally at 0.5–0.95: lead `x = leadX × (accumLeft + width)`, tail `x = tailX × (innerWidth − accumLeft)` (±1.2, function-based px); chrome fade 0.4 `immediateRender: false`.
- **<lg:** shipped scale-0.14 zoom + pre-divided borderRadius + vertical row exits, verbatim.
- **LIVE-RESIZE TRAP (QA-found):** matchMedia revert does NOT reliably clear the other context's inline styles. Each context's initial `gsap.set(stage, …)` explicitly neutralizes the other rig: desktop adds `scale: 1, borderRadius: "0px"`; mobile adds `clipPath: "none"`. Without this, a stale desktop clip (viewport-sized insets) blanks the mobile stage after crossing 64rem.
- Verified: reverse scrub returns the clip to the exact re-measured slot rect at scroll 0; full 02 playthrough + About handoff intact; round-trip resize 390↔1440 clean.

## Aurora upgrade (AuroraBackground.tsx)

- New uniforms: `uIntensity` = `BASE_INTENSITY 0.6 × HERO_REFINE.aurora.intensity (1.5)`; `uMidPoint` = `intensity × midPointFor(coverage)` where `midPointFor = 0.35 − 0.33·coverage` — **the ×intensity coupling is load-bearing** (the alpha smoothstep reads scaled intensity; uncoupled brightness boosts silently double coverage — measured 60% frame chroma vs reference 37%).
- Hotspot: `uMouse` (uv space, **bottom-origin y**) + `uHotspotRadius`; shader: `intensity *= 1 + smoothstep(radius, 0, distance(uv, uMouse)) × 0.5`. One window `pointermove` (hover-capable only; wrapper is pointer-events-none) → target; damped in the existing tick: `k = 1 − exp(−followLambda·deltaTime/1000)` (ticker deltaTime is ms). Idle > `IDLE_AFTER 2s` or touch → sin/cos drift (`idleDriftSpeed 0.15`, amp 0.25/×0.4y around 0.5/0.8).
- `Renderer({ …, dpr: Math.min(devicePixelRatio, 1.5) })` — restored cap. Fallback gradient widened: `ellipse_100%_70%_at_50%_0%` … `transparent_75%`.
- Tuning telemetry (r>60 ∧ r>1.6·b @480px): reference frame_0001 = 37%, pre-refine = 32%, current = ~56% (visual "upper two-thirds" matches the reference; intensity/coverage are the two knobs if the owner wants it quieter).

## Fonts + chrome (v2.1 amendment — design_system.md §3.1/§3.2/§4 has the tables)

- `public/fonts/switzer/Switzer-Variable.woff2` (Fontshare official, FFL.txt beside — replaced the Medium static on 2026-07-20 when the pairing went site-wide) + `public/fonts/instrument-serif/InstrumentSerif-Italic-latin.woff2` (16 KB, fonts.gstatic.com official latin subset, OFL.txt beside). `@font-face` in globals.css (`font-display: swap`) + 2 preloads in index.html. Tokens `--font-display-lead/tail` now alias the site-wide body/display faces (fallbacks system-ui/serif); `font-display italic` is a true italic since the 2026-07-20 swap.
- Chrome: bar hairline `border-line-strong #8A8A8A` (sampled frame_0001 y986), role+anchors `text-paper`, anchor hover `text-paper-bright #F0F0F0`; contrast 15.6/17.4:1. `--color-flash #66EACC` (sampled tail-word mint) only feeds surnameHoverFlash (OFF).

## Hero entrance gating (morph handoff — moved from MEMORY.md index 2026-07-19)

- `src/features/home/sections/HeroSection.tsx` (2026-07-16 morph handoff — NO char split anymore, split-type is gone from the hero): one useGSAP, `dependencies: [preloaderDone, prefersReducedMotion]`, `revertOnUpdate: true`. `!preloaderDone`: words `gsap.set(autoAlpha:0)` — invisible but MEASURABLE (the preloader morph lands on their gBCR; never CSS-hide) — and `[data-chrome]` groups hidden.
- On the flip (fires at the preloader's ink-cover reveal): revert re-shows words naturally (the preloader's swap `set` already showed them same-frame); P4 chrome timeline starts immediately (no delay), groups tagline→socials→nav→meta at `chrome.stagger`, `autoAlpha/y` per group, bar hairline via `borderTopColor` transparent→`var(--color-line-strong)`.
- The `.hero-aurora` WRAPPER ramps `autoAlpha 0→1` over `PRELOADER_REFINE.auroraIn` at position 0 — the wrapper, NEVER AuroraBackground's own root: its scroll scrub-fade records that element's start alpha on refresh (hiding the inner root freezes the aurora invisible).
- `data-chrome` tags coexist with `.hero-item` classes — the manifesto seam's `.hero-item, .hero-bar` selector must keep matching. ±10px quickTo name parallax on `(hover: hover)` unchanged.
