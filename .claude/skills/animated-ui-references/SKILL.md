---
name: animated-ui-references
description: Consult the four vetted animated-component libraries (React Bits, Magic UI, Aceternity UI, 21st.dev) and adapt a component idea to this project's stack — GSAP-only, custom primitives, tokens. Use whenever borrowing an external animation/component pattern.
argument-hint: [component idea or chapter, e.g. "journey timeline" or "hero aurora"]
---

# /animated-ui-references $ARGUMENTS (stub — canonical in `.agents/skills/animated-ui-references/`)

KNOWLEDGE skill: read the canonical `.agents/skills/animated-ui-references/SKILL.md` —
the four-library table (which library fits which chapter) and the **mandatory 3-step
adaptation rule**. Non-negotiable summary: never install `framer-motion`/`motion`;
strip Motion logic → reimplement in `useGSAP` from `@/lib/gsap` with a reduced-motion
fallback; swap raw tags for `@/components/common` primitives; re-express styles as
`@theme` tokens. Authoritative spec: `design_system.md §7.5`.
