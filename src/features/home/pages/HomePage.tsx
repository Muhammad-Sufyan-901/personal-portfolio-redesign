import { Box } from "@/components/common";
import { HeroSection } from "@/features/home/sections/HeroSection";

export function HomePage() {
  return (
    <Box as="main">
      <HeroSection />
      {/* ponytail: temporary scroll runway so the header scroll-state and
          aurora fade are exercisable; replaced by chapter 02 Manifesto */}
      <Box
        aria-hidden
        className="h-[150vh]"
      />
    </Box>
  );
}
