---
paths:
  - "src/styles/globals.css"
  - "src/**/*.tsx"
---

# Tailwind v4 + shadcn styling — see design_system.md §9

- Tailwind v4 only. Tokens defined via `@theme` in `src/styles/globals.css`. NO `tailwind.config.ts`.
- Use token utilities (e.g. `bg-ink`, `text-paper`, `text-accent`, `font-display`) — never raw hex in JSX.
- Merge classes with `cn()` (tailwind-merge + clsx); variants with `cva`.
- shadcn/ui only for Dialog, Tooltip, form controls — restyle via `className` with our tokens; do NOT use shadcn default palette.
- Radii stay small (`--radius: 4px`); refinement comes from hairlines + spacing, not rounding.
