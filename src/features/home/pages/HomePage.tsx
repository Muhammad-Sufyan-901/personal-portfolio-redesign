import { Box } from "@/components/common";
import { HeroSection } from "@/features/home/sections/HeroSection";
import { ManifestoSection } from "@/features/home/sections/ManifestoSection";
import { AboutSection } from "@/features/home/sections/AboutSection";
import { CraftSection } from "@/features/home/sections/CraftSection";

export function HomePage() {
  return (
    <Box as="main">
      <HeroSection />
      <ManifestoSection />
      <AboutSection />
      <CraftSection />
    </Box>
  );
}
