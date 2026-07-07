import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Box } from "@/components/common";

/** Buffer scale vs CSS px — single perf knob (covers the DPR cap too). */
const RESOLUTION = 0.5;

interface Blob {
  /** center as fraction of canvas size */
  cx: number;
  cy: number;
  /** radius as fraction of canvas width */
  r: number;
  /** drift amplitude (fraction of size) and speed (rad/s) */
  amp: number;
  speed: number;
  phase: number;
  color: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  // Token in a non-hex format (oklch/rgb): use it as-is rather than crash.
  if (Number.isNaN(n)) return hex;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Hero aurora (design_system §11.1, reference beat 2): 2D-canvas additive
 *  radial blobs, upper-right weighted, drifting on gsap.ticker time; fades out
 *  as the hero scrolls past. Pauses when hidden/offscreen/faded. Reduced
 *  motion: static CSS radial gradient, no canvas, zero JS. */
export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const wrapper = ref.current;
      const canvas = wrapper?.querySelector("canvas");
      if (prefersReducedMotion || !wrapper || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Colors read once from the live tokens (re-theme-safe by name).
      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue("--color-accent").trim();
      const deep = styles.getPropertyValue("--color-accent-deep").trim();

      const blobs: Blob[] = [
        { cx: 0.74, cy: 0.22, r: 0.34, amp: 0.1, speed: 0.22, phase: 0, color: hexToRgba(accent, 0.5) },
        { cx: 0.9, cy: 0.42, r: 0.26, amp: 0.13, speed: 0.16, phase: 2.1, color: hexToRgba(deep, 0.45) },
        { cx: 0.58, cy: 0.1, r: 0.2, amp: 0.08, speed: 0.28, phase: 4.4, color: hexToRgba(accent, 0.3) },
      ];

      let offscreen = false;
      let faded = false;

      const io = new IntersectionObserver(([entry]) => {
        offscreen = !entry.isIntersecting;
      });
      io.observe(wrapper);

      const ro = new ResizeObserver(() => {
        canvas.width = Math.max(1, Math.round(wrapper.clientWidth * RESOLUTION));
        canvas.height = Math.max(1, Math.round(wrapper.clientHeight * RESOLUTION));
      });
      ro.observe(wrapper);

      // Fade the wrapper out as the hero section scrolls past.
      const section = wrapper.closest("section");
      const fade = gsap.to(wrapper, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section ?? wrapper,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            faded = self.progress === 1;
          },
        },
      });

      const tick = (time: number) => {
        if (document.hidden || offscreen || faded) return;
        const { width: w, height: h } = canvas;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        for (const b of blobs) {
          const x = (b.cx + Math.sin(time * b.speed + b.phase) * b.amp) * w;
          const y = (b.cy + Math.cos(time * b.speed * 0.8 + b.phase) * b.amp) * h;
          const r = b.r * w;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, b.color);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        ro.disconnect();
        fade.scrollTrigger?.kill();
        fade.kill();
        ScrollTrigger.refresh();
      };
    },
    { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  if (prefersReducedMotion) {
    return (
      <Box
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_20%,var(--color-accent-tint),transparent_60%)]"
      />
    );
  }

  return (
    <Box
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <canvas className="h-full w-full scale-110 blur-3xl" />
    </Box>
  );
}
