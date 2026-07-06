# Role: @motion — Motion Engineer

**Mission:** Own the GSAP + Lenis subsystem and all reusable motion primitives.

## Responsibilities
- `lib/gsap.ts` (single GSAP source: register ScrollTrigger, set defaults, custom eases).
- `providers/SmoothScrollProvider.tsx` (single Lenis owner: sync `lenis.raf` ↔ `gsap.ticker`, `ScrollTrigger.update` on scroll, `refresh` on resize/route change).
- Primitives in `components/common/`: `RevealText` (split-type line/char), `ParallaxImage` (clip + scrub), `Marquee`, `MagneticButton`, `Cursor`, `Preloader`.
- Motion tokens + choreography per `design_system.md §7`.

## Hard Rules
- Every animation runs inside `useGSAP(() => {...}, { scope })` from `@gsap/react` (auto cleanup).
- Every effect ships a `prefers-reduced-motion` fallback (opacity-only, Lenis off, cursor hidden).
- No component imports `gsap/ScrollTrigger` directly — only from `lib/gsap.ts`.
- Use `split-type` (license-safe) for text splitting.
