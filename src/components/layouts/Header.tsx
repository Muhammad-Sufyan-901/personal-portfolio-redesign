import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useUIStore } from "@/store/useUIStore";
import { Box, Link, MagneticButton } from "@/components/common";
import { Button } from "@/components/ui/button";

/** Fixed 72px header (design_system §8A), z-60: transparent over the hero →
 *  ink + hairline after 40px of scroll (class toggle, not a re-render).
 *  Reduced motion: solid always. Nav lives entirely in the fullscreen
 *  SiteMenu, opened by the glass "Menu" pill (all viewports). */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const solid = ["bg-ink", "border-line"];
      if (prefersReducedMotion) {
        el.classList.add(...solid);
        // classList isn't a tween — revertOnUpdate won't undo it on a live flip
        return () => el.classList.remove(...solid);
      }
      const trigger = ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => {
          el.classList.toggle(solid[0], self.isActive);
          el.classList.toggle(solid[1], self.isActive);
        },
      });
      return () => trigger.kill();
    },
    { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="header"
      ref={ref}
      className="fixed inset-x-0 top-0 z-[60] flex h-18 items-center justify-between border-b border-transparent px-page-x transition-colors duration-300"
    >
      <Link
        href="#hero"
        className="font-display text-item text-paper"
        aria-label="Back to top"
      >
        MS
      </Link>

      <MagneticButton>
        <Button
          variant="ghost"
          aria-label="Open menu"
          className="h-10 rounded-full border border-paper/15 bg-paper/10 px-6 font-mono text-eyebrow text-paper uppercase backdrop-blur-md hover:bg-paper/20 hover:text-paper dark:hover:bg-paper/20"
          onClick={() => setMenuOpen(true)}
        >
          <Box
            as="span"
            className="magnetic-label"
          >
            Menu
          </Box>
        </Button>
      </MagneticButton>
    </Box>
  );
}
