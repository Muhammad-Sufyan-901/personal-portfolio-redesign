import type { Profile } from "@/types/portfolio";

/** PRD §2 — facts verbatim; microcopy re-voiced narratively where allowed
 *  (bio → tagline/manifesto/aboutStatement), facts unchanged. */
export const profile: Profile = {
  name: "Muhammad Sufyan",
  role: "Software Engineer · Web & Mobile",
  tagline: "Building digital applications that help many people.",
  taglineEmphasis: "help many people",
  location: "Indonesia",
  roles: ["Frontend Developer", "Backend Developer", "Mobile Developer", "Software Tester"],
  bio: "Hello everyone! I am Muhammad Sufyan, a frontend, mobile and website developer. I have intermediate experience and I hope to always keep learning something new, to build digital applications that can help many people in the future. I can work independently or in a team.",
  aboutStatement: "A software engineer from Indonesia, crafting web and mobile applications with precision and care.",
  aboutStatementEmphasis: ["software engineer", "precision and care"],
  manifesto: {
    lines: ["Basically, I write code."],
    focalWord: "code",
  },
  stats: [
    { value: 3, label: "Years of Experience" },
    { value: 7, label: "Frameworks & Tech Stacks Used" },
    { value: 10, label: "Successful Projects" },
  ],
  favoredStacks: {
    web: ["React", "TypeScript", "Tailwind", "shadcn/ui", "Laravel", "Livewire"],
    mobile: ["Flutter", "React Native"],
  },
  cvUrl: "/assets/pdf/Muhammad Sufyan CV.pdf",
};
