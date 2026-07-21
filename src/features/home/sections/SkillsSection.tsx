import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Box, ChapterEyebrow, Image, Link, MagneticButton, RevealText } from "@/components/common";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { profile } from "@/features/home/data/profile.data";
import { skillGroups } from "@/features/home/data/skills.data";
import { skillIconUrl } from "@/features/home/utils/skill-icons";
import { SKILLS_SECTION } from "@/features/home/utils/skills.tunables";

const groupValues = skillGroups.map((g) => g.label);

/** Stroke → mark (owner reference image, 2026-07-21 — supersedes the solid
 *  triangular-head glyph): line shaft + open chevron head, rounded caps,
 *  ember. Decorative — parent is aria-hidden. */
function ArrowGlyph() {
  return (
    <Box
      className="text-accent"
      style={{ width: SKILLS_SECTION.arrow.width }}
    >
      <svg
        viewBox="0 0 100 60"
        className="h-auto w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        focusable="false"
      >
        <path d="M6 30h82" />
        <path d="M64 6l24 24-24 24" />
      </svg>
    </Box>
  );
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      // D3 entry — one-shot rise stagger (about-item pattern): groups as
      // units, items cascading through all groups. After this the accordion
      // is purely user-interactive (owner override: no scroll coupling).
      const { entryStagger, itemReveal } = SKILLS_SECTION.accordion;
      gsap
        .timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        })
        .from(".skills-group", {
          autoAlpha: 0,
          y: 24,
          duration: itemReveal.dur,
          stagger: entryStagger,
        })
        .from(".skills-item", { autoAlpha: 0, y: itemReveal.y, duration: itemReveal.dur, stagger: 0.02 }, "<0.15");

      // D2 arrow engine — damped x-scrub of section progress. The dissection
      // shows x fixed during entry and still drifting during exit, so
      // enter/exit are the sticky lane scrolling in/out: layout owns y, this
      // owns x only. Freeze-on-pause and exact reverse retrace are inherent
      // (ponytail: no state machine, no phase spans).
      const arrow = arrowRef.current;
      if (!arrow) return;
      const setX = gsap.quickSetter(arrow, "x", "px");
      const state = { target: 0, rendered: 0, converged: false };
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          state.target = self.progress;
        },
        // Resize while converged: force one fresh projection at the new width
        // (the tick's early-return would otherwise hold old-viewport px).
        onRefresh: (self) => {
          state.target = self.progress;
          state.converged = false;
        },
      });
      // Damp applier on the single gsap.ticker (gallery precedent — no second
      // RAF): chases the scrub target, lands one exact write on convergence,
      // then idles.
      const tick = (_time: number, deltaTime: number) => {
        const dt = Math.min(deltaTime / 1000, 1 / 30);
        const k = 1 - Math.exp(-SKILLS_SECTION.arrow.damp * dt);
        state.rendered += (state.target - state.rendered) * k;
        if (Math.abs(state.target - state.rendered) < 1e-4) {
          if (state.converged) return;
          state.rendered = state.target;
          state.converged = true;
        } else {
          state.converged = false;
        }
        setX((state.rendered * SKILLS_SECTION.arrow.travelVw * window.innerWidth) / 100);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="skills"
      ref={sectionRef}
      className="bg-ink px-page-x py-section relative"
    >
      <Box className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] lg:gap-20">
        {/* Left — sticky viewport panel (reference f050/f120: identical left
            column while the right scrolls): eyebrow, uppercase statement,
            hairline, CONTACT ME; the scrub-arrow lane sits below (~65svh). */}
        <Box className="relative lg:sticky lg:top-0 lg:h-svh lg:pt-[8svh]">
          <ChapterEyebrow
            index="07"
            label="Toolkit"
            className="mb-8"
          />
          <RevealText
            as="h2"
            mode="lines"
            className="text-statement text-paper max-w-[46ch] font-sans font-bold tracking-tight uppercase lg:[@media(max-height:768px)]:text-item"
          >
            {profile.skillsStatement}
          </RevealText>
          <Box className="border-line mt-8 border-t pt-6">
            <MagneticButton>
              <Link
                href="#contact"
                className="font-mono text-eyebrow text-paper tracking-[0.08em] uppercase"
              >
                Contact Me
                <Box
                  as="span"
                  aria-hidden
                >
                  {" ✦"}
                </Box>
              </Link>
            </MagneticButton>
          </Box>
          {/* Arrow lane — flow-positioned after the CTA: lands at ≈67svh on
              tall viewports (dissected centroid ≈0.65) and clamps below the
              CTA on short ones instead of overlapping. Omitted below lg: the
              lane needs the sticky viewport column. */}
          <Box
            ref={arrowRef}
            aria-hidden
            className="skills-arrow pointer-events-none mt-6 hidden lg:block"
          >
            <ArrowGlyph />
          </Box>
        </Box>

        {/* Right — the all-open grouped accordion (owner override: no scroll
            coupling; groups toggle by user interaction only). */}
        <Accordion
          type="multiple"
          defaultValue={[...groupValues]}
          className="flex flex-col"
        >
          {skillGroups.map((group) => (
            <AccordionItem
              key={group.label}
              value={group.label}
              className="skills-group border-none"
            >
              <AccordionTrigger
                className="text-statement text-paper font-sans font-normal"
                style={{ fontSize: SKILLS_SECTION.accordion.titleSize }}
              >
                {group.label}
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-12">
                <Box
                  as="ul"
                  className="flex flex-col gap-4"
                >
                  {group.items.map((item) => {
                    const iconUrl = skillIconUrl(item.name);
                    return (
                      <Box
                        as="li"
                        key={item.name}
                        className="skills-item text-body text-muted flex items-center gap-4"
                      >
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt=""
                            aria-hidden
                            width={SKILLS_SECTION.logos.sizePx}
                            height={SKILLS_SECTION.logos.sizePx}
                            objectFit="contain"
                            className="shrink-0 bg-transparent"
                          />
                        ) : (
                          /* icon-less fallback: empty slot keeps the name
                             column aligned */
                          <Box
                            as="span"
                            className="w-4 shrink-0"
                          />
                        )}
                        <Box as="span">{item.name}</Box>
                      </Box>
                    );
                  })}
                </Box>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Box>
  );
}
