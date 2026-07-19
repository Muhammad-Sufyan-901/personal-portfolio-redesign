import { useRef, type ReactNode, type RefObject } from "react";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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

/** Slight rise for the scrubbed blur variant — blur must not be clipped, so
 *  no yPercent-in-clip-wrapper; a small unclipped drift instead. Exported for
 *  siblings that mirror this grammar on unsplittable targets (About's CV). */
export const SCRUB_Y = 12;

type RevealElement = "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface RevealTextProps {
  children: ReactNode;
  mode?: RevealMode;
  as?: RevealElement;
  className?: string;
  delay?: number;
  stagger?: number;
  /** External trigger (PathDraw precedent). Defaults to the own root.
   *  Pass a SELECTOR when the trigger is an ancestor: React attaches a
   *  parent's ref only after this child's layout effect runs, so an ancestor
   *  RefObject is still null here — but the element is already in the DOM. */
  trigger?: RefObject<HTMLElement | null> | string;
  start?: ScrollTrigger.Vars["start"];
  /** Scrub variant only. */
  end?: ScrollTrigger.Vars["end"];
  /** Scrubbed, REVERSIBLE reveal across [start, end] instead of the
   *  once-on-enter reveal. Numeric = ScrollTrigger catch-up seconds. */
  scrub?: boolean | number;
  /** px — blur→clear channel for the scrub variant; 0 = opacity+y only (the
   *  low-perf degrade). Blur is finite: every target gets an in-timeline
   *  `filter: none` at its settle position (symmetric on reverse). */
  blurFrom?: number;
  /** Pre-reveal opacity floor for the scrub variant — veiled, not invisible. */
  veiledOpacity?: number;
}

/** split-type reveal (design_system §7.2). Default: once-on-enter line/word/
 *  char rise. With `scrub`: veiled targets resolve blur→clear across an
 *  external scroll range. Reduced motion: renders static, no split.
 *  Nested-element caveat: split-type line-groups a nested span as ONE atomic
 *  unit — feed this plain text only (mixed-face statements use React-owned
 *  word spans instead, the StatementWords pattern). */
export function RevealText({
  children,
  mode = "lines",
  as = "div",
  className,
  delay = 0,
  stagger,
  trigger,
  start = "top 80%",
  end,
  scrub,
  blurFrom = 0,
  veiledOpacity = 0,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const Component = as;

  useGSAP(
    () => {
      if (prefersReducedMotion || !ref.current) return;
      const el = ref.current;
      const triggerEl =
        (typeof trigger === "string" ? document.querySelector<HTMLElement>(trigger) : trigger?.current) ?? el;

      if (scrub === undefined) {
        // Once-on-enter reveal (shipped behavior, unchanged).
        const split = new SplitType(el, { types: SPLIT_TYPES[mode] as "lines" });

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
          scrollTrigger: { trigger: triggerEl, start, once: true },
        });

        return () => split.revert();
      }

      // Scrub variant — no clip wrappers (they would crop the blur halo).
      let split = new SplitType(el, { types: SPLIT_TYPES[mode] as "lines" });
      const step = stagger ?? STAGGER[mode];
      const targetDur = step * 3; // ~3 targets mid-resolve = the veiled cascade
      const veil = {
        opacity: veiledOpacity,
        y: SCRUB_Y,
        ...(blurFrom > 0 && { filter: `blur(${blurFrom}px)` }),
      };
      const targetsOf = () => (mode === "lines" ? split.lines : mode === "words" ? split.words : split.chars) ?? [];

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      // Rebuild = re-split (line wraps move with the viewport) + re-add
      // children. Safe ONLY while every child is fromTo/set with both ends
      // explicit — after tl.clear() nothing re-records stale start values.
      const rebuild = (resplit: boolean) => {
        if (resplit) {
          split.revert();
          split = new SplitType(el, { types: SPLIT_TYPES[mode] as "lines" });
        }
        tl.clear();
        const targets = targetsOf();
        // Explicit pre-scrub state — timeline children past the playhead
        // don't render until reached (shipped items pattern, no flash).
        gsap.set(targets, veil);
        targets.forEach((target, i) => {
          const at = i * step;
          tl.fromTo(
            target,
            { ...veil },
            { opacity: 1, y: 0, ...(blurFrom > 0 && { filter: "blur(0px)" }), duration: targetDur },
            at,
          );
          if (blurFrom > 0) tl.set(target, { filter: "none" }, at + targetDur);
        });
      };
      rebuild(false);
      ScrollTrigger.create({
        animation: tl,
        trigger: triggerEl,
        start,
        end,
        scrub,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          rebuild(true);
          // Rebuilt children don't render while the playhead is parked — a
          // refresh past the trigger (resize at page bottom) leaves forward
          // progress clamped at 1, so nothing ever moves the playhead and
          // the fresh splits keep their veil set. Force one render at the
          // trigger's current progress (found in odometer QA 2026-07-19).
          tl.progress(self.progress);
        },
      });

      return () => split.revert();
    },
    {
      scope: ref,
      dependencies: [prefersReducedMotion, mode, scrub, blurFrom, veiledOpacity],
      revertOnUpdate: true,
    },
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
