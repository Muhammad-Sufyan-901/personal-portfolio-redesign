---
description: Search the web for Claude Code skills and MCP servers relevant to this project's stack (React 19, Vite, TanStack Router, Tailwind v4, shadcn/ui, GSAP, Lenis, TypeScript), evaluate them, and propose adding the best fits. Proposes only — never installs without approval.
argument-hint: [optional focus, e.g. "gsap" or "mcp"]
---

# /discover-tooling $ARGUMENTS

Use the WebSearch and WebFetch tools to find community skills and MCP servers that fit THIS project, then propose the strongest matches. Scope with "$ARGUMENTS" if provided (e.g. only MCP, or only motion).

## 1. Read context first
Skim `.agents/context/system_architecture.md` + this repo's `package.json` so recommendations match the real stack: React 19, Vite 7, TanStack Router, Tailwind v4, shadcn/ui, GSAP + ScrollTrigger, Lenis, split-type, TypeScript strict, EmailJS.

## 2. Search
- **Skills:** search for Claude Code skills/plugins for these topics — e.g. `awesome-claude-code skills`, `claude code skill tailwind v4`, `claude code skill tanstack router`, `claude code gsap skill`, plugin hubs/marketplaces. Prefer official (`docs.claude.com`, Anthropic repos) and well-maintained community sources.
- **MCP:** search MCP registries/directories for servers useful here — e.g. up-to-date library docs (Context7), a Figma-to-code server (design handoff — the user uses Figma), Playwright/Chrome DevTools MCP for visual/perf checks. Try queries like `MCP server context7`, `figma MCP server`, `awesome mcp servers frontend`.

## 3. Evaluate
For each candidate, note: what it does, why it fits this project, maintenance/trust signal (stars/last update/author), and install method. Discard anything unmaintained, redundant with existing skills, or requiring services the user hasn't opted into.

## 4. Propose (do NOT auto-install)
Present a short ranked table: name · type (skill/MCP) · fit · how to add. On approval:
- Skills → add under `.claude/skills/<name>/SKILL.md` (or install the plugin).
- MCP → add to `.mcp.json` at repo root (see `.mcp.json.example`); note any required env/keys and never commit secrets.

Then log the additions via `/log-change` and record durable tooling choices in the relevant agent's MEMORY.md.
