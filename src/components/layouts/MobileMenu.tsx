import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLenis } from "@/hooks/useLenis";
import { useUIStore } from "@/store/useUIStore";
import { navLinks } from "@/constants/navigation";
import { Box, Link } from "@/components/common";
import { Button } from "@/components/ui/button";

/** Full-screen overlay menu (design_system §8A), z-80. Renders null closed;
 *  staggered link reveal on open; close is instant unmount (deliberate).
 *  Background content is `inert` while open (RootLayout owns that). */
export function MobileMenu() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  // Scroll-lock + Escape-to-close + focus move/restore while open.
  useEffect(() => {
    if (!menuOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>('[aria-label="Close menu"]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      trigger?.focus();
    };
  }, [menuOpen, lenis, setMenuOpen]);

  useGSAP(
    () => {
      if (!menuOpen || prefersReducedMotion) return;
      gsap.from(".menu-link", { yPercent: 100, stagger: 0.06 });
    },
    { scope: ref, dependencies: [menuOpen, prefersReducedMotion], revertOnUpdate: true },
  );

  if (!menuOpen) return null;

  return (
    <Box
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[80] flex flex-col bg-ink px-page-x"
    >
      <Box className="flex h-18 items-center justify-end">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close menu"
          className="text-paper"
          onClick={() => setMenuOpen(false)}
        >
          <X aria-hidden />
        </Button>
      </Box>

      <Box
        as="nav"
        aria-label="Chapters"
        className="flex flex-1 items-center"
      >
        <Box
          as="ul"
          className="flex flex-col gap-2"
        >
          {navLinks.map((link, i) => (
            <Box
              as="li"
              key={link.href}
              className="overflow-hidden"
            >
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="menu-link flex items-baseline gap-4 py-1"
              >
                <Box
                  as="span"
                  className="font-mono text-index text-accent"
                >
                  {String(i + 1).padStart(2, "0")}
                </Box>
                <Box
                  as="span"
                  className="font-display text-statement text-paper"
                >
                  {link.label}
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
