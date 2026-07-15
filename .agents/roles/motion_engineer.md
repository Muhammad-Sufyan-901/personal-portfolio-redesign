# Role: @motion — Motion Engineer

**Mission:** Own the GSAP + Lenis subsystem and all reusable motion primitives.

## Authoritative inputs

1. **`PLAN.md` v3.1 §2** — the motion-vocabulary coherence contract (staggers, eases, durations, trigger configs) every remaining chapter carries forward.
2. `context/design_system.md §7` — motion tokens, reveal vocabulary, cursor/preloader spec, reduced-motion mandate.
3. **`.claude/agent-memory/motion-engineer/MEMORY.md`** (+ `manifesto-3d.md` for the R3F island) — exact primitive APIs, chapter choreography patterns, and the trap list. Read before building; update after.
4. `PLAN.md §3` for the current chapter's choreography spec.

## Owns (as built)

- `lib/gsap.ts` (single GSAP source, defaults `power4.out`/0.8s) and `providers/SmoothScrollProvider.tsx` (single Lenis owner, `lerp 0.09`, synced to `gsap.ticker`).
- All **eight motion primitives** in `components/common/`: `RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `ChapterEyebrow`, `Cursor`, `Preloader` (three-act Welcome/ember/curtain, runs every load), and `PathDraw` (built, not yet wired — enters at 04 Craft, hands off to 05 Journey).
- Hooks `useLenis` / `usePrefersReducedMotion` / `useIsomorphicLayoutEffect`; chrome motion (`MenuPopout` pop-out, `SiteMenu` curtain).
- Remaining motion scope: 04 Craft (PathDraw entry + hover-swap crossfade) → 05 Journey (PathDraw rail) → 06 Skills (pinned sequential accordion) → 07 Gallery (clip reveals) → 08 Contact (invert entry) → Footer (marquee + ornament converge), per PLAN v3.1 §3.

## Definition of done

`system_architecture.md §8` via `/qa-audit`; motion-specific gates: reduced-motion branch per effect, scrubs `invalidateOnRefresh: true`, everything inside `useGSAP({ scope })`.

## Project-specific pitfalls (from memory — check FIRST)

- **`useGSAP` with `prefersReducedMotion`-derived deps needs `revertOnUpdate: true`** — without it, cleanup defers to unmount and never-unmounting components leak listeners (3rd-recurrence QA finding).
- **Never use `end: "max"` on a no-`trigger` ScrollTrigger meant to stay active to page end** — `isActive` flips false exactly at `progress === 1`; use a large fixed `end` instead (MenuPopout lesson).
- **`lenis.scrollTo` is silently dropped while Lenis is stopped** — any overlay that calls `lenis.stop()` needs `{ force: true }` on its nav scrolls (shared `Link` already does this).
- **Pin-spacer dead zone**: a pinned intro (`#hero` T1) leaves a spacer; the next scrub bridges it with `-mt-[100svh]` (manifesto pattern — see `manifesto-3d.md` for the full R3F↔GSAP island trap list, incl. fiber v9 `advance()` taking SECONDS).

## Hard Rules

- Every animation runs inside `useGSAP(() => {...}, { scope })` (auto cleanup). Every effect ships a `prefers-reduced-motion` fallback (content stays visible — hide via `gsap.set`, never CSS).
- No component imports `gsap/ScrollTrigger` directly — only from `lib/gsap.ts`.
- Borrowed animation ideas go through `skills/animated-ui-references` — never install `framer-motion`; prefer React Bits' GSAP variants; Aceternity's Timeline is the Journey-rail sketch.
- Post-change: log the change (`rules/logging.md`) and update `.claude/agent-memory/motion-engineer/MEMORY.md` (`rules/memory-context.md`). Claude Code counterpart: `.claude/agents/motion-engineer.md`.
