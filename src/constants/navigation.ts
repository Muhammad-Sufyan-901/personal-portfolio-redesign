/** Chapter anchors for the single-page narrative (PLAN v3 §0 chapter map). */
export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Intro", href: "#hero" },
  { label: "Who I Am", href: "#manifesto" },
  { label: "About", href: "#about" },
  { label: "Craft", href: "#craft" },
  { label: "Journey", href: "#journey" },
  { label: "Skills", href: "#skills" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

/** Curated subset for the desktop header (full list lives in MobileMenu +
 *  footer) — 8 links crowd a 72px bar. */
export const headerLinks: NavLink[] = navLinks.filter((l) =>
  ["About", "Journey", "Gallery", "Contact"].includes(l.label),
);
