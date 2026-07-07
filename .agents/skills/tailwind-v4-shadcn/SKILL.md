---
name: tailwind-v4-shadcn
description: Tailwind v4 (@theme tokens, no config file) + shadcn/ui overrides for this project. Activate when styling components or setting up globals.css.
---

# Tailwind v4 + shadcn

Authoritative: `context/design_system.md §9` (v2 — "Void & Ember" palette, evidence-sampled per §3.0).

## Tokens (no tailwind.config.ts)

Define all tokens via `@theme` in `src/styles/globals.css` (Tailwind `^4.2.1` + `@tailwindcss/vite`): colors (`--color-ink #0A0A0A`, `--color-surface #141414`, `--color-raised #1C1C1C`, `--color-paper #E4E4E4`, `--color-muted #9A9A9A`, `--color-faint #4D4D4D`, `--color-line #242424`, `--color-accent #E8380F` ember + `--color-accent-deep #B32C0B` + `--color-accent-tint`, invert pair `#E8E8E8`/`#0A0A0A`), fonts (`--font-display` Fraunces / `--font-sans` General Sans / `--font-mono` JetBrains Mono), radius (`--radius: 4px`, `--radius-lg: 8px`), fluid type scale (`--text-display` … `--text-meta`, §4.3), motion eases/durations (§7.1). Reference as utilities (`bg-ink`, `text-paper`, `text-accent`, `font-display`).

> Superseded values, kept for the record: v1 of the design system specified Warm Ink + Brass (`#0B0B0F` / `#ECE8E1` / `#C8A46A`); the shipped `globals.css` (chapters 00–04) currently carries the interim Warm Ink + Cobalt (`#3B5BFF`) tokens. Ember is authoritative (design_system v2 §3.2); brass/cobalt remain documented alternates there. Because components use token *names*, the re-theme is a globals.css-only change.

## Rules

- NO raw hex/magic px in JSX — tokens only.
- `cn()` (tailwind-merge + clsx) for conditional classes; `cva` for variants (e.g. `WorkCard` featured vs default).
- shadcn/ui only for Dialog, Tooltip, form controls — restyle via `className` with our tokens (`§9.2` pattern: `className="rounded-full bg-accent text-ink hover:bg-accent-deep"`); never use shadcn default palette. Currently installed: `button`, `tooltip`.
- Keep radii small; refinement = hairlines (`--color-line`) + spacing, not rounding.

Claude Code enforcement mirror: `.claude/rules/tailwind-styling.md`.
