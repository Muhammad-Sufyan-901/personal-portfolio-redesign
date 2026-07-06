---
description: Add a shadcn/ui component and restyle it with our design tokens.
argument-hint: <component> (e.g. dialog, tooltip, input)
---

Add the shadcn component "$ARGUMENTS", then restyle per `.claude/rules/tailwind-styling.md`:
- Override via `className` with our `@theme` tokens (`bg-ink`, `text-paper`, `border-line`, `text-accent`), never the shadcn default palette.
- Keep radii small (`rounded`/`rounded-full`), hairline borders, brass focus.
- Only add components actually used (Dialog for work lightbox, Tooltip, form controls). Report the file(s) created/edited.
