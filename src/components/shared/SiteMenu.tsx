import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLenis } from "@/hooks/useLenis";
import { useUIStore } from "@/store/useUIStore";
import { navLinks } from "@/constants/navigation.constant";
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
      className="fixed inset-0 z-80 flex flex-col bg-primary"
    >
      <Box className="flex h-18 items-center justify-end px-page-x">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close menu"
          className="rounded-full border border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/20 hover:text-primary-foreground dark:hover:bg-primary-foreground/20"
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
          className="flex w-full flex-col gap-2"
        >
          {navLinks.map((link, i) => (
            <Box
              as="li"
              key={link.href}
              className="group overflow-hidden"
            >
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="menu-link relative flex items-baseline gap-4 px-page-x py-1"
              >
                <Box
                  as="span"
                  aria-hidden
                  className="absolute inset-0 -z-10 translate-x-full bg-primary-foreground transition-transform duration-300 ease-out group-hover:translate-x-0"
                />
                <Box
                  as="span"
                  className="font-mono text-index text-primary-foreground/60 transition-colors duration-300 ease-out group-hover:text-ink"
                >
                  {String(i + 1).padStart(2, "0")}
                </Box>
                <Box
                  as="span"
                  className="font-display text-statement text-primary-foreground transition-[transform,color] duration-300 ease-out group-hover:translate-x-3 group-hover:text-ink"
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
