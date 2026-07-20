import { Box } from "@/components/common";
import { HeroSection } from "@/features/home/sections/HeroSection";
import { ManifestoSection } from "@/features/home/sections/ManifestoSection";
import { AboutSection } from "@/features/home/sections/AboutSection";
import { ProjectsSection } from "@/features/home/sections/ProjectsSection";

export function HomePage() {
  return (
    <Box as="main">
      <HeroSection />
      <ManifestoSection />
      <AboutSection />
      <ProjectsSection />
    </Box>
  );
}
