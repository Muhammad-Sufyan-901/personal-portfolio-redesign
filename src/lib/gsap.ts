import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// SINGLE GSAP SOURCE (system_architecture RULE 2) — nothing else may import
// "gsap" or "gsap/ScrollTrigger" directly.
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power4.out", duration: 0.8 });

// Mobile URL-bar collapse fires height-only resizes that would re-measure the
// hero seam mid-scroll (svh-sized hero vs innerHeight-based triggers) — GSAP
// suppresses refreshes for touch resizes under 25% viewport with this flag.
ScrollTrigger.config({ ignoreMobileResize: true });

// The seam window is measured from the hero name's rendered metrics — refresh
// once the display fonts land so first-load measurements aren't off.
if (typeof document !== "undefined" && "fonts" in document) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };
