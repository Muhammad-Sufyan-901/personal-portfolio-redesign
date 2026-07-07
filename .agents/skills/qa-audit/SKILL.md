---
name: qa-audit
description: Run the Definition of Done (types, lint, hygiene greps, a11y, reduced-motion, performance, SEO) for one chapter or the whole site and write findings to .artifacts/qa-log.md. Portable mirror of the invokable .claude/skills/qa-audit.
---

# QA Audit (portable)

**What it does:** runs `system_architecture.md §8` against a chapter (or "all"): `tsc --noEmit` + eslint clean; greps for cross-feature imports, raw hex (`#[0-9a-fA-F]{6}`), and bare HTML tags in feature TSX; verifies the `prefers-reduced-motion` branch and Lenis↔ScrollTrigger refresh; keyboard/focus/alt/landmarks (incl. overlay `inert` containment); Lighthouse ≥ 90 all categories; SEO/meta per the `seo-meta` skill; and that a `logs/feature-changes/` entry exists for the audited work. Findings go to `.artifacts/qa-log.md` with severity + concrete fix — the auditor never edits feature source.

**When to use:** per section, before that section's approval gate, and once globally at the end (`workflows/qa.md`).

(Claude Code: `/qa-audit [chapter|all]`, which delegates to the read-only `qa-auditor` subagent; browser smoke tests use its documented puppeteer fallback since the chrome-devtools MCP isn't exposed in subagent threads.)
