import { Box } from "@/components/common";
import { HeroSection } from "@/features/home/sections/HeroSection";

export default function HomePage() {
  return (
    <Box
      as="main"
      id="main"
    >
      <HeroSection />
    </Box>
  );
}
