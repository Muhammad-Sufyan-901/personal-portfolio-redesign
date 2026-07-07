import { cn } from "@/lib/utils";
import { Box } from "@/components/common/Box";

interface ChapterEyebrowProps {
  index: string;
  label: string;
  className?: string;
}

/** "01 — WHO I AM" structural marker (design_system §8B) — the primary
 *  chapter signature. Static, no animation. */
export function ChapterEyebrow({ index, label, className }: ChapterEyebrowProps) {
  return (
    <Box
      as="p"
      className={cn("font-mono text-eyebrow", className)}
    >
      <Box
        as="span"
        className="text-accent"
      >
        {index}
      </Box>
      <Box
        as="span"
        className="text-muted"
      >
        {" — "}
      </Box>
      <Box
        as="span"
        className="text-muted uppercase"
      >
        {label}
      </Box>
    </Box>
  );
}
