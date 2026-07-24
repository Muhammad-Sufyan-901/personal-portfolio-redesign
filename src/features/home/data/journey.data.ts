import type { JourneyItem } from "@/types/portfolio";

/** PRD §3.3 (work) + §3.4 (education) + §3.5 (awards) merged into one
 *  timeline, most recent first (chapter 05 Journey). Facts verbatim.
 *
 *  `summary` = the card's OVERVIEW line, `highlights` = the list below it.
 *  Both are re-voicings of PRD facts, never new ones — the overviews sit a
 *  level ABOVE the bullets on purpose (owner ask 2026-07-25: the two were
 *  saying the same thing, since `highlights` was itself authored as a
 *  re-voicing of the old verbatim `summary`). Overviews carry role framing
 *  derivable from PRD dates/employer/type; the specifics stay in the
 *  bullets. Same precedent as the education summaries below (2026-07-22). */
export const journey: JourneyItem[] = [
  {
    kind: "work",
    title: "Mobile Developer",
    org: "Global Digital Verse",
    period: "Feb 2024 – Aug 2025",
    employmentType: "Full Time",
    // Overview: duration is Feb 2024 – Aug 2025; "end-to-end" re-voices the
    // PRD's "built full mobile apps" + "owned UI and API integration".
    summary: "Eighteen months building Global Digital Verse's mobile products end-to-end.",
    // highlights = the summary + stack facts re-voiced as bullets (owner
    // overdrive 2026-07-22, expanded same day: max-safe expansion — fuller
    // sentences, zero new information, here and below).
    highlights: [
      "Built complete mobile applications end-to-end — Tampang.com, Digital Salesman, and more",
      "Owned the UI layer across every app, implementing screens and flows in Flutter and React Native",
      "Owned API integration, connecting the apps to their services — including Firebase",
    ],
    stack: ["Flutter", "Dart", "Firebase", "React Native", "TypeScript"],
  },
  {
    kind: "work",
    title: "Full Stack Web Developer",
    org: "Global Digital Verse",
    period: "May 2023 – Aug 2025",
    employmentType: "Full Time",
    // Overview: May 2023 – Aug 2025; the "split" is the PRD's own two
    // categories — product platforms vs. company-profile sites.
    summary:
      "Just over two years on Global Digital Verse's web side, split between product platforms and company-profile sites.",
    highlights: [
      "Built features across three product platforms — FindDW, Optimus, and Litani",
      "Built full company-profile websites from the ground up on Laravel and PHP",
      "Worked across the stack — Bootstrap fronts over MySQL data behind Laravel",
    ],
    stack: ["Laravel", "Bootstrap", "MySQL", "PHP"],
  },
  {
    kind: "award",
    title: "5th Winner, Web Design Competition",
    org: "UNBI University",
    period: "Sep 2023",
  },
  {
    kind: "education",
    title: "Information Systems",
    org: "Institute of Technology and Business STIKOM Bali",
    period: "2023 – Present",
    // Education summaries: date-derived re-voice (owner 2026-07-22) — the
    // "story" is the PRD period overlaps, nothing invented: this degree runs
    // alongside the GDV full-time years (§3.3), and the SMK enrollment
    // contains the 2022 ZettaByte internships + bootcamps (§3.3/§3.5).
    summary:
      "Studying Information Systems while working full-time — the degree has run alongside the engineering years at Global Digital Verse.",
    // PLACEHOLDER — owner to replace (drafted on request 2026-07-25). PRD §3.4
    // carries institution/major/period ONLY, so these study areas are NOT
    // transcribed: they are a generic Information Systems curriculum, written
    // to show the shape. Swap the strings 1:1 with the real subjects; add them
    // to PRD §3.4 first so this file goes back to transcription-only.
    highlights: [
      "Database systems — data modelling, relational design, and query work",
      "Systems analysis and design, turning business processes into software requirements",
      "Web application development and information systems management",
    ],
  },
  {
    kind: "education",
    title: "Software Engineer",
    org: "TI Bali Global Vocational High School",
    period: "2020 – 2023",
    summary:
      "The Software Engineering track where the path started — the ZettaByte internships and bootcamps happened while still enrolled here.",
    // PLACEHOLDER — owner to replace (see the note on the entry above). Generic
    // vocational software-engineering track subjects, not PRD-sourced.
    highlights: [
      "Programming fundamentals and object-oriented design",
      "Database design and web application development",
      "Mobile application development and software project basics",
    ],
  },
  {
    kind: "award",
    title: "Completed ZettaCamp Frontend Bootcamp",
    org: "ZettaByte Pte Ltd",
    period: "Apr 2022",
  },
  {
    kind: "work",
    title: "Frontend Developer",
    org: "ZettaByte Pte Ltd",
    period: "Jan 2022 – Apr 2022",
    employmentType: "Internship",
    // Overview: Jan – Apr 2022 is the earliest dated entry in the PRD, and it
    // pairs with the QA internship below — same employer, same four months.
    summary: "The build half of a four-month ZettaByte internship — the earliest professional work on this timeline.",
    highlights: [
      "Built user-facing features on the ADMTC and EDH platforms — search filters and form validation among them",
      "Implemented them in Angular and TypeScript against GraphQL APIs",
    ],
    stack: ["Angular", "TypeScript", "GraphQL"],
  },
  {
    kind: "work",
    title: "Quality Assurance",
    org: "ZettaByte Pte Ltd",
    period: "Jan 2022 – Apr 2022",
    employmentType: "Internship",
    // Overview: the companion to the Frontend internship above — PRD gives
    // both the same employer, dates, and the same two platforms.
    summary:
      "The other half of that same internship — the same two platforms, approached from testing rather than building.",
    highlights: [
      "Tested and debugged features across the ADMTC and EDH platforms",
      "Tracked issues in Jira and kept the test documentation in Docs",
    ],
    stack: ["Jira", "Docs"],
  },
  {
    kind: "award",
    title: "Completed ZettaCamp Angular Bootcamp",
    org: "ZettaByte Pte Ltd",
    period: "Jan 2022",
  },
];
