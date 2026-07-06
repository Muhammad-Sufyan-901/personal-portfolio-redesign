# Workflow: /qa-audit

Owner: @qa. Run per chapter and once globally at the end.

1. `tsc --noEmit` + `eslint .` clean.
2. `grep -r "from '@/features/" src/features` → no cross-feature imports.
3. `grep -rE "#[0-9a-fA-F]{6}" src/components src/features` → no raw hex (tokens only).
4. Reduced-motion: toggle OS setting → reveals become opacity-only, Lenis off, cursor hidden.
5. Resize + (multi-page) route change → `ScrollTrigger.refresh()` fires, no layout drift.
6. Keyboard nav + visible focus + alt text + landmarks.
7. Lighthouse ≥ 90 (Perf/A11y/Best/SEO); media optimized; meta/OG/theme-color present.
8. Write results to `.artifacts/qa-log.md`.
