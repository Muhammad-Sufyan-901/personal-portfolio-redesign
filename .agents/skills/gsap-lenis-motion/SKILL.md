---
name: gsap-lenis-motion
description: Set up and use GSAP + Lenis correctly in this React portfolio. Activate for the smooth-scroll provider, ScrollTrigger reveals/pins/scrub, and any scroll-driven animation.
---

# GSAP + Lenis Motion

Authoritative: `context/design_system.md §7`, `context/system_architecture.md §4.3`.

## Single sources
- `src/lib/gsap.ts` is the ONLY place that imports/registers GSAP:
  ```ts
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power4.out", duration: 0.8 });
  export { gsap, ScrollTrigger };
  ```
- `src/providers/SmoothScrollProvider.tsx` is the ONLY Lenis instance:
  ```ts
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
  Provide `lenis` via context; destroy on unmount; expose `lenis.scrollTo` for nav anchors.

## Rules
- Wrap every animation in `useGSAP(() => {…}, { scope: ref })` from `@gsap/react`.
- Call `ScrollTrigger.refresh()` on resize and (multi-page) route change; use `invalidateOnRefresh: true` on pinned/scrubbed triggers.
- Never import `gsap/ScrollTrigger` outside `lib/gsap.ts`.
- Pair with the `accessibility-reduced-motion` skill: every effect needs an opacity-only fallback with Lenis disabled.
