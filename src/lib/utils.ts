import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register the custom fluid type tokens (globals.css @theme --text-*) as
// font-size utilities. Without this, twMerge classifies e.g. `text-body` as a
// text COLOR and silently drops it when combined with `text-muted`/`text-paper`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "chapter", "statement", "item", "body", "eyebrow", "index", "meta"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
