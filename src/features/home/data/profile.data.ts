import type { Profile } from "@/types/portfolio";

/** PRD §2 — facts verbatim; microcopy re-voiced narratively where allowed
 *  (bio → tagline/manifesto/aboutStatement), facts unchanged. */
export const profile: Profile = {
  name: "Muhammad Sufyan",
  // Owner-approved hero display abbreviation (2026-07-16) — not PRD content;
  // the hero h1's aria-label still reads the full `name`.
  heroName: { lead: "Muh.", tail: "Sufyan." },
  role: "Software Engineer · Web & Mobile",
  tagline: "Building digital applications that help many people.",
  taglineEmphasis: "help many people",
  location: "Indonesia",
  roles: ["Frontend Developer", "Backend Developer", "Mobile Developer", "Software Tester"],
  bio: "Hello everyone! I am Muhammad Sufyan, a frontend, mobile and website developer. I have intermediate experience and I hope to always keep learning something new, to build digital applications that can help many people in the future. I can work independently or in a team.",
  aboutStatement: "A software engineer from Indonesia, building web and mobile applications with precision and care.",
  aboutStatementEmphasis: ["software engineer", "precision and care"],
  // 06 Skills — owner-requested three-clause re-voice (2026-07-21): role +
  // location verbatim, "web and mobile" from role, "help many people" from
  // the tagline/bio. No invented facts.
  skillsStatement:
    "Software engineer from Indonesia, specialized in web and mobile development, passionate about building digital applications that help many people.",
  manifesto: {
    lines: ["A Software Engineer who solves your problems"],
    focalWord: "Problems",
  },
  stats: [
    { value: 3, label: "Years of Experience" },
    { value: 7, label: "Frameworks & \nTech Stacks Used" },
    { value: 10, label: "Successful Projects" },
  ],
  favoredStacks: {
    web: ["React", "TypeScript", "Tailwind", "shadcn/ui", "Laravel", "Livewire"],
    mobile: ["Flutter", "React Native"],
  },
  cvUrl: "/assets/pdf/Muhammad Sufyan CV.pdf",
};
