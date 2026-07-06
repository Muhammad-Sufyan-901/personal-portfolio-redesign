import { Box } from "@/components/common";
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
    </Box>
  );
}
