import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { RevealMode } from "@/types/motion";
import { Box } from "./Box";

type RevealTag = "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface RevealTextProps {
  children: ReactNode;
  mode?: RevealMode;
  as?: RevealTag;
  className?: string;
  delay?: number;
  stagger?: number;
}

const SPLIT_TYPES: Record<RevealMode, "lines" | "lines,words" | "lines,words,chars"> = {
  lines: "lines",
  words: "lines,words",
  chars: "lines,words,chars",
};

const DEFAULT_STAGGER: Record<RevealMode, number> = {
  lines: 0.08,
  words: 0.04,
  chars: 0.025,
};

export function RevealText({ children, mode = "lines", as = "div", className, delay = 0, stagger }: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      // Reduced motion: children render plainly in final state — no split, no transforms.
      if (!el || prefersReducedMotion) return;

      const split = new SplitType(el, { types: SPLIT_TYPES[mode] });

      if (mode === "lines") {
        // Lines animate themselves, so each needs its own clipping parent.
        // split.revert() restores the original innerHTML, removing these wrappers too.
        split.lines?.forEach((line) => {
          const wrap = document.createElement("div");
          wrap.className = "overflow-hidden";
          line.parentNode?.insertBefore(wrap, line);
          wrap.appendChild(line);
        });
      } else {
        // Words/chars animate inside their line, so the line itself can clip.
        split.lines?.forEach((line) => line.classList.add("overflow-hidden"));
      }

      const targets = mode === "lines" ? split.lines : mode === "words" ? split.words : split.chars;
      if (targets?.length) {
        gsap.from(targets, {
          yPercent: 100,
          delay,
          stagger: stagger ?? DEFAULT_STAGGER[mode],
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
      }

      return () => split.revert();
    },
    { scope: ref, dependencies: [prefersReducedMotion, mode, delay, stagger] },
  );

  return (
    <Box
      as={as}
      ref={ref}
      className={className}
    >
      {children}
    </Box>
  );
}
