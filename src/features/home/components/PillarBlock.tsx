import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Box, RevealText, Text } from "@/components/common";
import { skills as skillList } from "@/features/home/data/skills.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

interface PillarBlockProps {
  /** e.g. "01" */
  index: string;
  title: string;
  skills: string[];
  description?: string;
}

/** Pillar names that differ from their canonical PRD skillList entry. */
const SKILL_ALIASES: Record<string, string> = {
  React: "React JS",
  Tailwind: "Tailwind CSS",
};

/** Level from PRD §3.1 where the name (or its alias) exists — never invented. */
const levelOf = (name: string) => skillList.find((s) => s.name === (SKILL_ALIASES[name] ?? name))?.level;

/**
 * One editorial Craft pillar (design_system §11.3): mono index, item title,
 * hairline-separated stack rows. Rows reveal line-by-line on enter — the
 * RevealText recipe (yPercent clip reveal), wired directly because split-type
 * does not support nested elements and each row is name + level in a flex.
 */
export function PillarBlock({ index, title, skills, description }: PillarBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion) return; // static final state

      gsap.from(".pillar-row", {
        yPercent: 100,
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box ref={ref}>
      <Box className="flex items-baseline gap-4">
        <Box
          as="span"
          className="font-mono text-index text-faint"
        >
          {index}
        </Box>
        <RevealText
          as="h3"
          mode="lines"
          className="font-sans font-semibold text-item text-paper"
        >
          {title}
        </RevealText>
      </Box>

      {description && <Text className="mt-4 max-w-[40ch] font-sans text-body text-muted">{description}</Text>}

      <Box
        as="ul"
        className="mt-8"
      >
        {skills.map((name) => {
          const level = levelOf(name);
          return (
            <Box
              as="li"
              key={name}
              className="overflow-hidden border-t border-line last:border-b"
            >
              <Box className="pillar-row flex items-baseline justify-between gap-4 py-4">
                <Box
                  as="span"
                  className="font-sans text-body text-muted"
                >
                  {name}
                </Box>
                {level && (
                  <Box
                    as="span"
                    className="font-mono text-meta text-faint"
                  >
                    {level}
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
