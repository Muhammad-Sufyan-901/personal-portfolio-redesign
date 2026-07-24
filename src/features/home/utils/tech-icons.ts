import type { IconType } from "react-icons";
import {
  SiAngular,
  SiBootstrap,
  SiCss,
  SiDart,
  SiExpo,
  SiExpress,
  SiFirebase,
  SiFlutter,
  SiFramer,
  SiGraphql,
  SiGsap,
  SiHtml5,
  SiInertia,
  SiJavascript,
  SiJira,
  SiLaravel,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";

/** techStack label (PRD/GitHub spelling) → Simple Icons brand logo. Used by
 *  04 Projects badges and 08 Journey stack pills — 06 Skills uses the
 *  owner-supplied SVGs in `src/assets/icons` (see `skill-icons.ts`). Unmapped
 *  strings render as text-only pills ("Blade", "Docs" have no Simple Icon —
 *  deliberate). */
export const TECH_ICONS: Record<string, IconType> = {
  "Next JS": SiNextdotjs,
  Tailwind: SiTailwindcss,
  "Express JS": SiExpress,
  HTML: SiHtml5,
  CSS: SiCss,
  JS: SiJavascript,
  Bootstrap: SiBootstrap,
  "React JS": SiReact,
  Vite: SiVite,
  "Framer Motion": SiFramer,
  Flutter: SiFlutter,
  Dart: SiDart,
  Laravel: SiLaravel,
  PHP: SiPhp,
  Inertia: SiInertia,
  "React Native": SiReact,
  Expo: SiExpo,
  TypeScript: SiTypescript,
  Supabase: SiSupabase,
  "Node JS": SiNodedotjs,
  GSAP: SiGsap,
  // 08 Journey stacks (2026-07-25)
  Firebase: SiFirebase,
  MySQL: SiMysql,
  Angular: SiAngular,
  GraphQL: SiGraphql,
  Jira: SiJira,
};
