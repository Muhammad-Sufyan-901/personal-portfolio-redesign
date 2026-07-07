# Workflow: bootstrap design system + motion foundation (Stage 2, step 1–2)

Owner: @motion (+ @frontend for tokens). Run after plan approval.

> **Status: this workflow has already run** (2026-07-07, commits `2abbe94` `chore(setup)` + `1bfd6a5` `feat(motion)` — see `logs/feature-changes/2026-07-07-{bootstrap-deps-fonts-tokens,motion-foundation}.md`). It shipped with the interim Warm Ink + Cobalt tokens; the remaining foundation work is the **ember re-theme** of `src/styles/globals.css` to the design_system v2 §9 values — a token-values-only change since components style by token name.

1. Scaffold structure per `system_architecture.md §3`; install deps (`§7`); remove auth/dashboard/middlewares. *(Done — gsap `^3.15.0`, lenis `^1.3.25`, split-type, @gsap/react, zustand, react-hook-form, @emailjs/browser installed; boilerplate removed earlier at `9be4947`.)*
2. Fonts + `globals.css` `@theme` tokens from `design_system.md §9`; base styles (selection, focus ring, reduced-motion). *(Done for v1/cobalt — Fraunces + JetBrains Mono via @fontsource, self-hosted General Sans; redo token values for v2 ember.)*
3. `lib/gsap.ts` + `SmoothScrollProvider` + `AppProviders`; hooks (`useLenis`, `usePrefersReducedMotion`, `useIsomorphicLayoutEffect`). *(Done.)*
4. Motion primitives (`RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `Cursor`, `Preloader` — plus `ChapterEyebrow`) — each with reduced-motion fallback. *(Done — all seven live in `src/components/common/`.)*
5. Smoke-test one reveal end-to-end. Commit (one logical unit per `rules/commit-rules.md`), with its log entry.
