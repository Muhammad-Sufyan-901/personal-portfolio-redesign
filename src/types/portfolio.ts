/** Content contract — all PRD constants are typed against these models
 *  (system_architecture §4.1). Facts come from product_requirements.md only. */

export type TechStack = string;

export type SkillLevel = "Advanced" | "Intermediate" | "Basic";

/** Category is presentation grouping for the Skills accordion (PLAN v3 §1);
 *  names and levels are verbatim PRD §3.1. */
export type SkillCategory = "Frontend" | "Mobile" | "Backend" | "Database";

export interface Skill {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  techStack: TechStack[];
  thumbnail?: string;
  livePreviewURL?: string;
  repositoryURL?: string;
  year?: string;
  featured: boolean;
}

export type JourneyKind = "work" | "education" | "award";

export interface JourneyItem {
  kind: JourneyKind;
  title: string;
  org: string;
  period: string;
  employmentType?: string;
  summary?: string;
  stack?: TechStack[];
}

export interface ProfileStat {
  value: number;
  label: string;
}

export interface Profile {
  name: string;
  /** OWNER-APPROVED display abbreviation of `name` for the hero headline only
   *  (decision 2026-07-16, alongside the Switzer/Instrument Serif pairing) —
   *  not PRD-transcribed; a11y surfaces (aria-label, title, OG) keep `name`. */
  heroName: { lead: string; tail: string };
  role: string;
  tagline: string;
  /** Substring of `tagline` rendered italic-serif in the hero (the
   *  reference's focal-phrase device). */
  taglineEmphasis?: string;
  location: string;
  roles: string[];
  bio: string;
  aboutStatement: string;
  /** Substrings of `aboutStatement` rendered italic-serif in the About
   *  chapter (the same focal-phrase device as `taglineEmphasis`). */
  aboutStatementEmphasis?: string[];
  /** Chapter 06 Skills positioning statement — persona §2 re-voiced into the
   *  reference's three-clause shape; facts only (role, location, tagline). */
  skillsStatement: string;
  manifesto: {
    lines: string[];
    focalWord: string;
  };
  stats: ProfileStat[];
  favoredStacks: {
    web: TechStack[];
    mobile: TechStack[];
  };
  cvUrl: string;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}
