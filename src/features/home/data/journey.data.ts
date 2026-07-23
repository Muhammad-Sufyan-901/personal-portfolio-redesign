import type { JourneyItem } from "@/types/portfolio";

/** PRD §3.3 (work) + §3.4 (education) + §3.5 (awards) merged into one
 *  timeline, most recent first (chapter 05 Journey). Facts verbatim. */
export const journey: JourneyItem[] = [
  {
    kind: "work",
    title: "Mobile Developer",
    org: "Global Digital Verse",
    period: "Feb 2024 – Aug 2025",
    employmentType: "Full Time",
    summary: "Built full mobile apps (Tampang.com, Digital Salesman, etc.); owned UI and API integration.",
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
    summary: "Built features across FindDW, Optimus, Litani, and full company-profile sites.",
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
  },
  {
    kind: "education",
    title: "Software Engineer",
    org: "TI Bali Global Vocational High School",
    period: "2020 – 2023",
    summary:
      "The Software Engineering track where the path started — the ZettaByte internships and bootcamps happened while still enrolled here.",
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
    summary: "Built features (search filters, form validation) on ADMTC and EDH platforms.",
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
    summary: "Debugged and tested features on ADMTC and EDH platforms.",
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
