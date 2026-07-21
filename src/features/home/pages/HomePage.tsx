import { Box } from "@/components/common";
import { HeroSection } from "@/features/home/sections/HeroSection";
import { ManifestoSection } from "@/features/home/sections/ManifestoSection";
import { AboutSection } from "@/features/home/sections/AboutSection";
import { ProjectsSection } from "@/features/home/sections/ProjectsSection";
import { SkillsSection } from "@/features/home/sections/SkillsSection";
import { GallerySection } from "@/features/home/sections/GallerySection";

export function HomePage() {
  return (
    <Box as="main">
      <HeroSection />
      <ManifestoSection />
      <AboutSection />
      <ProjectsSection />
      <GallerySection />
      <SkillsSection />
    </Box>
  );
}
