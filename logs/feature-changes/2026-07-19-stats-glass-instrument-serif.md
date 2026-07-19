# About stats: Instrument Serif digits + glass-with-color cards

- **Date:** 2026-07-19
- **Author:** main
- **Type:** style
- **Chapter/Area:** 03 About (statistics finale)

## Summary

Owner-requested restyle of the three odometer stat cards: digits swap from Switzer (`font-display-lead`) to Instrument Serif italic (`font-display-tail` — the face already loaded for the `+` suffix and hero tail), and each card becomes a React Bits **GlassIcons** "glass with color" adaptation — an ember gradient plate rotated 6° behind a smoked-glass front, with a pure-CSS hover (plate → 10° + up-left drift, glass → scale 1.03). Adapted per `animated-ui-references`: no framer-motion, Box primitives, tokens only, `motion-safe:` hover gate.

## Files touched

- `src/features/home/sections/AboutSection.tsx` — `StatCard` only: new wrapper (`.stat-card` moved here so the shell beat ignites plate+glass as one) + plate + glass structure; digit font/italic swap; slot `overflow-hidden` → `overflow-x-visible overflow-y-clip` (italic overhang); SVG rim `text-paper/10` → `/30`; `+` suffix drops `text-accent` (inherits paper — accent-on-ember ≈ 2:1); label `text-muted` → `text-paper/75` (AA over the plate). Follow-up (owner): label also gets `whitespace-pre-line` — the `\n` already in the "Frameworks & \nTech Stacks Used" stat label now renders as a real break, narrowing the 7+ card (~312→197px) to match the others.

## Notable decisions

- **Smoked glass `bg-ink/40`, not the source's light `paper/15`** — owner picked via AskUserQuestion: light glass fails AA for the in-card text (≈3.1:1) and violates "accent is a scalpel, never a wash". Ember still shows via the plate peek + backdrop-blur bleed.
- **Plate at 6°/10°, not the source's 15°/25°** — tip lift scales with card width; 15° on these wide cards would cross ~50px into the previous staircase card (vs `gap-y-5` = 20px).
- **No 3D lift** — GSAP's mid-scrub `filter`/`opacity` on the wrapper flattens `preserve-3d`; 2D `scale-[1.03]` gives the same pop. Hover uses native `rotate-*`/`translate-*`/`scale-*` utilities only (Tailwind v4 individual transform properties compound with arbitrary `[transform:…]` — never mix).
- Hover curve is the token `--ease-inout`, which is literally the GlassIcons `cubic-bezier(0.83,0,0.17,1)`.
- Ignition timeline untouched — no tunables moved; selectors resolve through the extra nesting.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (if UI) — RM: cards render settled with zero inline styles (matchMedia patch); a11y tree keeps `3+`/`7+`/`10+` labels; label contrast paper/75 over ink/40+ember ≈ 5.6:1
- [ ] Lighthouse ≥ 90 (deferred to final QA, per plan)
- Browser (chrome-devtools MCP, 1440×900): full ignition completes exactly at max scroll; italic digits unclipped; hover verified (10° / −8px −8px / 1.03); plate graze into previous card ≤ 12px corner sliver; console clean.

## Follow-ups

- Plate angle (6°/10°) and glass tint (`bg-ink/40`) are class-level taste knobs if the owner wants more/less peek or a lighter frost.
- Upright (roman) Instrument Serif digits would need a new font file — only the italic face is hosted.
