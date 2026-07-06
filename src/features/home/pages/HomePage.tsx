import { Box } from "@/components/common";
import { CraftSection } from "@/features/home/sections/CraftSection";
import { HeroSection } from "@/features/home/sections/HeroSection";
import { ManifestoSection } from "@/features/home/sections/ManifestoSection";

export default function HomePage() {
  return (
    <Box
      as="main"
      id="main"
    >
      <HeroSection />
      <ManifestoSection />
      <CraftSection />
    </Box>
  );
}
