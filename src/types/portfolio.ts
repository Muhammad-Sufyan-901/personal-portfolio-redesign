/**
 * Global content contract for the portfolio.
 * All PRD-transcribed constants are typed against these models so bad edits
 * fail compilation. Content source: `.agents/context/product_requirements.md`.
 */

export interface TechStack {
  tech: string;
  /** No logo assets exported yet — optional until they land in `src/assets`. */
  logo?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail?: string;
  livePreviewURL?: string;
  repositoryURL?: string;
  techStack: TechStack[];
  year?: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  level: "Basic" | "Intermediate" | "Advanced";
}

export interface JourneyItem {
  kind: "work" | "education" | "award";
  title: string;
  org: string;
  /** Dates kept as written in the PRD (e.g. "Feb 2024", "2023"). Awards use `start` for the date. */
  start: string;
  end?: string;
  employmentType?: string;
  summary?: string;
  stack?: string[];
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  bio: string;
  stats: { label: string; value: string }[];
  cvUrl: string;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}
