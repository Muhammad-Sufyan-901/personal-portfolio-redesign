import type { Skill } from "@/types/portfolio";

/** PRD §3.1 — full skill list with exact levels (21 skills). */
export const skills: Skill[] = [
  { name: "HTML", level: "Advanced" },
  { name: "CSS", level: "Advanced" },
  { name: "JavaScript", level: "Advanced" },
  { name: "React JS", level: "Intermediate" },
  { name: "Next JS", level: "Intermediate" },
  { name: "Tailwind CSS", level: "Intermediate" },
  { name: "TypeScript", level: "Intermediate" },
  { name: "React Native", level: "Intermediate" },
  { name: "Angular", level: "Basic" },
  { name: "Bootstrap", level: "Intermediate" },
  { name: "PHP", level: "Intermediate" },
  { name: "MySQL", level: "Intermediate" },
  { name: "CodeIgniter", level: "Basic" },
  { name: "Node JS", level: "Basic" },
  { name: "Laravel", level: "Intermediate" },
  { name: "Vite", level: "Basic" },
  { name: "Material UI", level: "Basic" },
  { name: "Flutter", level: "Intermediate" },
  { name: "Dart", level: "Intermediate" },
  { name: "Firebase", level: "Basic" },
  { name: "Vue.js", level: "Basic" },
];

/** PRD §3.1 note — favored stacks shaping the Craft chapter pillars. */
export const webPillar: string[] = ["React", "TypeScript", "Tailwind", "shadcn/ui", "Laravel", "Livewire"];

export const mobilePillar: string[] = ["Flutter", "React Native"];

/** PRD §3.2 — tools. */
export const tools: string[] = ["Visual Studio Code", "GitHub", "Figma", "XAMPP", "Android Studio", "Git"];
