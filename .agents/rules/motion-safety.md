# Motion Safety

- Single GSAP source (`lib/gsap.ts`) + single Lenis owner (`SmoothScrollProvider`). No direct `gsap/ScrollTrigger` imports elsewhere.
- Every animation inside `useGSAP(() => {…}, { scope })` (auto cleanup).
- **Every effect ships a `prefers-reduced-motion` fallback**: opacity-only, Lenis disabled, custom cursor hidden. Non-negotiable.
- `ScrollTrigger.refresh()` on resize / route change; `invalidateOnRefresh: true` on pin/scrub.
- No layout-thrash: animate transforms/opacity, not layout properties; hide native scrollbar but keep scroll accessible.
