import type { Project } from "@/types/portfolio";

/** Entries 1–6: PRD §3.6 verbatim (expanded descriptions drafted from the PRD
 *  one-liners, owner-reviewed). Entries 7–12: fetched from
 *  github.com/Muhammad-Sufyan-901 — owner-approved additions, 2026-07-20 (not
 *  in the PRD; descriptions drafted from the repo descriptions). Thumbnails
 *  pending user-supplied assets (src/assets/images/). Featured 5 per PLAN v3
 *  decision #4. Used by chapter 04 (index: all) and chapter 07 (gallery:
 *  featured). */
export const projects: Project[] = [
  {
    slug: "khass-e-ticketing",
    title: "KHASS E-Ticketing",
    description:
      "A theater ticket marketplace built as a team project. Visitors browse shows and book their tickets online through a Next JS storefront backed by an Express JS API.",
    techStack: ["Next JS", "Tailwind", "Express JS"],
    livePreviewURL: "https://khass.my.id",
    featured: true,
  },
  {
    slug: "phantom",
    title: "Phantom",
    description:
      "A product site for the Phantom smartphone brand, built as a web-design competition entry. Hand-coded in HTML, CSS, and JavaScript around a polished product showcase.",
    techStack: ["HTML", "CSS", "JS"],
    livePreviewURL: "https://lomba-web-design.vercel.app",
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/lomba-web-design",
    featured: true,
  },
  {
    slug: "petabyte",
    title: "Petabyte",
    description:
      "A landing page for Petabyte, a software house focused on education. Built with HTML, CSS, and JavaScript on the Bootstrap grid system.",
    techStack: ["HTML", "CSS", "Bootstrap", "JS"],
    livePreviewURL: "https://petabyte-landing-page.vercel.app",
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/petabyte-landing-page",
    featured: true,
  },
  {
    slug: "hoobank",
    title: "HooBank",
    description:
      "A landing page for a modern banking product with a dark, gradient-driven interface. Built with React JS and Tailwind on the Vite toolchain.",
    techStack: ["React JS", "Tailwind", "Vite"],
    featured: true,
  },
  {
    slug: "kna",
    title: "Keanu Abimanyu Construction",
    description:
      "A company profile for a construction business covering its services, project portfolio, and client testimonials. Includes a consultation flow so prospects can get in touch directly.",
    techStack: ["HTML", "CSS", "Tailwind", "JS"],
    featured: true,
  },
  {
    slug: "personal-portfolio",
    title: "My Personal Portfolio",
    description:
      "The previous iteration of this portfolio — a seven-section personal site. Built with Next JS and Tailwind, animated with Framer Motion.",
    techStack: ["Next JS", "Tailwind", "Framer Motion"],
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/personal-portfolio",
    featured: false,
  },
  {
    slug: "opto",
    title: "Opto",
    description:
      "An accessibility-first super app designed for blind, low-vision, and ocular-prosthesis users in Indonesia. Built with Flutter as a single hub for assistive day-to-day tools.",
    techStack: ["Flutter", "Dart"],
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/opto-mobile",
    featured: false,
  },
  {
    slug: "point-of-sales-saas",
    title: "Point of Sales SaaS",
    description:
      "A multi-tenant SaaS platform where store owners register and instantly get their own point-of-sale system. Built on Laravel with an Inertia-driven React front end styled in Tailwind.",
    techStack: ["Laravel", "React JS", "Inertia", "Tailwind"],
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/point-of-sales-saas",
    featured: false,
  },
  {
    slug: "pundi",
    title: "Pundi",
    description:
      "A cross-platform mobile finance tracker for managing incomes, expenses, and transactions. Built with React Native and Expo in TypeScript, backed by Supabase.",
    techStack: ["React Native", "Expo", "TypeScript", "Supabase"],
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/pundi",
    featured: false,
  },
  {
    slug: "personal-finance",
    title: "Personal Finance",
    description:
      "A responsive web app for recording, managing, and analyzing personal cash flow. Income and spending are tracked in one place, built on Laravel with Blade templating.",
    techStack: ["Laravel", "Blade", "PHP"],
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/personal-finance",
    featured: false,
  },
  {
    slug: "create-my-react-boilerplate",
    title: "Create My React Boilerplate",
    description:
      "A CLI that scaffolds a production-ready React app in seconds — pick a language, router, and UI library and it ships a real starter pack out of the box. Written in TypeScript for Node JS.",
    techStack: ["TypeScript", "Node JS"],
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/create-my-react-boilerplate",
    featured: false,
  },
  {
    slug: "balinese-cultural-portfolio",
    title: "Balinese Cultural Portfolio",
    description:
      "A personal portfolio that fuses a modern layout with Balinese visual elements and philosophy as its core identity. Built with React JS, Vite, and Tailwind, with GSAP-driven motion.",
    techStack: ["React JS", "Vite", "Tailwind", "GSAP"],
    livePreviewURL: "https://balinese-cultural-personal-portfoli.vercel.app",
    repositoryURL: "https://github.com/Muhammad-Sufyan-901/balinese-cultural-personal-portfolio",
    featured: false,
  },
];
