# About refine — staged line blur reveals, gated description runway, ember-glow portrait

- **Date:** 2026-07-18
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 03 About (+ RevealText primitive extension, tokens)

## Summary

Refined chapter 03 to the measured `reference/about-refine.mp4` beat map (preflight verdict: the reference is MOVING — no pin — so all reveals ride normal document flow). The statement now resolves **line-by-line blur→clear** inside the manifesto veil tail on the E v2 faces (Switzer roman, Instrument-Serif-italic focal words — Fraunces leaves the statement); the bio reveals **line-by-line over an extended scrub runway** that starts only after the headline fully settles (the "extra scroll" gate: ≈544 px from headline-settle to description-complete at 1440×900, ≥ the mandated 2.2× headline range); the portrait carries the measured **ember-glow composition** (crimson tint gradient + filter-free radial-gradient halo scrub-ramped with entry, idling on a 4.5 s breath). All reveals are scrubbed and reversible (verified: reverse-pass states match down-pass to 4 decimals); blur is finite (in-timeline `filter: none` at every settle point — zero active filters/will-change at rest).

## Files touched

- `src/styles/globals.css` — new tokens `--color-ember-glow-deep` `rgba(200,17,19,.45)` / `--color-ember-glow-soft` `rgba(237,108,82,.18)` (hues evidence-sampled from reference frames f_060/f_090)
- `src/features/home/utils/about.tunables.ts` — **new** `ABOUT_REFINE` (headline/description/portrait spans + `damp`, `veiledOpacity`, `blurEnabled` low-perf switch)
- `src/features/home/utils/manifesto.tunables.ts` — `aboutResolve.blurFromPx` deleted (dead — blur moved per-line); `overlap` untouched (seam authority)
- `src/components/common/RevealText.tsx` — extended (backward-compatible, zero prior consumers): `trigger` (RefObject **or selector** — an ancestor's RefObject is still null in this child's layout effect, so ancestors pass selectors), `start`/`end`/`scrub` (scrubbed reversible variant), `blurFrom` (blur channel, no clip wrappers), `veiledOpacity`; re-splits + rebuilds on ScrollTrigger refresh; `revertOnUpdate: true` added per the reduced-motion audit rule
- `src/features/home/sections/AboutSection.tsx` — statement re-typeset as React-owned per-word spans (`toWords` char-range intersection; StatementWords space rule) bucketed into visual lines at runtime (offsetTop with half-line-height tolerance — split-type is unusable here: nested emphasis spans line-group as atomic units); entry timeline rebuilt via `addChildren` on every refresh; wrapper blur dropped (per-line blur is the blur story); `EmberPortrait` local composition (halo + rounded clip wrapper + tint) for both viewport variants; bio switched to the extended `RevealText`

## Notable decisions

- **Per-word filters with per-line timing** instead of SplitType lines: nested-span line-grouping caveat (split-type README) + re-parenting React-owned nodes is a reconciliation hazard; ~14 glyph-sized blur surfaces cost fewer painted pixels than 3 full-width line strips. Visual contract (line-granular resolve) unchanged.
- **Halo = radial gradient, not a blurred layer**: no filter rasterization, opacity-only compositing; `glow.blurPx` maps to spread (`inset: -3×`). Ramp (outer layer, scrubbed) × breath (inner layer, gated tween) multiply — conflict-free, reversible without gating hacks.
- **`damp` feeds only H2's numeric scrub (3/damp = 0.6 s)** — the entry timeline stays `scrub: true`; numeric scrub there would lag About behind the veil it must stay in lockstep with.
- **`trigger` selector form**: React attaches a parent's ref after a child's layout effect runs — `trigger={sectionRef}` silently fell back to the bio `p` (runway started ~540 px late, caught in MCP verification). The element is already in the DOM at that point, so the prop now accepts a selector; About passes `"#about"`.
- Focal punctuation ("care.") rides fully italic — accepted, manifesto `isFocalWord` precedent.
- Tint currently overlays the 404 placeholder block (portrait externality still owed) — re-judge blend (`soft-light` vs `color`) when the real photo lands.

## Verification

- [x] `npx tsc --noEmit`, `npm run lint`, `npm run build` clean; no new raw hex (StudioRig hits are the documented 3D-island exemption); gsap only via `@/lib/gsap`; zero `will-change`
- [x] MCP beat grid down AND up: veil-tail entry (ink-on-ink) → headline settled + all 6 bio lines veiled at 0.35/blur(10) (gate proof) → line-by-line runway (bio1→bio3→bio6) → complete before document end; reverse pass reproduces down-pass states to 4 decimals
- [x] Gate: headline-settle → description-complete ≈ 544 px ≥ 2.2 × headline range (515 px)
- [x] Fonts computed: roman Switzer / focal Instrument Serif italic (only the correct "and") / bio General Sans / CV JetBrains Mono; buckets 1440: [5,4,5]
- [x] Settle audit: zero active filters, zero will-change; halo ramp 0.34→0.89→1.00, breath oscillates in view and pauses off-screen
- [x] Manifesto seam: veil 1.00 / tint 0.00 / stage hidden past T2, About resolving inside the tail — overlap timing unchanged
- [x] Reduced motion: complete static render, bio unsplit, halo idle, aria-label single AT exposure, 0 canvases
- [x] 700 px viewport: 4 buckets, runway completes 130 px before doc end, portrait in view (671 px); live resize regroups buckets (5,4,5 → 8,6) with no unstyled flash; `blurEnabled: false` degrades to opacity+y + static halo

