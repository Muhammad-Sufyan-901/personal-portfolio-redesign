---
paths:
  - "src/lib/gsap.ts"
  - "src/providers/SmoothScrollProvider.tsx"
  - "src/components/common/**/*.tsx"
  - "src/hooks/**/*.ts"
  - "src/features/**/sections/**/*.tsx"
---

# Motion rules (GSAP + Lenis) — see design_system.md §7, `.agents/skills/gsap-lenis-motion`

> Twin: `.agents/rules/motion-safety.md` (portable mirror — same rule, keep in sync).

- Import GSAP ONLY from `@/lib/gsap` (single source that registers ScrollTrigger + eases).
- Lenis is instantiated ONCE in `SmoothScrollProvider`; sync `lenis.raf` ↔ `gsap.ticker`, call `ScrollTrigger.update()` on scroll and `ScrollTrigger.refresh()` on resize/route change.
- Wrap every animation in `useGSAP(() => {…}, { scope: ref })` for automatic cleanup.
- Split text with `split-type`; wrap reveal targets in an `overflow-hidden` parent; re-split on refresh (`invalidateOnRefresh: true`).
- EVERY effect needs a `prefers-reduced-motion` branch: opacity-only reveal, Lenis disabled (native scroll), custom cursor hidden. Read it via `usePrefersReducedMotion()`.
- Motion tokens (eases/durations) come from `@theme`; don't hardcode bespoke curves per component.

## As-built specifics (post-reset B0 re-bootstrap, chapters 00–03 live)

- Installed stack: gsap `^3.15.0`, `@gsap/react` (`useGSAP`), lenis `^1.3.25`, split-type.
- `src/lib/gsap.ts` sets `gsap.defaults({ ease: "power4.out", duration: 0.8 })` — matches `--ease-out`/`--dur-base`. `SmoothScrollProvider` uses `lerp: 0.09`; `useLenis()` exposes the instance (returns `null` under reduced motion → callers fall back to native scroll, as the common `Link` does).
- **Reuse the shipped primitives** before writing new ScrollTrigger code: `RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `ChapterEyebrow`, `Cursor`, `Preloader`, `PathDraw` (APIs in `.claude/rules/custom-components.md` and motion-engineer memory). New reusable motion goes into `components/common` with the same reduced-motion contract.
- Established chapter choreography to stay consistent with (PLAN v3.1 §2 is the full contract): hero char reveal gated on `useUIStore.preloaderDone`; the manifesto WebGL seam (pin + 520vh channels scrub); `PathDraw` enters at 04 Craft and hands off to 05 Journey; marquee at 30s/loop.
- Borrowing an animation idea from React Bits / Magic UI / Aceternity / 21st.dev? Follow `.agents/skills/animated-ui-references` — never install `framer-motion`; reimplement in `useGSAP`.

**Why this matters here:** a second GSAP registration or Lenis instance desyncs `ScrollTrigger` for every pinned/scrubbed chapter at once (manifesto pin, journey rail) — the failure shows up pages away from the offending import, which is why centralization is a hard rule and the QA auditor greps for stray `gsap/ScrollTrigger` imports.
