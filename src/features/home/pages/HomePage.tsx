import { Fragment } from "react";
import { Box } from "@/components/common";
import { HeroSection } from "@/features/home/sections/HeroSection";
import { ManifestoSection } from "@/features/home/sections/ManifestoSection";
import { AboutSection } from "@/features/home/sections/AboutSection";
import { ProjectsSection } from "@/features/home/sections/ProjectsSection";
import { JourneySection } from "@/features/home/sections/JourneySection";
import { AchievementsSection } from "@/features/home/sections/AchievementsSection";
import { WorkflowSection } from "@/features/home/sections/WorkflowSection";
import { SkillsSection } from "@/features/home/sections/SkillsSection";
import { GallerySection } from "@/features/home/sections/GallerySection";
import { ArticlesSection } from "@/features/home/sections/ArticlesSection";
import { ContactSection } from "@/features/home/sections/ContactSection";
import { FooterSection } from "@/features/home/sections/FooterSection";

export function HomePage() {
  return (
    // The footer is a SIBLING of main, not a child: a <footer> nested inside
    // <main> is not exposed as a contentinfo landmark.
    <Fragment>
      <Box as="main">
        <HeroSection />
        <ManifestoSection />
        <AboutSection />
        <ProjectsSection />
        <GallerySection />
        <SkillsSection />
        <JourneySection />
        <AchievementsSection />
        <WorkflowSection />
        <ArticlesSection />
        <ContactSection />
      </Box>
      <FooterSection />
    </Fragment>
  );
}
