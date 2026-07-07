import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Box } from "@/components/common";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Internal buffer at ~0.5× CSS px — the canvas sits under blur-3xl so extra
 * resolution is invisible; 0.5 also satisfies the DPR ≤ 1.5 cap in one knob.
 */
const RESOLUTION = 0.5;

const WRAPPER = "pointer-events-none absolute inset-0 -z-10 overflow-hidden";

/** #rrggbb → rgba(). ponytail: globals.css tokens are 6-digit hex; extend if that changes. */
function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.trim().slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * Hero aurora (design_system v2 §11.1, §3.0b #1) — soft ember wash drifting
 * in the upper-right. Atmosphere only: low alpha, additive blend, heavy CSS
 * blur. Fades out as the hero scrolls away (draw loop stops when fully
 * faded, offscreen, or the tab is hidden). Reduced motion: static CSS
 * radial gradient, no canvas, zero JS work.
 */
export function AuroraBackground() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      const canvas = canvasRef.current;
      if (!el || !canvas || prefersReducedMotion) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Colors come from the computed tokens, never hex literals — re-theme-safe.
      // ponytail: read once at mount; re-read on theme flip if a toggle ships.
      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue("--accent");
      const deep = styles.getPropertyValue("--accent-deep");

      // Three blobs weighted to the upper-right; x/y/r are fractions of the box.
      const blobs = [
        { x: 0.78, y: 0.18, r: 0.45, speed: 0.16, phase: 0, color: rgba(accent, 0.1) },
        { x: 0.6, y: 0.32, r: 0.38, speed: 0.11, phase: 2.1, color: rgba(deep, 0.09) },
        { x: 0.9, y: 0.45, r: 0.3, speed: 0.2, phase: 4.2, color: rgba(accent, 0.07) },
      ];

      let offscreen = false;
      let faded = false;

      const draw = (time: number) => {
        const { width: w, height: h } = canvas;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        for (const b of blobs) {
          const cx = (b.x + 0.06 * Math.sin(time * b.speed + b.phase)) * w;
          const cy = (b.y + 0.05 * Math.cos(time * b.speed * 0.8 + b.phase)) * h;
          const r = b.r * Math.max(w, h);
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0, b.color);
          // Additive blend: transparent black at the edge adds nothing, so
          // blobs fade cleanly without darkening.
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Single RAF authority — the loop rides gsap.ticker (time in seconds).
      const tick = (time: number) => {
        if (document.hidden || offscreen || faded) return;
        draw(time);
      };
      gsap.ticker.add(tick);

      // Fires on observe → also does the initial buffer sizing.
      const ro = new ResizeObserver(() => {
        canvas.width = Math.max(1, Math.round(el.clientWidth * RESOLUTION));
        canvas.height = Math.max(1, Math.round(el.clientHeight * RESOLUTION));
      });
      ro.observe(el);

      const io = new IntersectionObserver(([entry]) => {
        offscreen = !entry.isIntersecting;
      });
      io.observe(el);

      // Fade with the hero: fully gone by the time the section scrolls out.
      gsap.to(el, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") ?? el,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            faded = self.progress === 1;
          },
        },
      });

      return () => {
        gsap.ticker.remove(tick);
        ro.disconnect();
        io.disconnect();
      };
    },
    { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  // Reduced motion: mood survives as a static token-driven gradient.
  if (prefersReducedMotion) {
    return (
      <Box
        aria-hidden="true"
        className={cn(WRAPPER, "bg-[radial-gradient(ellipse_at_75%_20%,var(--accent-tint),transparent_60%)]")}
      />
    );
  }

  return (
    <Box
      aria-hidden="true"
      ref={ref}
      className={WRAPPER}
    >
      {/* raw canvas is the wrapper-less leaf exception; overscale hides blurred edges */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full scale-110 blur-3xl"
      />
    </Box>
  );
}
