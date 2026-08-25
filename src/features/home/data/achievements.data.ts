import type { Achievement } from "@/types/portfolio";

/** PRD §3.5 (awards) as its own chapter (09 Achievements), most recent first
 *  — the same ordering as `journey.data.ts`, so the row index reads 01→03 top
 *  to bottom.
 *
 *  Three fields, no more. §3.5 carries title/issuer/date ONLY, and the flat
 *  table this feeds is built around exactly that — which is why the awards
 *  left Journey (2026-08-25): the pill there had a hover panel whose entire
 *  body was PLACEHOLDER text with no PRD source to replace it. Facts verbatim;
 *  nothing here is re-voiced or invented. */
export const achievements: Achievement[] = [
  {
    title: "5th Winner, Web Design Competition",
    org: "UNBI University",
    period: "Sep 2023",
  },
  {
    title: "Completed ZettaCamp Frontend Bootcamp",
    org: "ZettaByte Pte Ltd",
    period: "Apr 2022",
  },
  {
    title: "Completed ZettaCamp Angular Bootcamp",
    org: "ZettaByte Pte Ltd",
    period: "Jan 2022",
  },
];

/** Chapter statement (owner ask 2026-08-25) — the house grammar every other
 *  chapter title uses (`profile.journeyStatement`, `ARTICLES_STATEMENT`,
 *  Gallery's module-scope STATEMENT): a re-voiced sentence, not a section name.
 *  The eyebrow already says RECOGNITION, so the h2 does the telling.
 *
 *  Re-voiced from §3.5 FACTS ONLY — two completed ZettaCamp bootcamps and one
 *  competition placing. The closing clause is framing in the same register as
 *  Gallery's "taught me something worth keeping", anchored on the PRD §2 bio's
 *  own "I hope to always keep learning something new". No new facts. */
export const ACHIEVEMENTS_STATEMENT = {
  text: "Two bootcamps finished, one competition placed — small proofs the learning was landing.",
  focalWords: ["finished", "landing"],
} as const;
