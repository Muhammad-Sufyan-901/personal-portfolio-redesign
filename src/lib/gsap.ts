import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// THE single GSAP source (system_architecture §2 RULE 2).
// Nothing else in the repo may import "gsap" or "gsap/ScrollTrigger" directly.
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power4.out", duration: 0.8 }); // maps --ease-out / --dur-base

export { gsap, ScrollTrigger };
