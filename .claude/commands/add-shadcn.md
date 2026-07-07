---
description: Add a shadcn/ui component and restyle it with our design tokens.
argument-hint: <component> (e.g. dialog, tooltip, input)
---

Add the shadcn component "$ARGUMENTS" (via `npx shadcn add` — config in `components.json`: style "new-york", base color "neutral", lands in `src/components/ui/`), then restyle per `.claude/rules/tailwind-styling.md`:
- Override via `className` with our `@theme` tokens (`bg-ink`, `bg-surface`, `text-paper`, `text-muted`, `border-line`, `text-accent`), never the shadcn default palette. Example pattern (design_system.md §9.2): `<Button className="rounded-full bg-accent text-ink font-sans font-semibold hover:bg-accent-deep">`.
- Keep radii small (`rounded`/`rounded-full`, `--radius: 4px`), hairline borders, accent focus ring (ember `#E8380F` per design_system v2 §3.3 — via the `:focus-visible` global, not per-component hex).
- Only add components actually used (Dialog for the chapter-05 work lightbox, Tooltip, form controls for the chapter-06 contact form). Currently installed: `button`, `tooltip` only. Report the file(s) created/edited.
