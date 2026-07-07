import type { Project } from "@/types/portfolio";

/** PRD §3.6 — all 6 projects verbatim; thumbnails pending user-supplied
 *  assets (src/assets/images/). Featured 5 per PLAN v3 decision #4. Used by
 *  chapter 04 (index: all) and chapter 07 (gallery: featured). */
export const projects: Project[] = [
  {
    slug: "khass-e-ticketing",
    title: "KHASS E-Ticketing",
    description: "Theater ticket marketplace (team project).",
    techStack: ["Next JS", "Tailwind", "Express JS"],
    livePreviewURL: "https://khass.my.id",
    featured: true,
  },
  {
    slug: "phantom-landing-page",
    title: "Phantom Landing Page",
    description: "Phone-brand product site.",
    techStack: ["HTML", "CSS", "JS"],
    livePreviewURL: "https://lomba-web-design.vercel.app",
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/lomba-web-design",
    featured: true,
  },
  {
    slug: "petabyte-landing-page",
    title: "Petabyte Landing Page",
    description: "Software house (education) landing.",
    techStack: ["HTML", "CSS", "Bootstrap", "JS"],
    livePreviewURL: "https://petabyte-landing-page.vercel.app",
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/petabyte-landing-page",
    featured: true,
  },
  {
    slug: "hoobank-landing-page",
    title: "HooBank Landing Page",
    description: "Modern banking landing.",
    techStack: ["React JS", "Tailwind", "Vite"],
    featured: true,
  },
  {
    slug: "kna-landing-page",
    title: "KNA Landing Page",
    description: "Construction company landing (services, portfolio, testimonial, consultation).",
    techStack: ["HTML", "CSS", "Tailwind", "JS"],
    featured: true,
  },
  {
    slug: "personal-portfolio",
    title: "My Personal Portfolio",
    description: "The previous portfolio (7 sections).",
    techStack: ["Next JS", "Tailwind", "Framer Motion"],
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/personal-portfolio",
    featured: false,
  },
];
