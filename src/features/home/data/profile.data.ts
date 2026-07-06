import type { Profile } from "@/types/portfolio";

/** PRD §2 — persona. Bio is the source copy, verbatim. */
export const profile: Profile = {
  name: "Muhammad Sufyan",
  role: "Software Engineer · Web & Mobile",
  location: "Indonesia",
  tagline: "Building digital applications that help people — across web and mobile.",
  bio: "Hello everyone! I am Muhammad Sufyan, a frontend, mobile and website developer. I have intermediate experience and I hope to always keep learning something new, to build digital applications that can help many people in the future. I can work independently or in a team.",
  stats: [
    { value: "3", label: "Years of Experience" },
    { value: "7", label: "Frameworks & Tech Stacks Used" },
    { value: "10", label: "Successful Projects" },
  ],
  cvUrl: "/assets/pdf/Muhammad Sufyan CV.pdf",
  manifesto: {
    lines: [
      "I'm a developer across frontend, mobile and the web.",
      "Always learning something new, building digital applications that help many people.",
      "I work independently or in a team.",
    ],
    focalWord: "people",
  },
};
