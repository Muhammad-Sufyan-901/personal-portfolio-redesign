---
name: animated-ui-references
description: How to borrow from the four vetted animated-component libraries (React Bits, Magic UI, Aceternity UI, 21st.dev) without breaking the single-GSAP-source, custom-primitives, or tokens-only rules. Activate whenever adapting an external component/animation idea.
---

# Animated UI Reference Libraries

Authoritative: `context/design_system.md §7.5` (v2). These four are **inspiration + markup/layout sources** for specific moments — never drop-in dependencies. Browse for the visual idea, then rebuild the animation on our stack.

## The four libraries

| Library | URL | Native animation engine | Best fit in this portfolio |
| --- | --- | --- | --- |
| **React Bits** | reactbits.dev | **GSAP-native variants available** (also React-Spring, Framer Motion, Three.js — always pick the GSAP variant) | Hero/Preloader flourishes: text-split reveals, particle/**aurora** backgrounds (the Hero aurora glow, §11.1). Lowest adaptation cost of the four — it already speaks GSAP. |
| **Magic UI** | magicui.design | Motion (Framer Motion) + Tailwind, shadcn-installable | Craft chapter keyword `Marquee` ideas, Contact shimmer/magnetic button feel, Gallery (07) bento-grid layout ideas. |
| **Aceternity UI** | ui.aceternity.com | Motion (Framer Motion) + Tailwind, also ships as shadcn blocks | Its **Timeline** (sticky header + scroll-beam-follow) is the near-literal sketch for the Journey chapter's scrubbed **bold-path rail** (§11.5 on the 10-chapter map — our `PathDraw` primitive); Spotlight/Lamp for Hero; sticky-navbar-hides matches §8.A. |
| **21st.dev** | 21st.dev | Marketplace/registry aggregating community components (shadcn-compatible, usually Motion-based) | A search engine across the ecosystem when you need "a \<specific micro-interaction\>"; install candidates via `npx shadcn@latest add "https://21st.dev/r/<author>/<component>"` — then adapt per below before it touches `src/`. |

## Mandatory adaptation rule (non-negotiable)

All four are copy-paste sources for **layout, Tailwind classes, and the visual idea only**. **Never install `framer-motion`/`motion` as a project dependency** — it violates the single-motion-stack rule (design_system §10 note 3; `rules/motion-safety.md`; gsap `^3.15.0` is the only animation runtime) and would double the animation payload. Before anything borrowed lands in `src/`:

1. **Strip the Framer logic** — remove every `motion.div`/`useAnimation`/variants construct and reimplement the same effect with `gsap`/`ScrollTrigger` inside `useGSAP({ scope })`, importing only from `@/lib/gsap`. Add the `prefers-reduced-motion` fallback the source won't have.
2. **Swap the markup** — replace every raw HTML tag (`div`, `p`, `span`, `h*`, `a`, `img`) with our primitives (`Box`, `Container`, `Text`, `Heading`, `Link`, `Image`) per design_system §8 and `.claude/rules/custom-components.md`.
3. **Re-express the styling** — hard-coded colors/spacing/shadows become our `@theme` tokens (`bg-ink`, `text-paper`, `text-accent`, …) per `tailwind-v4-shadcn`.

React Bits components already using their GSAP variant need only steps 2–3. Treat every borrowed pattern as **a sketch to rebuild, not a package to install**.

## Who uses this

The @frontend and @motion roles (and their `.claude/agents/{frontend-engineer,motion-engineer}.md` counterparts) consult this skill during any section build that borrows an external idea — e.g. Aceternity's Timeline for the Journey rail (05), React Bits aurora for the Hero background (shipped). For 3D/cinematic technique numbers, the vendored `cinematic-web` skill complements this one (read its ADAPTATION.md).

(Claude Code: `/animated-ui-references` — a stub pointing here.)
