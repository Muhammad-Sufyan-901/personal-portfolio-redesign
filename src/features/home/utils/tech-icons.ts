import type { IconType } from "react-icons";
import {
  SiBootstrap,
  SiCss,
  SiExpress,
  SiFramer,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiVite,
} from "react-icons/si";

/** techStack label (PRD spelling) → Simple Icons brand logo. Unmapped strings
 *  render as text-only pills. ponytail: feature-local; promote to src/lib if
 *  Skills (06) reuses it. */
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
};
