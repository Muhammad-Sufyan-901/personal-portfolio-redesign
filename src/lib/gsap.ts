import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// SINGLE GSAP SOURCE (system_architecture RULE 2) — nothing else may import
// "gsap" or "gsap/ScrollTrigger" directly.
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power4.out", duration: 0.8 });

export { gsap, ScrollTrigger };
