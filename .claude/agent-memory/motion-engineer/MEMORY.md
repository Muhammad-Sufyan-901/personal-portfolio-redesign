# Motion Engineer — Project Memory

## Motion architecture (single sources)
- GSAP registered ONLY in `src/lib/gsap.ts` (registers ScrollTrigger + custom eases; exports `gsap`, `ScrollTrigger`). No other file imports `gsap/ScrollTrigger`.
- Lenis instantiated ONLY in `src/providers/SmoothScrollProvider.tsx`: `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`; provide via context; destroy on unmount.
- Every animation in `useGSAP(() => {…}, { scope: ref })` from `@gsap/react`. `ScrollTrigger.refresh()` on resize/route change; `invalidateOnRefresh: true` on pin/scrub.
- Text split via `split-type`; wrap reveal targets in `overflow-hidden`.

## Reduced motion (mandatory)
- `usePrefersReducedMotion()` → when true: opacity-only reveals, disable Lenis (native scroll), hide custom cursor. Build the fallback alongside each effect.

## Motion tokens (from design_system §7)
- `--ease-out cubic-bezier(0.16,1,0.3,1)`, `--ease-inout cubic-bezier(0.83,0,0.17,1)`; durations 0.4/0.8/1.2s; Lenis `lerp 0.09`; stagger 0.02–0.04s/char, 0.08s/line.

## Primitives to own (in components/common)
`RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `Cursor`, `Preloader`. JSX that renders layout uses `@/components/common` (`Box` etc.), not bare tags.

## Decisions log (durable facts only)
- (none yet)
