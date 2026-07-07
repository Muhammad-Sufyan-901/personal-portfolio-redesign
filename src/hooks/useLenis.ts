import { useContext } from "react";
import { LenisContext } from "@/providers/SmoothScrollProvider";

/** The shared Lenis instance — null under prefers-reduced-motion (native
 *  scroll) and before the provider mounts. Callers must handle null. */
export function useLenis() {
  return useContext(LenisContext);
}