## v2 revision (same day, owner review against reference stills)

Four changes, same files (+ tunables rework):

1. **Visible word-sequential headline reveal** — v1's line buckets resolved over span [0.05, 0.45], completing below the fold (invisible in practice). v2: words stagger INDIVIDUALLY across span [0.3, 0.75] (`step = spanLen/(n−1+trail)`, trail 3 words mid-resolve) so the sharp/blur boundary travels mid-line, mid-viewport (reference Image #2). This made the timeline layout-independent → **deleted `groupLines()` bucketing + the `onRefresh` rebuild entirely**. Statement `lg:max-w-[63%]` → `[72%]` (text overflows onto the panel; inner is z-10).
2. **Orange-dominant softer portrait + distortion** — glow tokens re-valued (deep = accent ember rgba(232,56,15,.5), soft = highlight rgba(237,108,82,.25)); halo spread 42→56; static streak distortion on the img via an inline SVG `<filter id="about-distort">` (feTurbulence `0.004 0.02` + feDisplacementMap 24, tunables `portrait.distort`), applied as a static class filter (`[&_img]:[filter:url(#about-distort)]`) — never GSAP-tweened, so it can't collide with the scrubbed wrapper blur. **Settle-audit exception: this url() filter on the imgs is the one intentional persistent filter.**
3. **Bio at item scale** — `text-body` → `text-item` (28 px @1440).
4. **Portrait focus-blur** — the clip wrapper scrubs `blur(16px)→0` + a new edge **vignette** layer (radial ink gradient, opacity 1→0) over the SAME runway range as the bio (`DESC_START → descEnd`, scrub 3/damp): the portrait sits as a soft-edged blob feathering into the ink through the text beats (Images #6–8) and sharpens at settle (in-timeline `.set(filter:"none")`). Vignette markup default `opacity: 0` (settled state); motion path sets 1. Gated by `blurEnabled` along with the distortion.

Gate note: with `startAfter: 0.75` the runway end-clamp binds — effective gate ≈ **416 px** @900 (was 544). Verified same harness: word boundary reversible (probe deltas match scroll-position deltas exactly), portrait re-veils symmetrically, settle audit clean except the documented distortion filter, build/lint/console clean.

## v3 revision (same day) — fully-orange settled portrait

Owner ask: the fully revealed portrait should be FULLY orange with visible distortion. Changes (AboutSection + tunables only):

- **Duotone grade**: tint layer `mix-blend-soft-light` → `mix-blend-color` with `tint.stops` re-pointed to the OPAQUE accent tokens `["accent-deep", "accent"]` — photo luminance preserved, every hue pulled into ember. Reads as a solid deep-orange panel even over the 404 placeholder.
- **Visible smear**: new `.about-streaks` layer (soft-stop `repeating-linear-gradient` of the ember-glow alpha tokens, `-inset-8` oversize so displacement never exposes edges, `mix-blend-screen`, opacity 40) carrying `[filter:url(#about-distort)_blur(14px)]` — the displacement warps the bands into wavy light-smears that show even where the img is hidden. `distort.scale` 24 → 36. First pass used hard 26px bands (read as zebra stripes) — softened to gradient stops + blur.
- **Settle-audit whitelist grows to 4 static filters**: img `url(#about-distort)` ×2 + streaks `url(#about-distort) blur(14px)` ×2. All other filters still scrub-finite. Streaks are gated by `blurEnabled` with the rest of the filter budget.

## v4 revision (2026-07-19) — tall section, sticky portrait, version + statistics finale, distortion removed

Owner asks: >100vh scrollable section with beats in order headline → description → version+statistics; portrait STICKS until the section end; distortion removed.

- **Deleted**: the entire distortion apparatus (SVG `#about-distort` def, `.about-streaks` + `STREAK_GRADIENT`, `[&_img]` filter class, `distort` tunable) — settle-state filter whitelist back to ZERO — and the v2 runway math (`DESC_START`/`descEnd`, `startAfter`/`runwayMultiplier`): with real height each beat triggers on its own position.
- **Layout**: section `overflow-hidden` → **`overflow-clip`** (an overflow-hidden ancestor silently kills `position: sticky`; clip crops identically but creates no scroll container — load-bearing). Beat gaps `mt-[40svh] lg:mt-[55svh]` on bio + finale → section ≈ 2.45 viewports. New `.about-final` block: `→ V3.0` (new `siteConfig.version`, arrow aria-hidden) + the three `profile.stats` (number `text-item` + mono eyebrow label). `lg:mb-[45svh]` under it gives the reveal window scroll room before the document ends (About is still the last section) and holds the closing portrait beat.
- **Sticky portrait (desktop)**: rail `absolute inset-y-0 right-0 w-[40vw]` + inner `sticky top-[12svh] h-[88svh]` — stuck through all beats, flush bottom at the end. Mobile stacked block unchanged (finale precedes it in flow).
- **Choreography**: entry timeline untouched (seam contract + word-blur headline). Bio RevealText now triggers on its own root (`description.reveal { start: "top 85%", spanVh: 0.5 }`). Finale reveal + portrait blur/vignette resolve share ONE range (`finale { start: "top 90%", end: "top 62%" }`, trigger `.about-final`, scrub 3/damp) — end tuned twice live (45→55→62%) so the window completes before max scroll with margin; verified ZERO filters at doc end and symmetric re-veil on reverse.
- **Pre-existing finding (out of scope)**: horizontal scrollable overflow page-wide (`scrollWidth` 717–722 @500px) caused by the hero h1's persistent manifesto zoom-exit scale (committed 7163b63) — visible on touch devices (Lenis syncTouch off → native horizontal drag). Not touched by this diff (About's clip contributes nothing); fix belongs to the hero/manifesto pass (e.g. `overflow-x-clip` on the hero section, re-verified against the pin/FLIP measurements).

