---
paths:
  - "src/styles/globals.css"
  - "src/**/*.tsx"
---

# Tailwind v4 + shadcn styling — see design_system.md §9

- Tailwind v4 only (`tailwindcss ^4.2.1` + `@tailwindcss/vite`, CSS-first). Tokens defined via `@theme` in `src/styles/globals.css`. NO `tailwind.config.ts`.
- Use token utilities (e.g. `bg-ink`, `text-paper`, `text-accent`, `font-display`) — never raw hex in JSX.
- Merge classes with `cn()` (tailwind-merge + clsx); variants with `cva`.
- shadcn/ui only for Dialog, Tooltip, form controls — restyle via `className` with our tokens; do NOT use shadcn default palette.
- Radii stay small (`--radius: 4px`, `--radius-lg: 8px`); refinement comes from hairlines (`border-line`) + spacing, not rounding.

## Authoritative palette — "Void & Ember" (design_system.md v2 §3, evidence-sampled)

| Token | Value | Use |
| --- | --- | --- |
| `--color-ink` | `#0A0A0A` | page background (near-black, never `#000`) |
| `--color-surface` / `--color-raised` | `#141414` / `#1C1C1C` | cards / hover surfaces |
| `--color-paper` | `#E4E4E4` | primary text (neutral, not warm) |
| `--color-muted` / `--color-faint` | `#9A9A9A` / `#4D4D4D` | secondary / disabled text |
| `--color-line` | `#242424` | hairline dividers |
| `--color-accent` | `#E8380F` (ember) | active nav dot, link hover, scroll cue, focus ring — a scalpel, never a wash |
| `--color-accent-deep` / `--color-accent-tint` | `#B32C0B` / `rgba(232,56,15,0.12)` | pressed / focal-word wash |
| `--color-invert-bg` / `--color-invert-text` | `#E8E8E8` / `#0A0A0A` | the one optional light-invert section (§3.1b) |

- Fluid type-scale tokens (`--text-display` … `--text-meta`, design_system §4.3) and motion tokens (`--ease-out`, `--ease-inout`, `--dur-fast/base/slow`) also live in the same `@theme` block.
- **Current-vs-target note:** the shipped `src/styles/globals.css` (chapters 00–04) still carries the pre-migration **Warm Ink + Cobalt** values (`--accent: #3b5bff`); the ember re-theme is a pending step of the redesign. New styling work references tokens by *name* (`text-accent`), so it stays correct through the re-theme — one more reason raw hex is banned. Brass `#C8A46A` and Cobalt `#3B5BFF` remain documented alternates in design_system §3.2.

**Why this matters here:** the QA Definition of Done greps `#[0-9a-fA-F]{6}` across `src/components src/features` and fails on any raw hex; tokens-by-name is also what makes the cobalt→ember migration a one-file change instead of a codebase sweep.
