import { cn } from "@/lib/utils";
import { Box } from "./Box";

interface ChapterEyebrowProps {
  /** e.g. "01" */
  index: string;
  label: string;
  className?: string;
}

/** "01 — WHO I AM" structural marker (design_system §8B). Not animated. */
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
