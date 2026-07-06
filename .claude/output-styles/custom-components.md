---
name: custom-components
description: Portfolio house style — generated JSX must use the custom primitives in src/components/common (Box, Container, Text, Heading, Link, Image) instead of raw HTML tags. Keeps normal software-engineering behavior.
keep-coding-instructions: true
---

# House Component Style

When writing or editing React/TSX in this project, **do not emit raw HTML elements in feature/page/section code**. Use the polymorphic primitives from `@/components/common`. This repo already declares `react/forbid-elements` banning bare `<div>` in favor of `<Box>`; treat that as the law for every element with a wrapper, not just `div`.

## Tag → component mapping (mandatory)

| Raw element | Use instead | Notes |
| --- | --- | --- |
| `div`, `section`, `article`, `header`, `footer`, `main`, `aside`, `nav`, `ul`, `li` | `<Box as="section">` … | `Box` is polymorphic; pass the semantic tag via `as`. |
| centered / max-width wrapper `div` | `<Container as="section" maxWidth="7xl">` | Adds `mx-auto px-4 sm:px-6 lg:px-8`; `maxWidth` sm…7xl/full. |
| `p`, `span` | `<Text as="p" variant="default">` | `as`: p \| span \| div; `variant`: default \| lead \| large \| small \| muted. |
| `h1`–`h6` | `<Heading level={2} variant="section">` | `level` 1–6 (or `as="h2"`); `variant`: default \| display \| title \| subtitle \| section. |
| `a`, router `Link` | `<Link href="/x">` | Handles internal (TanStack) / hash (smooth-scroll) / external (`rel` auto). |
| `img` | `<Image src alt width height objectFit priority />` | Built-in lazy/skeleton/fallback. |
| theme switch | `<ThemeToggle />` | — |

Always import from `@/components/common`, e.g. `import { Box, Heading, Text } from "@/components/common";`.

## Example (follow this shape)

```tsx
import { Box, Heading } from "@/components/common";
import { cn } from "@/lib/utils";

<Box
  as="section"
  className={cn(isEven ? "bg-slate-100 -mx-4 px-4 sm:-mx-6 sm:px-6 py-5" : "")}
>
  <Heading
    level={3}
    className={cn(["font-display text-base font-semibold text-slate-800", "mb-4"])}
  >
    {label}
  </Heading>
</Box>
```

## Exceptions (raw element allowed)

- Inside the primitives themselves (`src/components/common/*`) and shadcn output (`src/components/ui/*`).
- Interactive controls with no common wrapper → use shadcn/ui (`Button`, `Dialog`, `Input`, …), not raw `<button>`/`<input>`.
- Genuinely wrapper-less leaves (`svg`, `<input>` when not using shadcn) only as a last resort, and never a bare `<div>`/`<p>`/`<h*>`.

Everything else about how you engineer — scoping changes, verifying with `tsc`/lint, writing minimal diffs — stays exactly as in your default behavior.
