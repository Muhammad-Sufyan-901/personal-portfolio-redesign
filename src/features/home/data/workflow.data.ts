import type { WorkflowStep } from "@/types/portfolio";

/** Chapter 10 Workflow — the ONLY file the owner edits to re-voice this chapter.
 *
 *  PROVENANCE: none of this is transcribed. `product_requirements.md` has no
 *  process content at all — `grep -niE "process|workflow|discovery|maintenance"`
 *  returns zero hits across §2–§3.8 — so a Workflow chapter cannot be sourced
 *  the way Journey or Achievements were. It is an owner-ask chapter (2026-08-25,
 *  with `reference/workflow-reference.mp4`), on the same footing as 11 Articles.
 *
 *  What that means for the copy below: it is DRAFTED, not invented. Every step
 *  is anchored to something the PRD actually asserts, and nothing here claims a
 *  method, tool, ceremony, or metric the PRD does not support:
 *
 *    01 Discovery   ← §2 "works well solo or in a team"; §3.3.1 "owned UI and
 *                     API integration"
 *    02 Planning    ← §3.3 per-role stacks; §2 stats "7 Frameworks & Tech Stacks"
 *    03 Development ← §3.3.1–3 "Built full mobile apps", "Built features across…"
 *    04 Quality Testing ← §3.3.4 VERBATIM: "Quality Assurance — Debugged and
 *                     tested features on ADMTC and EDH platforms"
 *    05 Maintenance ← §3.3.1–2, two full-time roles spanning 2+ years on the
 *                     same products (Tampang.com, FindDW, Optimus, Litani)
 *
 *  Step ordering is the process order, NOT most-recent-first — this is the one
 *  data file in the chapter set that reads forward.
 *
 *  HARD CONSTRAINT on `title`: one or two words. It renders at `--text-chapter`,
 *  centred, and the fold has room for exactly one line. "Quality Testing" is the
 *  longest that fits at 390px; a third word wraps and pushes the description off
 *  a short viewport. */
export const workflowSteps: WorkflowStep[] = [
  {
    title: "Discovery",
    description: "Understanding the problem, the constraints, and what the thing actually has to do.",
    icon: "discover",
  },
  {
    title: "Planning",
    description: "Mapping the flow, the features, and the stack that fits the job.",
    icon: "shape",
  },
  {
    title: "Development",
    description: "Building it — UI and API, web or mobile — feature by feature.",
    icon: "build",
  },
  {
    title: "Quality Testing",
    description: "Debugging and testing every path before anyone else has to find it.",
    icon: "verify",
  },
  {
    title: "Maintenance",
    description: "Staying with it after launch — fixes, updates, and the things that come up later.",
    icon: "sustain",
  },
];

/** Chapter statement (house grammar — `ACHIEVEMENTS_STATEMENT` / `ARTICLES_STATEMENT`
 *  precedent): a re-voiced sentence, never a section name, because the eyebrow
 *  already says HOW I WORK. Focal words render `font-display-tail italic`.
 *
 *  Claims exactly one thing — that the five steps are the same every time — which
 *  is a statement about order, not about outcomes. No invented metrics. */
export const WORKFLOW_STATEMENT = {
  text: "Every build runs the same five steps — from the first conversation to the quiet work long after launch.",
  focalWords: ["conversation", "quiet"],
} as const;

/** Intro subtitle, under the statement on the opening beat. The reference has a
 *  two-line supporting line here; this is ours, in the PRD §2 voice ("precise,
 *  humble, growth-minded"). Hidden on short viewports, where the pixels go to
 *  the rail (`ArticlesSection` precedent). */
export const WORKFLOW_LEDE = "Web or mobile, solo or in a team — the order does not change, only what gets built.";
