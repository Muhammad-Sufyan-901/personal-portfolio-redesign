import { Box } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";

/** Foundation placeholder — smoke-tests tokens, fonts, and the data layer.
 *  Chapter sections replace this body one at a time (00 → Footer). */
export function HomePage() {
  return (
    <Box
      as="main"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-page-x text-center"
    >
      <Box
        as="h1"
        className="font-display text-chapter text-paper"
      >
        {profile.name}
      </Box>
      <Box
        as="p"
        className="font-mono text-eyebrow text-muted uppercase"
      >
        {profile.role}
      </Box>
      <Box
        as="p"
        className="font-mono text-meta text-faint"
      >
        Rebuilding — chapter 00 up next
      </Box>
    </Box>
  );
}
