import { Box, Text } from "@/components/common";
import { cn } from "@/lib/utils";
import type { JourneyItem } from "@/types/portfolio";

interface JourneyEntryProps {
  item: JourneyItem;
}

/**
 * One timeline entry (design_system §11.4). Purely presentational — the
 * section's useGSAP targets `.journey-entry`. Node dot (10px, §5.3) sits
 * centered on the 1px rail via -translate-x-1/2; awards get the accent dot
 * (small + rare = still surgical), work/education stay faint.
 * Absent optional fields are omitted entirely (PRD rule: never fabricate).
 */
export function JourneyEntry({ item }: JourneyEntryProps) {
  return (
    <Box
      as="li"
      className="journey-entry relative pl-8"
    >
      <Box
        aria-hidden
        className={cn(
          "absolute top-1.5 left-0 size-2.5 -translate-x-1/2 rounded-full",
          item.kind === "award" ? "bg-accent" : "bg-faint",
        )}
      />

      <Text
        as="p"
        className="font-mono text-meta text-faint uppercase"
      >
        {item.kind}
      </Text>

      <Box
        as="h3"
        className="mt-2 font-sans font-semibold text-item text-paper"
      >
        {item.title}
      </Box>

      <Text className="mt-1 font-sans text-body text-muted">{item.org}</Text>

      <Text
        as="p"
        className="mt-2 font-mono text-meta text-muted"
      >
        {item.start}
        {item.end && ` – ${item.end}`}
        {item.employmentType && ` · ${item.employmentType}`}
      </Text>

      {item.summary && <Text className="mt-3 max-w-[60ch] font-sans text-body text-muted">{item.summary}</Text>}

      {item.stack && (
        <Text
          as="p"
          className="mt-3 font-mono text-meta text-faint"
        >
          {item.stack.join(" · ")}
        </Text>
      )}
    </Box>
  );
}
