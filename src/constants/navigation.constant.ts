/** Chapter anchors for the single-page narrative (PLAN v3 §0 chapter map). */
export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Intro", href: "#hero" },
  { label: "Who Am I", href: "#manifesto" },
  { label: "About", href: "#about" },
  { label: "Craft", href: "#craft" },
  { label: "Journey", href: "#journey" },
  { label: "Skills", href: "#skills" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];
