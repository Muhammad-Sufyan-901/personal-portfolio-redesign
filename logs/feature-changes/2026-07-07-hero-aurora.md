# B2: Hero aurora background (canvas) with scroll fade

- **Date:** 2026-07-07
- **Author:** motion-engineer + main
- **Type:** feat
- **Chapter/Area:** 01 Hero (revision — design_system v2 §11.1, §3.0b #1)

## Summary

Added the aurora background confirmed by the reference video analysis: a diffuse, slow-drifting ember glow, upper-right-weighted, fading to the void at the edges and fading out (with the draw loop genuinely frozen, not just hidden) as the user scrolls past the hero. Canvas-blob implementation per the approved decision — 2D canvas, no WebGL lib; React Bits was the visual sketch only, implemented natively in GSAP per `animated-ui-references`.

## Files touched

- `src/features/home/components/AuroraBackground.tsx` (NEW) — `aria-hidden` `absolute inset-0 -z-10 pointer-events-none` wrapper; raw `<canvas>` (documented leaf exception) with `blur-3xl scale-110`; three low-alpha radial blobs (`globalCompositeOperation: "lighter"`) drifting on sin/cos of `gsap.ticker` time; colors read at mount from computed `--accent`/`--accent-deep` (token-driven, no hex literals). Perf: buffer at 0.5× CSS px (single `RESOLUTION` knob, satisfies the DPR cap), tick short-circuits on `document.hidden` / IntersectionObserver-offscreen / ScrollTrigger `progress === 1`; ResizeObserver sizes the buffer. Scroll fade: ScrollTrigger `top top → bottom top`, scrub, `autoAlpha 1→0`, `invalidateOnRefresh`. Reduced motion: alternate JSX — no canvas/ticker/observers, static `radial-gradient(ellipse at 75% 20%, var(--accent-tint), transparent 60%)` Box.
- `src/features/home/sections/HeroSection.tsx` — section className + `relative isolate`; `<AuroraBackground />` mounted as first child. Nothing else touched.
- `.claude/agent-memory/motion-engineer/MEMORY.md` — aurora pattern recorded.
- `.artifacts/qa-log.md` — B2 audit section (qa-auditor).

## Notable decisions

- No props — single-use; the ScrollTrigger trigger is `closest("section")`.
- `ponytail:` marks in code: hex→rgba helper assumes 6-digit hex (all globals.css tokens are); token colors read once at mount — if a live theme toggle ever mounts on the hero, wire a re-read (site is dark-only at runtime today, no `ThemeToggle` mounted).

## Verification

- [x] `npx tsc --noEmit` + `npm run lint` clean
- [x] qa-auditor full pass (zero code findings): hygiene greps, cleanup correctness, StrictMode double-mount safe
- [x] Runtime (puppeteer): canvas paints; wrapper opacity 0 + draw loop provably frozen past 1.1×vh; resumes on scroll-back; **reduced-motion renders no canvas at all** (static token gradient, h1 immediately visible); zero console errors
- [x] Visual (chrome-devtools MCP): upper-right ember glow matches `reference/frames/frame_001.png` mood; subtle, not a wash

## Follow-ups

- B3 next: Journey PathDraw rail + awards invert band.
- If a theme toggle ships on the hero later: re-read token colors on theme change (documented in-code).
