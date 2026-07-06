# Workflow: bootstrap design system + motion foundation (Stage 2, step 1–2)

Owner: @motion (+ @frontend for tokens). Run after plan approval.

1. Scaffold structure per `system_architecture.md §3`; install deps (`§7`); remove auth/dashboard/middlewares.
2. Fonts + `globals.css` `@theme` tokens from `design_system.md §9`; base styles (selection, focus ring, reduced-motion).
3. `lib/gsap.ts` + `SmoothScrollProvider` + `AppProviders`; hooks (`useLenis`, `usePrefersReducedMotion`, `useIsomorphicLayoutEffect`).
4. Motion primitives (`RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `Cursor`, `Preloader`) — each with reduced-motion fallback.
5. Smoke-test one reveal end-to-end. Commit.
