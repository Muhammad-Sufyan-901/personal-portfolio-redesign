import { Box } from "@/components/common";
import { HeroSection } from "@/features/home/sections/HeroSection";
import { ManifestoSection } from "@/features/home/sections/ManifestoSection";
import { AboutSection } from "@/features/home/sections/AboutSection";

export function HomePage() {
  return (
    <Box as="main">
      <HeroSection />
      <ManifestoSection />
      <AboutSection />
    </Box>
  );
}
