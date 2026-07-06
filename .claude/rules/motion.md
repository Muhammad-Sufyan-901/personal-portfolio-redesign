---
paths:
  - "src/lib/gsap.ts"
  - "src/providers/SmoothScrollProvider.tsx"
  - "src/components/common/**/*.tsx"
  - "src/hooks/**/*.ts"
  - "src/features/**/sections/**/*.tsx"
---

# Motion rules (GSAP + Lenis) — see design_system.md §7

- Import GSAP ONLY from `@/lib/gsap` (single source that registers ScrollTrigger + eases).
- Lenis is instantiated ONCE in `SmoothScrollProvider`; sync `lenis.raf` ↔ `gsap.ticker`, call `ScrollTrigger.update()` on scroll and `ScrollTrigger.refresh()` on resize/route change.
- Wrap every animation in `useGSAP(() => {…}, { scope: ref })` for automatic cleanup.
- Split text with `split-type`; wrap reveal targets in an `overflow-hidden` parent; re-split on refresh (`invalidateOnRefresh: true`).
- EVERY effect needs a `prefers-reduced-motion` branch: opacity-only reveal, Lenis disabled (native scroll), custom cursor hidden. Read it via `usePrefersReducedMotion()`.
- Motion tokens (eases/durations) come from `@theme`; don't hardcode bespoke curves per component.