## v5 revision (2026-07-19) — reference height, early portrait resolve, stats above version

Owner asks vs the reference stills (Images #10–12): reduce the section to the reference's traversal; portrait blurred ONLY during entry (clean orange box after ~20% of the section); stats moved above the V3.0 marker with the description→stats gap equal to the heading→description gap.

- **Height**: beat gaps `mt-[40svh] lg:mt-[55svh]` → **`mt-[12svh] lg:mt-[14svh]`** on BOTH the bio and `.about-final` (one shared value = the owner's equal-gap instruction; verified 127 px ≡ 126 px at 1440×900); finale `lg:mb-[45svh]` → `lg:mb-[24svh]`. Section: 2207 px → **1376 px = 1.53× viewport** (reference target 1.5–1.6). Statement + bio now share a view (Image #11 parity capture).
- **Portrait resolve retie #2**: `ptl` (blur 16→0 + vignette 1→0 + hygiene set) now spans `trigger: section, "top bottom" → += resolveSpan×(sectionH+vh)` with new tunable `portrait.veil.resolveSpan: 0.2` — veiled through entry only, clean sharp orange box from ~20% traversal through bio + finale views; reverse re-veils only inside that span (verified blur(9.87) at 8% traversal on reverse, `none` past 25%).
- **Finale**: column layout — stats row first, `→ V3.0` beneath (`mt-10`). `finale.end` retuned "top 62%" → **"top 70%"** (the shorter section shrank the tail room again; at doc end finale is o1.00/`none`, settle audit ZERO filters).
- Also riding in this working tree: the OWNER's own `profile.data.ts` wording edit ("crafting" → "building" etc.) — content edit by the owner, emphasis phrases unchanged and rendering correctly.

## v6 revision (2026-07-19) — fully-orange centered box past 20%, glass-bubble stats

- **Portrait**: (a) new always-on normal-blend ember wash (`from-accent-deep/70 to-accent/45`) over the duotone — the box reads FULLY orange even over the 404 placeholder; (b) the halo glow became an **entry-only bell inside `ptl`** (in over the resolve span's first 40%, gone by its end) — past 20% traversal there is NO glow/blur overlay of any kind (verified clip/vignette/halo all zero at 25–60%, re-veiling on reverse); the **breath tween + its gate trigger + `glow.intensityIdle/intensityPeak/breathDur` tunables are DELETED** (halo markup default is now hidden = the settled state); (c) sticky wrapper vertically centered — `top-[12svh]` → `top-[6svh]` with `h-[88svh]` (54 px ≡ 54 px at 900).
- **Stats**: glass bubbles per stat (`rounded-2xl border-paper/10 bg-paper/5 backdrop-blur-md px-7 py-5` — the MenuButton glass-pill grammar); static backdrop blur, not part of the motion filter budget. Third bubble overlaps the orange panel where the glass blur reads clearly.
- Settle audit stays ZERO active `filter`s; build/lint clean.

## v7 revision (2026-07-19) — REVERTED same day

Three changes (portrait overlays removed entirely, CV link at `text-item` + underline, staircase stat cards) were built, verified, and then **reverted at owner request** — the section stands at the v6 state: entry-only portrait blur/vignette/halo bell, `text-eyebrow` CV link, single-row glass bubbles.

## Follow-ups

- Portrait photo externality unchanged (`public/assets/images/portrait.webp`); re-judge wash strength (`from-accent-deep/70 to-accent/45`) + duotone on the real photo.
- Hero h1 zoom-scale horizontal overflow (pre-existing, above) — schedule with the next manifesto/hero pass.
- Tune knobs: shared beat gap (`mt-[12/14svh]`), `finale` range, `portrait.veil.resolveSpan`, `headline.span`, `description.reveal.spanVh` (bio completes slightly later than the reference's settled view — reduce spanVh to tighten).
