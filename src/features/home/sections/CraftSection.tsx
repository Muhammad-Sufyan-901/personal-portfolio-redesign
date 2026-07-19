import { useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Box, ChapterEyebrow, Image, Link, Marquee, PathDraw, RevealText } from "@/components/common";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects.data";
import { profile } from "@/features/home/data/profile.data";
import { skills } from "@/features/home/data/skills.data";
import { CRAFT } from "@/features/home/utils/craft.tunables";

/** favoredStacks names → skills names where they differ (PRD spellings). */
const LEVEL_ALIAS: Record<string, string> = {
  React: "React JS",
  Tailwind: "Tailwind CSS",
};

function levelFor(name: string) {
  return skills.find((skill) => skill.name === (LEVEL_ALIAS[name] ?? name))?.level;
}

const pillars = [
  { label: "Web", items: profile.favoredStacks.web },
  { label: "Mobile", items: profile.favoredStacks.mobile },
] as const;

const keywords = [...profile.favoredStacks.web, ...profile.favoredStacks.mobile];

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

/** 04 Project/Craft — approach pillars, keyword marquee, and the reference's
 *  scroll-activated project index: the row crossing the focal band lights up,
 *  reveals its description, and drives the sticky preview crossfade, while the
 *  ember path thread draws behind the rows and hands off to Journey through a
 *  path-only finale beat (dissection: reference/project-refine.mp4). */
export function CraftSection() {
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

  // Scroll-activation (focal band per row) + enter reveals. Reduced motion:
  // no triggers — every row renders bright with its description expanded.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const rows = gsap.utils.toArray<HTMLElement>(".craft-row");
      const focal = `${CRAFT.focal * 100}%`;

      gsap.from(".pillar-item", {
        autoAlpha: 0,
        y: CRAFT.revealY,
        stagger: CRAFT.rowStagger,
        scrollTrigger: { trigger: ".craft-pillars", start: "top 80%", once: true },
      });
      gsap.from(rows, {
        autoAlpha: 0,
        y: CRAFT.revealY,
        stagger: CRAFT.rowStagger,
        scrollTrigger: { trigger: ".craft-index", start: "top 80%", once: true },
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
        trigger: ".craft-rows",
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
      gsap.to(".craft-preview", {
        autoAlpha: activeIndex === null ? 0 : 1,
        duration: CRAFT.crossfade,
        overwrite: "auto",
      });
      gsap.utils.toArray<HTMLElement>(".craft-preview-layer").forEach((layer, i) => {
        gsap.to(layer, {
          autoAlpha: i === activeIndex ? 1 : 0,
          duration: CRAFT.crossfade,
          overwrite: "auto",
        });
      });
    },
    { scope: sectionRef, dependencies: [activeIndex, prefersReducedMotion] },
  );

  const staticMode = prefersReducedMotion;

  return (
    <Box
      as="section"
      id="craft"
      ref={sectionRef}
      className="bg-ink px-page-x py-section relative"
    >
      <ChapterEyebrow
        index="04"
        label="What I Do"
      />

      <RevealText
        as="h2"
        mode="lines"
        className="font-display text-chapter text-paper mt-6"
      >
        Web &amp; Mobile
      </RevealText>

      {/* Approach pillars — favored stacks with levels from the skills data */}
      <Box className="craft-pillars mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-2">
        {pillars.map((pillar) => (
          <Box key={pillar.label}>
            <Box className="pillar-item border-line flex items-baseline justify-between border-b pb-3">
              <Box
                as="h3"
                className="font-display text-item text-paper"
              >
                {pillar.label}
              </Box>
              <Box
                as="span"
                className="font-mono text-meta text-muted"
              >
                ({pad2(pillar.items.length)})
              </Box>
            </Box>
            <Box as="ul">
              {pillar.items.map((name) => {
                const level = levelFor(name);
                return (
                  <Box
                    as="li"
                    key={name}
                    className="pillar-item border-line flex items-baseline justify-between border-b py-3"
                  >
                    <Box
                      as="span"
                      className="text-body text-paper"
                    >
                      {name}
                    </Box>
                    {level && (
                      <Box
                        as="span"
                        className="font-mono text-meta text-muted uppercase tracking-wider"
                      >
                        {level}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Full-bleed keyword band */}
      <Box className="border-line -mx-page-x mt-20 border-y">
        <Marquee className="py-3">
          <Box
            as="span"
            className="text-statement text-muted font-sans uppercase tracking-wide whitespace-nowrap"
          >
            {keywords.join(" · ")}&nbsp;·
          </Box>
        </Marquee>
      </Box>

      {/* Scroll-activated project index + path thread + finale runway */}
      <Box className="craft-index relative mt-24">
        <Box
          ref={pathLayerRef}
          aria-hidden
          className="-inset-x-page-x pointer-events-none absolute inset-y-0 z-0"
        >
          {pathBox && (
            <PathDraw
              d={scalePathD(CRAFT.path.d, pathBox.w, pathBox.h)}
              viewBox={`0 0 ${pathBox.w} ${pathBox.h}`}
              strokeWidth={CRAFT.path.strokeWidth}
              start={CRAFT.path.start}
              end={CRAFT.path.end}
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
          className="craft-rows border-line relative z-10 mt-6 border-b lg:pr-[40%]"
        >
          {projects.map((project, i) => {
            const href = project.livePreviewURL ?? project.repositoryURL;
            const active = staticMode || activeIndex === i;
            const inner = (
              <>
                <Box
                  as="span"
                  className={cn(
                    "craft-row-title text-statement block origin-left font-sans transition-[color,scale] duration-(--dur-fast) ease-(--ease-out) motion-reduce:transition-none",
                    active ? "text-paper-bright scale-105" : "text-muted",
                  )}
                >
                  {project.title}
                </Box>
                <Box
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-(--dur-fast) ease-(--ease-out) motion-reduce:transition-none",
                    active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <Box className="overflow-hidden">
                    <Box
                      as="p"
                      className="text-body text-muted max-w-[52ch] pt-2"
                    >
                      {project.description}
                    </Box>
                  </Box>
                </Box>
              </>
            );
            return (
              <Box
                as="li"
                key={project.slug}
                className="craft-row border-line border-t"
                style={{ "--row-indent": `${CRAFT.indents[i] ?? 0}rem` } as CSSProperties}
              >
                {href ? (
                  <Link
                    href={href}
                    data-cursor="VIEW"
                    className="block py-6 pl-(--row-indent)"
                    onFocus={() => activate(i)}
                  >
                    {inner}
                  </Link>
                ) : (
                  <Box className="py-6 pl-(--row-indent)">{inner}</Box>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Path-only handoff beat toward Journey (decision e) */}
        <Box
          aria-hidden
          style={{ height: CRAFT.finaleRunway }}
        />

        {/* Sticky preview — visual echo of the active row (decorative) */}
        <Box
          aria-hidden
          className={cn(
            "craft-preview pointer-events-none absolute inset-y-0 right-0 z-20 w-[36%]",
            staticMode ? "hidden" : "invisible hidden opacity-0 lg:block",
          )}
        >
          <Box className="sticky top-[32svh]">
            <Box className="font-mono text-meta text-muted flex items-baseline justify-between pb-2 uppercase tracking-wider">
              <Box as="span">{pad2(displayIndex + 1)}</Box>
              <Box as="span">Preview</Box>
            </Box>
            <Box className="bg-raised relative aspect-[4/3] overflow-hidden rounded-lg">
              {projects.map((project) => (
                <Box
                  key={project.slug}
                  className="craft-preview-layer invisible absolute inset-0 opacity-0"
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
  );
}
