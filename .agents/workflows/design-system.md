# Workflow: bootstrap design system + motion foundation (Stage 2, step 1–2)

Owner: @motion (+ @frontend for tokens). Run after plan approval.

> **Status: this workflow has already run — twice.** The original 2026-07-07 bootstrap (commits `2abbe94` + `1bfd6a5`, pre-reset) was deleted with the `chore(reset)`; the **B0 re-bootstrap** (`chore(setup)`, per PLAN v3) rebuilt the foundation the same day **with the ember Void & Ember v2 tokens applied** — tokens, fonts (Fraunces display), all 14 primitives, providers/hooks/store, full data layer. Nothing here remains to run; it exists as process documentation.

1. Scaffold structure per `system_architecture.md §3`; install deps (`§7`); remove auth/dashboard/middlewares. *(Done — gsap `^3.15.0`, lenis `^1.3.25`, split-type, @gsap/react, zustand, react-hook-form, @emailjs/browser installed; boilerplate removed earlier at `9be4947`.)*
2. Fonts + `globals.css` `@theme` tokens from `design_system.md §9`; base styles (selection, focus ring, reduced-motion). *(Done — ember v2 values, Fraunces + JetBrains Mono via @fontsource, self-hosted General Sans.)*
3. `lib/gsap.ts` + `SmoothScrollProvider` + `AppProviders`; hooks (`useLenis`, `usePrefersReducedMotion`, `useIsomorphicLayoutEffect`). *(Done.)*
4. Motion primitives (`RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `Cursor`, `Preloader`, `ChapterEyebrow`, `PathDraw`) — each with reduced-motion fallback. *(Done — all eight live in `src/components/common/`; PathDraw not yet wired into a section.)*
5. Smoke-test one reveal end-to-end. Commit (one logical unit per `rules/commit-rules.md`), with its log entry.
