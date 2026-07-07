---
name: discover-tooling
description: Search the internet for Claude Code skills and MCP servers relevant to this project's stack, evaluate them, and propose the best fits (propose only, never auto-install).
---

# Discover Skills & MCP (portable)

Using web search/fetch, find community skills and MCP servers that fit this stack (React 19, Vite, TanStack Router, Tailwind v4, shadcn/ui, GSAP + ScrollTrigger, Lenis, TypeScript strict, EmailJS).

- **Skills:** awesome-claude-code lists, plugin hubs, topic-specific skills (tailwind v4, tanstack router, gsap). Prefer official/well-maintained.
- **MCP:** registries for useful servers — up-to-date library docs (Context7), Figma-to-code (design handoff), Playwright/Chrome DevTools (visual/perf checks).
- Evaluate fit + maintenance/trust; discard unmaintained/redundant/opt-in-service ones.
- **Propose, don't install:** present a ranked table (name · type · fit · how to add). On approval, skills → `.claude/skills/`, MCP → `.mcp.json`. Never commit secrets. Log additions and record durable choices in agent memory.

Already adopted here (don't re-propose): MCP servers context7, chrome-devtools, shadcn (`.mcp.json`); installed design skills `impeccable` v3.9.1 and `design-taste-frontend` in `.claude/skills/` (pointer stubs for both live alongside this skill).

(Claude Code users: `/discover-tooling`.)
