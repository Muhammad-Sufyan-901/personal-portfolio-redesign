import type { Skill } from "@/types/portfolio";

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
