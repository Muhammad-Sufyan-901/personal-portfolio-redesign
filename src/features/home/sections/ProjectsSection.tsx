import { useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Box, ChapterEyebrow, Image, Link, PathDraw } from "@/components/common";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects.data";
import { TECH_ICONS } from "@/features/home/utils/tech-icons";
import { PROJECTS } from "@/features/home/utils/projects.tunables";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Scale the tunables' normalized (0–100) `d` into pixel coordinates so the
 *  SVG renders 1:1 — Chrome tiles screen-space dashes into disconnected
 *  segments on anisotropically stretched viewBoxes (see PathDraw note).
 *  Only absolute M/C commands: coordinates alternate x,y throughout. */
function scalePathD(d: string, w: number, h: number) {
  let i = 0;
  return d.replace(/-?\d+(?:\.\d+)?/g, (n) => {
    const v = (parseFloat(n) / 100) * (i++ % 2 === 0 ? w : h);
    return String(Math.round(v * 10) / 10);
  });
}

/** 04 Projects — the reference's scroll-activated project index: the row
 *  crossing the focal band lights up, reveals its description + stack badges,
 *  and drives the sticky preview crossfade (mouse-tilted in 3D), while the
 *  ember path thread draws behind the rows and hands off to Journey through a
 *  path-only finale beat (dissection: reference/project-refine.mp4). */
