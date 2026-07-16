---
name: build-section
description: Build (or revise) one scroll-telling chapter at a time — verify content, static accessible layout, motion, polish, QA, commit, then stop for approval. Use after PLAN.md is approved, one chapter per invocation.
---

# build-section (stub — canonical in `.claude/skills/build-section/`)

PROCESS skill: the canonical, invokable implementation is `/build-section <chapter>`
(`.claude/skills/build-section/SKILL.md`) — non-Claude agents read that file directly.
Hard rules preserved there: one chapter per invocation on the PLAN v3.1 10-chapter map,
built chapters get revision passes, and a **stop-for-approval gate after every section**
(`workflows/section.md`).
