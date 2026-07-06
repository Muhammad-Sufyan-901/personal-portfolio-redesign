import { Box, ChapterEyebrow, Marquee, RevealText } from "@/components/common";
import { PillarBlock } from "@/features/home/components/PillarBlock";
import { mobilePillar, skills, tools, webPillar } from "@/features/home/data/skills.data";

/**
 * Chapter 03 — WHAT I DO (design_system §11.3). Two editorial pillars (Web /
 * Mobile), a full-bleed skill marquee separating them from a quiet tools row.
 * Motion is fully covered by RevealText/Marquee + PillarBlock's row reveal.
 */
export function CraftSection() {
  return (
    <Box
      as="section"
      id="craft"
      className="px-page-x py-section"
    >
      <ChapterEyebrow
        index="03"
        label="WHAT I DO"
      />

      <RevealText
        as="h2"
        mode="lines"
        className="mt-12 font-display text-chapter text-paper"
      >
        What I do
      </RevealText>

      <Box className="mt-16 grid gap-x-page-x gap-y-16 md:grid-cols-2">
        <PillarBlock
          index="01"
          title="Web"
          skills={webPillar}
        />
        <PillarBlock
          index="02"
          title="Mobile"
          skills={mobilePillar}
        />
      </Box>

      {/* Full-bleed band: -mx-page-x cancels the section's px-page-x token. */}
      <Marquee
        speed={60}
        className="-mx-page-x mt-24 border-y border-line py-5"
      >
        <Box
          as="span"
          className="font-mono text-index text-faint uppercase"
        >
          {skills.map((skill) => skill.name).join(" · ")}
          {" · "}
        </Box>
      </Marquee>

      <Box className="mt-24 flex flex-wrap items-baseline gap-x-8 gap-y-3">
        <Box
          as="span"
          className="font-mono text-eyebrow text-muted uppercase"
        >
          Tools
        </Box>
        <Box
          as="p"
          className="font-mono text-meta text-muted"
        >
          {tools.join(" · ")}
        </Box>
      </Box>
    </Box>
  );
}
