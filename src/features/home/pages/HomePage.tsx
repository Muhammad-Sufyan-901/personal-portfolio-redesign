import { Box } from "@/components/common";
import { HeroSection } from "@/features/home/sections/HeroSection";
import { ManifestoSection } from "@/features/home/sections/ManifestoSection";
import { AboutSection } from "@/features/home/sections/AboutSection";
import { ProjectsSection } from "@/features/home/sections/ProjectsSection";
import { GallerySection } from "@/features/home/sections/GallerySection";

export function HomePage() {
  return (
    <Box as="main">
      <HeroSection />
      <ManifestoSection />
      <AboutSection />
      <ProjectsSection />
      {/* 05 Journey + 06 Skills slot in between here later — the gallery
          self-registers (own pin + #gallery anchor), no coupling to 04. */}
      <GallerySection />
    </Box>
  );
}
