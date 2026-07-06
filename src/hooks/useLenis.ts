import { useContext } from "react";
import type Lenis from "lenis";
import { LenisContext } from "@/providers/SmoothScrollProvider";

/** Shared Lenis instance — null under prefers-reduced-motion (native scroll). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
