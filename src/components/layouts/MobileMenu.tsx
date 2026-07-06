import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { Box, Link } from "@/components/common";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants/navigation";
import { useLenis } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { useUIStore } from "@/store/useUIStore";

/**
 * Full-screen mobile nav overlay (design_system §8.A). Static version — the
 * motion layer replaces the plain conditional render with a staggered reveal.
 * Focus: first link on open; focus returns to the opener (hamburger) on close.
 */
export function MobileMenu() {
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  // Staggered link reveal on open (overlay mounts fresh each time).
  // ponytail: close is instant (unmount) — add an exit tween only if QA wants it.
  useGSAP(
    () => {
      if (!overlayRef.current || prefersReducedMotion) return; // reduced motion: static open
      gsap.from(".menu-link", { yPercent: 100, stagger: 0.06 });
    },
    { scope: overlayRef, dependencies: [menuOpen, prefersReducedMotion] },
  );

  useEffect(() => {
    if (!menuOpen) return;

    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    firstLinkRef.current?.focus();
    lenis?.stop();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lenis?.start();
      returnFocusRef.current?.focus();
    };
  }, [menuOpen, setMenuOpen, lenis]);

  if (!menuOpen) return null;

  const close = () => setMenuOpen(false);

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      ref={overlayRef}
      className="fixed inset-0 z-[80] flex flex-col bg-ink px-page-x"
    >
      <Box className="flex h-18 items-center justify-end">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close menu"
          onClick={close}
          className="text-paper hover:bg-raised hover:text-paper"
        >
          <X />
        </Button>
      </Box>

      <Box
        as="nav"
        aria-label="Chapters"
        className="flex flex-1 items-center"
      >
        <Box
          as="ul"
          className="flex flex-col gap-6"
        >
          {navLinks.map((link, i) => (
            <Box
              as="li"
              key={link.href}
              className="overflow-hidden"
            >
              <Link
                href={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                onClick={close}
                className="menu-link flex items-baseline gap-4"
              >
                <Box
                  as="span"
                  className="font-mono text-index text-accent"
                >
                  {link.index}
                </Box>
                <Box
                  as="span"
                  className="font-display text-chapter text-paper"
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
