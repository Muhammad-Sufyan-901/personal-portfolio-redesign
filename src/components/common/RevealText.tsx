import { useRef, type ReactNode } from "react";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { RevealMode } from "@/types/motion";
import { cn } from "@/lib/utils";

const STAGGER: Record<RevealMode, number> = {
  lines: 0.08,
  words: 0.04,
  chars: 0.025,
};

const SPLIT_TYPES: Record<RevealMode, string> = {
  lines: "lines",
  words: "lines,words",
  chars: "lines,words,chars",
};

type RevealElement = "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface RevealTextProps {
  children: ReactNode;
  mode?: RevealMode;
  as?: RevealElement;
  className?: string;
  delay?: number;
  stagger?: number;
}

/** split-type reveal on ScrollTrigger enter (design_system §7.2 line/char
 *  reveal). Reduced motion: renders static, no split. */
export function RevealText({ children, mode = "lines", as = "div", className, delay = 0, stagger }: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const Component = as;

  useGSAP(
    () => {
      if (prefersReducedMotion || !ref.current) return;

      const split = new SplitType(ref.current, {
        types: SPLIT_TYPES[mode] as "lines",
      });

      let targets: HTMLElement[] = [];
      if (mode === "lines") {
        // Wrap each line in a created overflow-hidden clip parent
        // (split.revert() restores innerHTML, removing the wrappers).
        targets = split.lines ?? [];
        targets.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.style.overflow = "hidden";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });
      } else {
        (split.lines ?? []).forEach((line) => {
          line.style.overflow = "hidden";
        });
        targets = (mode === "words" ? split.words : split.chars) ?? [];
      }

      gsap.from(targets, {
        yPercent: 100,
        delay,
        stagger: stagger ?? STAGGER[mode],
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [prefersReducedMotion, mode] },
  );

  return (
    <Component
      ref={ref}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