export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathLayerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Held (not cleared) when no row is active, so the counter never flashes
  // a wrong number during the preview fade-out.
  const [displayIndex, setDisplayIndex] = useState(0);
  const [pathBox, setPathBox] = useState<{ w: number; h: number } | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const activate = (i: number) => {
    setActiveIndex(i);
    setDisplayIndex(i);
  };

  // Measure the path layer → pixel-space d + viewBox (re-scaled on resize).
  useIsomorphicLayoutEffect(() => {
    const el = pathLayerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setPathBox({ w: Math.round(width), h: Math.round(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll-activation (focal band per row) + enter reveal. Reduced motion:
  // no triggers — every row renders bright with its description expanded.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const rows = gsap.utils.toArray<HTMLElement>(".projects-row");
      const focal = `${PROJECTS.focal * 100}%`;

      gsap.from(rows, {
        autoAlpha: 0,
        y: PROJECTS.revealY,
        stagger: PROJECTS.rowStagger,
        scrollTrigger: { trigger: ".projects-index", start: "top 80%", once: true },
      });

      rows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: `top ${focal}`,
          end: `bottom ${focal}`,
          onToggle: (self) => {
            if (self.isActive) activate(i);
          },
        });
      });
      // No row at the focal band (above the list / inside the finale) → none active.
      ScrollTrigger.create({
        trigger: ".projects-rows",
        start: `top ${focal}`,
        end: `bottom ${focal}`,
        onToggle: (self) => {
          if (!self.isActive) setActiveIndex(null);
        },
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  // Preview crossfade. No revertOnUpdate here: reverting would snap the
  // outgoing layer to its CSS-hidden state and flash the box through black —
  // overwrite:"auto" handles interleaving, and a live reduced-motion toggle is
  // covered by staticMode switching the container to `hidden`.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.to(".projects-preview", {
        autoAlpha: activeIndex === null ? 0 : 1,
        duration: PROJECTS.crossfade,
        overwrite: "auto",
      });
      gsap.utils.toArray<HTMLElement>(".projects-preview-layer").forEach((layer, i) => {
        gsap.to(layer, {
          autoAlpha: i === activeIndex ? 1 : 0,
          duration: PROJECTS.crossfade,
          overwrite: "auto",
        });
      });
    },
    { scope: sectionRef, dependencies: [activeIndex, prefersReducedMotion] },
  );

  // Preview mouse tilt — listener on the SECTION: the panel itself is
  // pointer-events-none. Separate block so it never re-runs on activeIndex;
  // only tweens the frame's rotation, so it can't fight the autoAlpha
  // crossfade above (and reverting rotation to 0 on an RM toggle is correct).
  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const section = sectionRef.current;
      const tiltGroup = section?.querySelector<HTMLElement>(".projects-preview-tilt");
      if (!section || !tiltGroup) return;

      gsap.set(tiltGroup, { transformPerspective: PROJECTS.tilt.perspective });
      const rx = gsap.quickTo(tiltGroup, "rotationX", { duration: PROJECTS.tilt.duration, ease: "power3.out" });
      const ry = gsap.quickTo(tiltGroup, "rotationY", { duration: PROJECTS.tilt.duration, ease: "power3.out" });

      const onMove = (e: MouseEvent) => {
        const r = tiltGroup.getBoundingClientRect();
        const nx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2));
        const ny = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2));
        ry(nx * PROJECTS.tilt.max);
        rx(-ny * PROJECTS.tilt.max);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
      };
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
      return () => {
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  const staticMode = prefersReducedMotion;

  return (
    <Box
      as="section"
      id="projects"
      ref={sectionRef}
      className="bg-ink px-page-x py-section mt-section relative"
    >
      <ChapterEyebrow
        index="04"
        label="Projects"
      />

      {/* Scroll-activated project index + path thread + finale runway */}
      <Box className="projects-index relative mt-14">
        <Box
          ref={pathLayerRef}
          aria-hidden
          className="-inset-x-page-x pointer-events-none absolute inset-y-0 z-0"
        >
          {pathBox && (
            <PathDraw
              d={scalePathD(PROJECTS.path.d, pathBox.w, pathBox.h)}
              viewBox={`0 0 ${pathBox.w} ${pathBox.h}`}
              strokeWidth={PROJECTS.path.strokeWidth}
              start={PROJECTS.path.start}
              end={PROJECTS.path.end}
              className="h-full w-full"
            />
          )}
        </Box>

        <Box
          as="h3"
          className="font-mono text-eyebrow text-muted relative z-10 uppercase"
        >
          Index — All Projects ({pad2(projects.length)})
        </Box>

        <Box
          as="ul"
          className="projects-rows border-line relative z-10 mt-6 border-b lg:pr-[40%]"
        >
          {projects.map((project, i) => {
            const active = staticMode || activeIndex === i;
            const inner = (
              <>
                <Box
                  as="span"
                  className={cn(
                    "projects-row-title text-statement block origin-left font-mono font-semibold transition-[scale,color] duration-(--dur-fast) ease-out motion-reduce:transition-none",
                    active ? "text-paper-bright scale-105" : "text-muted",
                  )}
                >
                  {project.title}
                </Box>
                <Box
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-(--dur-fast) ease-out motion-reduce:transition-none",
                    active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <Box className="overflow-hidden">
                    <Box
                      as="ul"
                      className="flex flex-wrap gap-2 pt-2"
                    >
                      {project.techStack.map((tech) => {
                        const TechIcon = TECH_ICONS[tech];
                        return (
                          <Box
                            as="li"
                            key={tech}
                            className="border-paper/15 bg-paper/10 text-paper-bright flex items-center gap-1.5 rounded-full border px-3 py-1 backdrop-blur-md"
                          >
                            {TechIcon && (
                              <TechIcon
                                aria-hidden
                                className="size-3"
                              />
                            )}
                            <Box
                              as="span"
                              className="font-mono text-meta uppercase tracking-wider"
                            >
                              {tech}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                    <Box
                      as="p"
                      className="font-mono text-body text-muted max-w-[52ch] pt-3"
                    >
                      {project.description}
                    </Box>
                    {(project.livePreviewURL || project.repositoryURL) && (
                      <Box className="flex flex-wrap gap-6 pt-4">
                        {project.livePreviewURL && (
                          <Link
                            href={project.livePreviewURL}
                            onFocus={() => activate(i)}
                            className="text-meta text-paper hover:text-accent group inline-flex items-center gap-1.5 font-mono uppercase tracking-wider underline decoration-1 underline-offset-4 transition-colors"
                          >
                            Live Preview
                            <Box
                              as="span"
                              aria-hidden
                              className="text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            >
                              ↗
                            </Box>
                          </Link>
                        )}
                        {project.repositoryURL && (
                          <Link
                            href={project.repositoryURL}
                            onFocus={() => activate(i)}
                            className="text-meta text-paper hover:text-accent group inline-flex items-center gap-1.5 font-mono uppercase tracking-wider underline decoration-1 underline-offset-4 transition-colors"
                          >
                            GitHub
                            <Box
                              as="span"
                              aria-hidden
                              className="text-whiteß transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            >
                              ↗
                            </Box>
                          </Link>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            );
            return (
              <Box
                as="li"
                key={project.slug}
                className="projects-row border-line border-t"
                style={{ "--row-indent": `${PROJECTS.indents[i] ?? 0}rem` } as CSSProperties}
              >
                <Box className="block py-10 pl-(--row-indent) md:py-14">{inner}</Box>
              </Box>
            );
          })}
        </Box>

        {/* Path-only handoff beat toward Journey (decision e) */}
        <Box
          aria-hidden
          style={{ height: PROJECTS.finaleRunway }}
        />

        {/* Sticky preview — visual echo of the active row (decorative) */}
        <Box
          aria-hidden
          className={cn(
            "projects-preview pointer-events-none absolute inset-y-0 right-0 z-20 w-[36%]",
            staticMode ? "hidden" : "invisible hidden opacity-0 lg:block",
          )}
        >
          <Box
            className="pointer-events-auto sticky top-[32svh]"
            data-cursor="See Project"
          >
            <Box className="projects-preview-tilt">
              <Box className="font-mono text-meta text-muted flex items-baseline justify-between pb-2 uppercase tracking-wider">
                <Box as="span">{projects[displayIndex]?.year ?? pad2(displayIndex + 1)}</Box>
                <Box as="span">Preview</Box>
              </Box>
              <Box className="projects-preview-frame bg-raised relative aspect-4/3 overflow-hidden rounded-lg">
                {projects.map((project) => (
                  <Box
                    key={project.slug}
                    className="projects-preview-layer invisible absolute inset-0 opacity-0"
                  >
                    {project.thumbnail ? (
                      <Image
                        src={project.thumbnail}
                        alt=""
                        width={720}
                        height={540}
                        objectFit="cover"
                        className="h-full w-full"
                      />
                    ) : (
                      /* Owner-approved placeholder until real shots arrive (a) */
                      <Box className="flex h-full w-full items-end bg-[radial-gradient(120%_120%_at_28%_18%,var(--color-accent)_0%,var(--color-accent-deep)_42%,var(--color-ink)_88%)] p-4">
                        <Box
                          as="span"
                          className="font-mono text-meta text-paper-bright/80 uppercase tracking-wider"
                        >
                          {project.title}
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
