import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLenis } from "@/hooks/useLenis";
import { useUIStore } from "@/store/useUIStore";
import { navLinks } from "@/constants/navigation";
import { Box, Link } from "@/components/common";
import { Button } from "@/components/ui/button";

/** Full-screen overlay menu (design_system §8A), z-80 — all viewports, opened
 *  by the header's glass "Menu" pill. Curtain wipes down (preloader language),
 *  links stagger in; close reverses (links drop, curtain wipes up) before
 *  unmount. Reduced motion: instant mount/unmount, no transforms. Background
 *  content is `inert` while open (RootLayout owns that). */
export function SiteMenu() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  // Stays mounted through the exit animation; the exit timeline unmounts it.
  // Adjusted during render (react.dev "storing information from previous
  // renders") — reduced motion skips the exit tween, so unmount is instant.
  const [rendered, setRendered] = useState(menuOpen);
  if (menuOpen && !rendered) setRendered(true);
  if (!menuOpen && rendered && prefersReducedMotion) setRendered(false);

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
      const el = ref.current;
      if (!rendered || prefersReducedMotion || !el) return;

      const tl = gsap.timeline();
      if (menuOpen) {
        tl.fromTo(el, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: "power4.inOut" }).from(
          ".menu-link",
          { yPercent: 100, stagger: 0.06 },
          "-=0.25",
        );
      } else {
        tl.to(".menu-link", { yPercent: 100, duration: 0.4, stagger: 0.04 }).to(
          el,
          {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => setRendered(false),
          },
          "-=0.15",
        );
      }
    },
    { scope: ref, dependencies: [menuOpen, rendered, prefersReducedMotion], revertOnUpdate: true },
  );

  if (!rendered) return null;

  return (
    <Box
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-80 flex flex-col bg-ink px-page-x"
    >
      <Box className="flex h-18 items-center justify-end">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close menu"
          className="rounded-full border border-paper/15 bg-paper/10 text-paper backdrop-blur-md hover:bg-paper/20 hover:text-paper dark:hover:bg-paper/20"
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
