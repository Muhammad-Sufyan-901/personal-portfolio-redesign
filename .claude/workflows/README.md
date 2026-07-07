# .claude/workflows/

This folder is the home for **native Claude Code workflows** — multi-step scripts (`*.js`) that Claude Code generates when you run the `/workflows` command and that then appear as their own slash commands. They are meant to be generated/edited via `/workflows`, not hand-authored, so this folder starts empty except for this note.

## Workflows to generate for this project

Run `/workflows` and describe these to have Claude Code scaffold them (each becomes `/name`):

1. **feature-done** — after a feature/section is built: run `tsc --noEmit` + `lint`, then `/log-change`, then `/update-memory`, then a Conventional Commit. Encodes the "log + memory always updated on change" rule as one command.
2. **section-cycle** — `/build-section <chapter>` → `/qa-audit <chapter>` → `feature-done` → **stop and present the section for user approval**. One section per cycle; the next section does not start until the user signs off on this one.

## The project's execution rhythm (matches `.agents/workflows/`)

Planning (`/plan-redesign`) is **whole-site** — one `PLAN.md` covering every chapter, gated on explicit approval. Execution is **one section at a time**, and each section ends at its own stop-for-approval gate: build → per-section `/qa-audit` → log + memory + commit → pause for the user's go-ahead before the next chapter. This is how chapters 00–04 (preloader `fe849ff` → journey `b245c1e`) were actually shipped — one `feat(<chapter>):` commit per section, each with its own `logs/feature-changes/` entry and QA round. Don't batch multiple chapters into one unreviewed run.

## Where the human-readable procedures live

The prose process docs (roles + step-by-step) are in `.agents/workflows/` (`planning.md`, `design-system.md`, `section.md`, `qa.md`). The invocable units are the skills in `.claude/skills/` (`plan-redesign`, `build-section`, `qa-audit`, `log-change`, `update-memory`, `discover-tooling`, `animated-ui-references`, plus the installed design skills `impeccable` and `design-taste-frontend`) and commands in `.claude/commands/`. This `workflows/` folder is only for the native `/workflows` JS scripts above.
