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
  role: string;
  tagline: string;
  location: string;
  roles: string[];
  bio: string;
  aboutStatement: string;
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
