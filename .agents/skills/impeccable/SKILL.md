---
name: impeccable
description: Pointer to the installed third-party design-improvement toolkit in .claude/skills/impeccable (v3.9.1) — ~25 subcommands for design, critique, polish, motion, and live browser iteration. Implementation lives only on the .claude side.
---

# impeccable (pointer — implementation in `.claude/skills/impeccable/`)

**What it is:** a large vendored design toolkit (SKILL.md + 28 reference docs + a ~67-file script engine) with subcommands like `audit`, `critique`, `polish`, `animate`, `colorize`, `typeset`, `harden`, `live` (browser iteration server), plus an anti-pattern detector that runs as a PostToolUse hook on every Edit/Write (`.claude/settings.local.json`).

**Why it's installed here:** adopted during agent-tooling setup (`logs/feature-changes/2026-07-06-setup-tooling.md`) to keep a motion-first, taste-critical portfolio from drifting into "AI slop" — its design rules, bans, and detector complement the project's own design_system.md.

**When to reach for it:** UI critique/polish passes on a built chapter, ambitious visual effects, color/typography interrogation, or live in-browser iteration on a section. It complements — never overrides — this project's authoritative specs: design_system.md v2 tokens, the custom-primitives house style, and the single-GSAP-source rule.

**Where it lives:** only in `.claude/skills/impeccable/` (dozens of files — deliberately NOT mirrored into `.agents/`). Non-Claude agents can read that folder directly; the entry point is its `SKILL.md`.
