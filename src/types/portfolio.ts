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

/** Chapter 09 Articles. NOT PRD-transcribed — the PRD defers a blog ("Blog is
 *  out of scope unless explicitly requested at planning approval", §5), and
 *  this chapter is that explicit request (owner ask 2026-07-26). Entries are
 *  owner-supplied; unknown fields are omitted, never fabricated. No `slug` —
 *  nothing routes to an article, and `url` is already a stable React key. */
export interface Article {
  title: string;
  /** Where it ran — "Medium", "dev.to", a personal blog. */
  publication: string;
  /** Display-ready, not parsed: "Mar 2026". */
  date: string;
  url: string;
  /** Standfirst under the title — one sentence, ~90–140 chars (two lines at the
   *  card's width, one under 768px tall).
   *
   *  REQUIRED, superseding the 2026-07-26 "the card is deliberately minimal"
   *  decision: the owner asked (2026-08-01) for the background-image byline
   *  card, whose whole premise is a title plus a line of context over the
   *  photograph. Optional would put two silhouettes in one rail. */
  description: string;
  /** A `public/` path (e.g. "/assets/images/articles/foo.webp") or an absolute
   *  CDN URL — NOT a `src/assets` import, which fails `vite build` while the
   *  file is missing. The `Image` primitive falls back to its gray SVG until
   *  the real file lands.
   *
   *  REQUIRED as of the same redesign: the card IS the cover now, so an entry
   *  without one is a grey rectangle, not a variant of this design. */
  cover: string;
  readingTime?: string;
}

export type JourneyKind = "work" | "education" | "award";

export interface JourneyItem {
  kind: JourneyKind;
  title: string;
  org: string;
  period: string;
  employmentType?: string;
  summary?: string;
  /** The Journey card's list under the overview — "Responsibilities" on work
   *  items, "Focus Areas" on education. PRD facts re-voiced as a list (owner
   *  overdrive 2026-07-22); never new facts. */
  highlights?: string[];
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
  /** Journey chapter intro line — the PRD career arc re-voiced (stats §2 +
   *  work §3.3 facts only). */
  journeyStatement: string;
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
