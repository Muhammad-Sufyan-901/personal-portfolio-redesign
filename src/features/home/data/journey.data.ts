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
    stack: ["Flutter", "Dart", "Firebase", "React Native", "TypeScript"],
  },
  {
    kind: "work",
    title: "Full Stack Web Developer",
    org: "Global Digital Verse",
    period: "May 2023 – Aug 2025",
    employmentType: "Full Time",
    summary: "Built features across FindDW, Optimus, Litani, and full company-profile sites.",
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
  },
  {
    kind: "education",
    title: "Software Engineer",
    org: "TI Bali Global Vocational High School",
    period: "2020 – 2023",
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
    stack: ["Angular", "TypeScript", "GraphQL"],
  },
  {
    kind: "work",
    title: "Quality Assurance",
    org: "ZettaByte Pte Ltd",
    period: "Jan 2022 – Apr 2022",
    employmentType: "Internship",
    summary: "Debugged and tested features on ADMTC and EDH platforms.",
    stack: ["Jira", "Docs"],
  },
  {
    kind: "award",
    title: "Completed ZettaCamp Angular Bootcamp",
    org: "ZettaByte Pte Ltd",
    period: "Jan 2022",
  },
];
