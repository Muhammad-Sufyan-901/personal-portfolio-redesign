# Workflow: /qa-audit

Owner: @qa. Run per chapter — **before that chapter's approval gate** (`section.md` step 5) — and once globally at the end.

1. `tsc --noEmit` + `eslint .` clean.
2. `grep -r "from '@/features/" src/features` → no cross-feature imports.
3. `grep -rE "#[0-9a-fA-F]{6}" src/components src/features` → no raw hex (tokens only).
4. `grep -rnE "<(div|p|span|h[1-6]|img|a)[ >]" src/features` → no bare HTML tags (custom primitives only).
5. Reduced-motion: toggle OS setting → reveals become opacity-only, Lenis off, cursor hidden.
6. Resize + (multi-page) route change → `ScrollTrigger.refresh()` fires, no layout drift.
7. Keyboard nav + visible focus + alt text + landmarks + overlay `inert` containment (`SiteMenu`, `Preloader`).
8. Lighthouse ≥ 90 (Perf/A11y/Best/SEO); media optimized; meta/OG/theme-color (`#0A0A0A`, `skills/seo-meta`) present.
9. A `logs/feature-changes/` entry exists for the audited work.
10. Write results to `.artifacts/qa-log.md`.

Runtime note (Claude Code): the chrome-devtools MCP is not exposed inside qa subagent threads — browser checks use the puppeteer-core fallback documented in `.claude/agent-memory/qa-auditor/runtime-smoke-testing.md`. Recurring past findings (off-token layout classes, overlay focus, hardcoded prose) are logged in `.claude/agent-memory/qa-auditor/MEMORY.md` — re-check them every audit.
