---
name: tailwind-v4-shadcn
description: Tailwind v4 (@theme tokens, no config file) + shadcn/ui overrides for this project. Activate when styling components or setting up globals.css.
---

# Tailwind v4 + shadcn

Authoritative: `context/design_system.md §9`.

## Tokens (no tailwind.config.ts)
Define all tokens via `@theme` in `src/styles/globals.css`: colors (`--color-ink #0B0B0F`, `--color-paper #ECE8E1`, `--color-accent #C8A46A`, …), fonts (`--font-display/sans/mono`), radius (`--radius: 4px`), motion eases/durations. Reference as utilities (`bg-ink`, `text-paper`, `text-accent`, `font-display`).

## Rules
- NO raw hex/magic px in JSX — tokens only.
- `cn()` (tailwind-merge + clsx) for conditional classes; `cva` for variants (e.g. `WorkCard` featured vs default).
- shadcn/ui only for Dialog, Tooltip, form controls — restyle via `className` with our tokens; never use shadcn default palette.
- Keep radii small; refinement = hairlines (`--color-line`) + spacing, not rounding.
