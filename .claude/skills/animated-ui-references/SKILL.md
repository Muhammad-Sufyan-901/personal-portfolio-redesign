---
description: Consult the four vetted animated-component libraries (React Bits, Magic UI, Aceternity UI, 21st.dev) and adapt a component idea to this project's stack — GSAP-only, custom primitives, tokens. Use whenever borrowing an external animation/component pattern.
argument-hint: [component idea or chapter, e.g. "journey timeline" or "hero aurora"]
---

# /animated-ui-references $ARGUMENTS

Authoritative spec: `.agents/context/design_system.md §7.5`; full portable version: `.agents/skills/animated-ui-references/SKILL.md`.

Find a reference for **$ARGUMENTS** in the vetted set, then adapt it:

- **React Bits** (reactbits.dev) — pick its **GSAP-native variant** when one exists; best for Hero/Preloader flourishes (text-split reveals, the §11.1 aurora background). Lowest adaptation cost.
- **Magic UI** (magicui.design) — Framer Motion + Tailwind; marquee/shimmer/bento layout ideas (Craft, Contact, Selected Work).
- **Aceternity UI** (ui.aceternity.com) — Framer Motion + Tailwind/shadcn blocks; its **Timeline** is the sketch for the Journey bold-path rail (§11.4), Spotlight/Lamp for Hero.
- **21st.dev** — registry search engine across community components (`npx shadcn@latest add "https://21st.dev/r/<author>/<component>"` to inspect a candidate).

**Mandatory adaptation before anything lands in `src/` (non-negotiable):**
1. **Never install `framer-motion`/`motion`** — single-motion-stack rule (design_system §10 note 3; gsap `^3.15.0` is the only animation runtime). Strip all `motion.div` logic and reimplement the effect with `gsap`/`ScrollTrigger` inside `useGSAP({ scope })`, importing only from `@/lib/gsap`, with a `prefers-reduced-motion` fallback.
2. Replace every raw HTML tag with `@/components/common` primitives (`Box`, `Text`, `Heading`, `Link`, `Image`) per `.claude/rules/custom-components.md`.
3. Re-express hard-coded colors/spacing as `@theme` tokens (`bg-ink`, `text-accent`, …).

React Bits GSAP variants need only steps 2–3. Borrowed pattern = a sketch to rebuild, not a package to install. The `frontend-engineer` and `motion-engineer` subagents follow this skill during section builds.
