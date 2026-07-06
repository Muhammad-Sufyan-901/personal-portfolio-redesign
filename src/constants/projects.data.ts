import type { Project } from "@/types/portfolio";

/**
 * PRD §3.6 — all six projects. Lives in `src/constants` (not the home
 * feature) because it is shared across features. Featured set per planning
 * approval: KNA, KHASS, Phantom, Petabyte, HooBank (personal portfolio not
 * featured). Thumbnails omitted until assets are re-exported.
 */
export const projects: Project[] = [
  {
    slug: "kna-landing-page",
    title: "KNA Landing Page",
    tagline: "construction company landing",
    description:
      "A landing page for a construction company covering services, portfolio, testimonial, and consultation.",
    techStack: [{ tech: "HTML" }, { tech: "CSS" }, { tech: "Tailwind" }, { tech: "JS" }],
    featured: true,
  },
  {
    slug: "khass-e-ticketing",
    title: "KHASS E-Ticketing",
    tagline: "theater ticket marketplace",
    description: "A theater ticket marketplace, built as a team project.",
    livePreviewURL: "https://khass.my.id",
    techStack: [{ tech: "Next JS" }, { tech: "Tailwind" }, { tech: "Express JS" }],
    featured: true,
  },
  {
    slug: "personal-portfolio",
    title: "My Personal Portfolio",
    tagline: "the previous portfolio",
    description: "The previous personal portfolio, built as 7 sections.",
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/personal-portfolio",
    techStack: [{ tech: "Next JS" }, { tech: "Tailwind" }, { tech: "Framer Motion" }],
    featured: false,
  },
  {
    slug: "phantom-landing-page",
    title: "Phantom Landing Page",
    tagline: "phone-brand product site",
    description: "A product site for a phone brand.",
    livePreviewURL: "https://lomba-web-design.vercel.app",
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/lomba-web-design",
    techStack: [{ tech: "HTML" }, { tech: "CSS" }, { tech: "JS" }],
    featured: true,
  },
  {
    slug: "petabyte-landing-page",
    title: "Petabyte Landing Page",
    tagline: "software house (education) landing",
    description: "A landing page for an education-focused software house.",
    livePreviewURL: "https://petabyte-landing-page.vercel.app",
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/petabyte-landing-page",
    techStack: [{ tech: "HTML" }, { tech: "CSS" }, { tech: "Bootstrap" }, { tech: "JS" }],
    featured: true,
  },
  {
    slug: "hoobank-landing-page",
    title: "HooBank Landing Page",
    tagline: "modern banking landing",
    description: "A modern banking landing page.",
    techStack: [{ tech: "React JS" }, { tech: "Tailwind" }, { tech: "Vite" }],
    featured: true,
  },
];
