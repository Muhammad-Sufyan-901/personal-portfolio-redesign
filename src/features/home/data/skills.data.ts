import type { Skill, SkillLevel } from "@/types/portfolio";

/** PRD §3.1 — all 21 skills, names + levels verbatim. `category` is
 *  presentation grouping for the Skills accordion (PLAN v3), not PRD data. */
export const skills: Skill[] = [
  // Frontend (12)
  { name: "HTML", level: "Advanced", category: "Frontend" },
  { name: "CSS", level: "Advanced", category: "Frontend" },
  { name: "JavaScript", level: "Advanced", category: "Frontend" },
  { name: "React JS", level: "Intermediate", category: "Frontend" },
  { name: "Next JS", level: "Intermediate", category: "Frontend" },
  { name: "Tailwind CSS", level: "Intermediate", category: "Frontend" },
  { name: "TypeScript", level: "Intermediate", category: "Frontend" },
  { name: "Angular", level: "Basic", category: "Frontend" },
  { name: "Bootstrap", level: "Intermediate", category: "Frontend" },
  { name: "Material UI", level: "Basic", category: "Frontend" },
  { name: "Vue.js", level: "Basic", category: "Frontend" },
  { name: "Vite", level: "Basic", category: "Frontend" },
  // Mobile (3)
  { name: "React Native", level: "Intermediate", category: "Mobile" },
  { name: "Flutter", level: "Intermediate", category: "Mobile" },
  { name: "Dart", level: "Intermediate", category: "Mobile" },
  // Backend (4)
  { name: "PHP", level: "Intermediate", category: "Backend" },
  { name: "Laravel", level: "Intermediate", category: "Backend" },
  { name: "CodeIgniter", level: "Basic", category: "Backend" },
  { name: "Node JS", level: "Basic", category: "Backend" },
  // Database (2)
  { name: "MySQL", level: "Intermediate", category: "Database" },
  { name: "Firebase", level: "Basic", category: "Database" },
];

/** PRD §3.2 — verbatim. */
export const tools: string[] = ["Visual Studio Code", "GitHub", "Figma", "XAMPP", "Android Studio", "Git"];

/** Presentation regrouping for the 06 Skills accordion (owner taxonomy,
 *  2026-07-21) — items pulled from the verbatim `skills`/`tools` arrays above:
 *  regrouped, never invented. The owner taxonomy's "Animation & 3D" group is
 *  DEFERRED — the PRD has no animation/3D skills to back it. */
export interface SkillGroupItem {
  name: string;
  /** present on §3.1 skills, absent on §3.2 tools */
  level?: SkillLevel;
}

export interface SkillGroup {
  label: string;
  items: SkillGroupItem[];
}

const byCategory = (category: Skill["category"]): SkillGroupItem[] => skills.filter((s) => s.category === category);

/** Picks from `tools`, so only verbatim PRD strings can ever appear. */
const toolItems = (names: string[]): SkillGroupItem[] =>
  tools.filter((t) => names.includes(t)).map((name) => ({ name }));

export const skillGroups: SkillGroup[] = [
  { label: "Frontend", items: byCategory("Frontend") },
  { label: "Backend", items: byCategory("Backend") },
  { label: "Databases", items: byCategory("Database") },
  { label: "DevOps & Tools", items: toolItems(["Visual Studio Code", "GitHub", "XAMPP", "Git"]) },
  { label: "Mobile", items: [...byCategory("Mobile"), ...toolItems(["Android Studio"])] },
  { label: "Design", items: toolItems(["Figma"]) },
];
