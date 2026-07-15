# Motion Safety

> Twin: `.claude/rules/motion.md` (path-scoped Claude Code mirror — same rule, keep in sync).

- Single GSAP source (`lib/gsap.ts`) + single Lenis owner (`SmoothScrollProvider`). No direct `gsap/ScrollTrigger` imports elsewhere.
- Every animation inside `useGSAP(() => {…}, { scope })` (auto cleanup).
- **Every effect ships a `prefers-reduced-motion` fallback**: opacity-only, Lenis disabled, custom cursor hidden. Non-negotiable.
- `ScrollTrigger.refresh()` on resize / route change; `invalidateOnRefresh: true` on pin/scrub.
- No layout-thrash: animate transforms/opacity, not layout properties; hide native scrollbar but keep scroll accessible.

**Why this matters here:** the installed stack is gsap `^3.15.0` + `@gsap/react` + lenis `^1.3.25` + split-type, with both single-source files shipped (`src/lib/gsap.ts`, `src/providers/SmoothScrollProvider.tsx`) and eight motion primitives depending on them. A second GSAP registration or Lenis instance desyncs every pinned/scrubbed chapter at once (manifesto pin, journey rail) — and the failure surfaces far from the offending import. Adapting external components? `skills/animated-ui-references` — never add `framer-motion`.
