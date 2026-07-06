import { useRef } from "react";
import { Menu } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { Box, Link } from "@/components/common";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ScrollTrigger } from "@/lib/gsap";
import { useUIStore } from "@/store/useUIStore";

/**
 * Site header (design_system §8.A). Static state: transparent over the hero;
 * the motion layer toggles the solid state (bg-ink border-b border-line) via
 * the `data-header` hook at scrollY > 40.
 * z-scale: header z-[60] < mobile menu z-[80] < preloader z-[90] < cursor z-[100].
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const solid = ["bg-ink", "border-line"];

      if (prefersReducedMotion) {
        // ponytail: no scroll-linked state under reduced motion — solid always
        el.classList.add(...solid);
        return;
      }

      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => el.classList[self.isActive ? "add" : "remove"](...solid),
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="header"
      data-header
      ref={ref}
      className="fixed inset-x-0 top-0 z-[60] h-18 border-b border-transparent transition-colors"
    >
      <Box className="flex h-full items-center justify-between px-page-x">
        <Link
          href="#intro"
          aria-label="Muhammad Sufyan — back to intro"
          className="font-display text-item text-paper"
        >
          MS
        </Link>

        <Box
          as="nav"
          aria-label="Chapters"
          className="hidden md:block"
        >
          <Box
            as="ul"
            className="flex items-center gap-8"
          >
            {navLinks.map((link) => (
              <Box
                as="li"
                key={link.href}
              >
                <Link
                  href={link.href}
                  className="font-mono text-index text-muted transition-colors hover:text-paper"
                >
                  <Box
                    as="span"
                    className="text-faint"
                  >
                    {link.index}
                  </Box>{" "}
                  {link.label}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="text-paper hover:bg-raised hover:text-paper md:hidden"
        >
          <Menu />
        </Button>
      </Box>
    </Box>
  );
}
