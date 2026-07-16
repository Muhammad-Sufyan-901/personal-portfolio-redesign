import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Plain twMerge classifies our fluid --text-* tokens as *colors* and silently
// drops them next to classes like `text-muted`. Register them as font-size
// class groups. Any new --text-* token in globals.css MUST be added here.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display",
        "text-hero",
        "text-hero-line",
        "text-chapter",
        "text-statement",
        "text-item",
        "text-body",
        "text-eyebrow",
        "text-index",
        "text-meta",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
