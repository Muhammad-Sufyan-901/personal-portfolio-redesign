# Agent tooling setup: skills, MCP servers, config wiring

- **Date:** 2026-07-06
- **Author:** main
- **Type:** chore
- **Chapter/Area:** tooling / agent workflow (no `src/` changes)

## Summary

Made the AI-agent workflow operational before any app code: activated the `custom-components` output style and WebSearch/WebFetch permissions in settings, promoted the staged MCP config to an active root `.mcp.json` with three servers, installed two vetted design-quality skills (impeccable, design-taste-frontend), and pinned Prettier so the PostToolUse format hook uses the local, `.prettierrc`-respecting install.

## Files touched

- `.claude/settings.json` — added `"outputStyle": "custom-components"`, `WebSearch` + `WebFetch` in `permissions.allow` (existing permissions/hook untouched).
- `.mcp.json` — moved from `.claude/.mcp.json` (was staged/disabled); keeps `context7`, adds `chrome-devtools` (official Google — perf traces/insights for the Lighthouse ≥ 90 gate in `/qa-audit`) and `shadcn` (official registry MCP, pairs with `/add-shadcn`). No secrets; optional `CONTEXT7_API_KEY` documented as an env var.
- `.claude/skills/impeccable/` — installed via `npx impeccable install` (Paul Bakaus, v3.9.1). SKILL.md skimmed and vetted; its scripts are scoped to its own dir and `allowed-tools` is narrow.
- `.claude/skills/design-taste-frontend/SKILL.md` — copied from github.com/Leonxlnx/taste-skill (`skills/taste-skill/SKILL.md`, MIT). Anti-slop skill for portfolios with GSAP-aware motion/variance/density dials.
- `package.json` / `package-lock.json` — `prettier` added to devDependencies.

## Notable decisions

- **Both impeccable and taste-skill installed** despite heavy overlap (and overlap with the `frontend-design` / `ui-ux-pro-max` plugins) — user chose max coverage explicitly.
- **Skipped**: standalone Figma MCP (official Figma plugin already installed and is Figma's recommended Claude Code setup), Playwright MCP (overlaps chrome-devtools for QA; user declined), all GSAP MCP servers (only obscure community ones exist — Context7 covers GSAP docs).
- **Context7 kept in `.mcp.json`** even though the Context7 plugin is active, so the repo stays portable for environments without the plugin.
- Removed installer side effects: stray `.codex/` dir and duplicate `.agents/skills/impeccable/` (kit rule: installers touch `.claude/` only; `.agents/` stays the hand-authored portable spec).

## Verification

- [x] `.claude/settings.json` and `.mcp.json` parse clean (`python3 -m json.tool`)
- [x] `format.sh` executable; smoke-tested by piping hook JSON — prettier 3.9.4 reformatted a scratch `.ts` file
- [x] `git status` — zero changes under `src/`
- [ ] `/doctor` + `/agents` (3 subagents) + MCP connect — require a Claude Code restart; run after restarting

## Follow-ups

- Restart Claude Code, then run `/doctor`, `/agents`, and `/mcp` to confirm the output style, subagents, and the three MCP servers load.
- Run `/impeccable init` once to generate its PRODUCT.md design context (it will read `.agents/context/*`).
- Optional: set `CONTEXT7_API_KEY` in the shell for higher Context7 rate limits.
