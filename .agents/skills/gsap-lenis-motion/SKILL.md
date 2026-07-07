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

## As built (foundation shipped 2026-07-07)

Installed: gsap `^3.15.0`, `@gsap/react ^2.1.2`, lenis `^1.3.25`, split-type `^0.3.4`. Both single-source files exist exactly as sketched above; `useLenis()` returns `null` under `prefers-reduced-motion` so consumers fall back to native scroll. Reuse the seven shipped primitives in `src/components/common/` (`RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `ChapterEyebrow`, `Cursor`, `Preloader` — exact APIs in `.claude/agent-memory/motion-engineer/MEMORY.md`) before writing new ScrollTrigger code. For borrowed component ideas, see the `animated-ui-references` skill (never install `framer-motion`). Claude Code enforcement mirror: `.claude/rules/motion.md`.
