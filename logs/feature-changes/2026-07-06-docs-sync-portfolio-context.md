# Docs sync: README / CLAUDE / GEMINI / AGENTS to portfolio context

- **Date:** 2026-07-06
- **Author:** main
- **Type:** chore
- **Chapter/Area:** documentation

## Summary
The root docs still described the deleted enterprise boilerplate (stock Vite README; CLAUDE.md/GEMINI.md referencing auth, dashboard, axios, Zustand, middlewares). Rewrote them to match the cleaned portfolio shell after `9be4947` and the agent workflow, with `.agents/context/*` kept as the single source of truth (docs summarize and point there). Added a committed cross-tool agents overview.

## Files touched
- `README.md` — full rewrite: portfolio pitch, stack (installed vs motion-bootstrap), scripts, EmailJS env vars, post-cleanup structure.
- `CLAUDE.md` — rewrote "Repo state" and "Architecture" for the cleaned shell; dropped the `VITE_API_BASE_URL` backend line; reworded the stack-additions bullet. "AI agent operating rules" and ".claude directory additions" untouched.
- `gemini.md` — full rewrite mirroring CLAUDE.md (repo state, stack, commands, redesign context, current architecture, component-primitive table, working rules); deleted the stale React 18 boilerplate spec.
- `AGENTS.md` — new committed overview: `.agents/`/`.claude/` layers, roster (@pm/@frontend/@motion/@qa), workflow, skills/commands/MCP inventory.

## Notable decisions
- `AGENTS.md` is the committed cross-tool convention file; gitignored `AGENT_README.md`/`AGENT_NOTES.md` stay local-only scratch.
- Motion stack (GSAP, Lenis, split-type, @gsap/react, EmailJS) documented as "installed at redesign bootstrap", not present — matches package.json.
- Documented planned EmailJS env vars (`VITE_EMAILJS_*`) instead of the orphaned `VITE_API_BASE_URL`.

## Verification
- [x] `npx tsc --noEmit` clean (no code changed)
- [x] `npm run lint` clean (no code changed)
- [x] grep of all four docs for stale terms (axios/zustand/dashboard/authMiddleware/api.type/VITE_API_BASE_URL/React 18) — only intentional historical mentions remain
- [x] every path referenced in the docs verified to exist on disk
- [ ] reduced-motion / a11y — n/a (docs only)
- [ ] Lighthouse — n/a (docs only)

## Follow-ups
- `package.json` `name` is still `react-ts-enterprise-boilerplate` — rename to `portfolio-redesign` when convenient.
- `.env` still contains the orphaned `VITE_API_BASE_URL`; replace with the EmailJS keys at contact-form build time (`.env` is gitignored, local-only).
