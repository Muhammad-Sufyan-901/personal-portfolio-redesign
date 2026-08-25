import { Fragment, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useGSAP } from "@gsap/react";
import { Box, ChapterEyebrow, Link, MagneticButton } from "@/components/common";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { emailEnabled, sendContactEmail, type ContactFormValues } from "@/lib/emailjs";
import { CONTACT_STATEMENTS, contactChannels, socialLinks } from "@/features/home/data/contact.data";

// Word-span statement grammar (Journey/Gallery/Articles precedent): RevealText
// can't wrap nested emphasis spans — split-type lines are atomic — so the
// focal phrase has to be React-owned markup, split at module scope.
const statements = CONTACT_STATEMENTS.map((statement) => {
  const focal = new Set(statement.focalWords.map((word) => word.toLowerCase()));
  return {
    words: statement.text.split(" "),
    isFocal: (word: string) => focal.has(word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase()),
  };
});

const emailChannel = contactChannels.find((channel) => channel.label === "Gmail");

/** Crop-mark corner positions for the panels — small "+" registration marks
 *  set just *inside* the artwork's corners (reference device, ~15px inset). */
const CROP_MARKS = ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"];

/** Distance from the viewport's bottom-centre to its farthest corner, over the
 *  disc's own base radius — the scale that makes the wipe exactly cover, +2% so
 *  no antialiased edge grazes a corner. Recomputed on every ScrollTrigger
 *  refresh (`invalidateOnRefresh`).
 *
 *  The base is measured off the element (`offsetWidth` is the layout box, so
 *  the live transform can't feed back into it) rather than re-derived from
 *  `innerWidth/innerHeight`: CSS `vmax` resolves against the *layout* viewport
 *  while `innerHeight` tracks the *visual* one, and the two diverge on mobile
 *  (URL-bar chrome). Deriving it left the disc 95px short of the corners at
 *  390×844 — verified, not theoretical. */
const coverScale = (disc: HTMLElement) => {
  const base = disc.offsetWidth / 2;
  return base ? (Math.hypot(window.innerWidth / 2, window.innerHeight) / base) * 1.02 : 1;
};

/** How far into the section's approach the wipe finishes, as a viewport
 *  fraction. Measured off `reference/video/sections/contact-refine.mp4`: the
 *  disc's radius grows 2.63px per 1px of scroll (r 178→780 across 229px of
 *  scroll), and cover at 1920×1080 is hypot(960,1080)=1445px — so the wipe
 *  completes in ~549px ≈ 0.51 viewport, NOT the full viewport it ran over
 *  before. Expressed as the ScrollTrigger `end` position. */
const WIPE_END = "top 50%";

/** Chapter 10 Contact — the single light-invert beat.
 *
 *  Structure is a dark shell wrapping a light sheet. The shell's top margin is
 *  the dark runway the reference scrolls through before the wipe starts; the
 *  sheet is the light surface itself.
 *
 *  THE LAYER MODEL (matched frame-for-frame to `contact-refine.mp4`, t≈4.1–6.4s
 *  — this is the part that is easy to get subtly wrong):
 *
 *    phase                        | disc            | sheet bg    | sheet content
 *    -----------------------------|-----------------|-------------|---------------
 *    wipe    (top bottom → 50%)   | growing         | TRANSPARENT | autoAlpha 0
 *    beat    (50% → top top)      | held at cover   | TRANSPARENT | timeline plays
 *    settled (past top top)       | hidden          | opaque      | visible
 *
 *  The sheet sits ABOVE the disc (z-50 vs z-40) but paints no background until
 *  the handoff, so during the wipe the only light thing on screen is the circle
 *  — reference frame b_0045 has the disc spanning just x≈625–1300 at the
 *  viewport's bottom edge with BOTH bottom corners still dark. Letting the
 *  sheet paint its own `bg-invert-bg` during the wipe (the previous build) reads
 *  as a rising light *rectangle* with a bulge on top, not a circle.
 *
 *  Because the sheet is above the disc, the heading can slide in over a
 *  full-cover disc while the sheet itself is still transparent — which is how
 *  the content beat starts at full cover yet finishes before the sheet has
 *  finished travelling to the top of the viewport.
 *
 *  Exit is static: the sheet's rounded bottom curves away against the ink
 *  body, and the future Footer slides beneath in normal flow. */
export function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const circle = circleRef.current;
      const sheet = sheetRef.current;

      // Hand the light over to the disc for the whole approach. Set here rather
      // than in the class list so the reduced-motion and no-JS paths keep the
      // sheet opaque; useGSAP's revert restores it on cleanup.
      if (sheet) gsap.set(sheet, { backgroundColor: "transparent" });

      if (circle) {
        gsap.fromTo(
          circle,
          { scale: 0 },
          {
            scale: () => coverScale(circle),
            ease: "none",
            scrollTrigger: {
              trigger: sheet,
              start: "top bottom",
              end: WIPE_END,
              scrub: true,
              invalidateOnRefresh: true,
              // A 50vmax fixed layer is expensive to keep promoted; only pay
              // for it while the wipe is on screen (Articles rail precedent).
              onToggle: (self) => {
                circle.style.willChange = self.isActive ? "transform" : "";
              },
            },
          },
        );
      }

      // The beat — fires the frame the disc reaches full cover, so content can
      // never appear over a partly-wiped screen. Order and pacing are the
      // reference's: "Contact" enters from beyond the right viewport edge and
      // decelerates across ~1.2s (measured: left edge 1655→995→840→390→200 over
      // t 5.15–6.03s), and everything else trails it.
      gsap
        .timeline({ scrollTrigger: { trigger: sheet, start: WIPE_END, once: true } })
        .from(".contact-heading", { x: () => window.innerWidth, autoAlpha: 0, duration: 1.2 })
        .from(".contact-lede", { autoAlpha: 0, duration: 0.4 }, "-=0.75")
        .from(".contact-pair-lead .contact-word", { autoAlpha: 0, y: 14, stagger: 0.03 }, "-=0.55")
        .from(".contact-pair-lead .contact-panel", { autoAlpha: 0, y: 32 }, "<");

      // The handoff, one full viewport-half after the wipe finishes: the sheet
      // now fills the viewport, so it takes its own background back and the disc
      // retires. Both are --color-invert-bg, so the swap is invisible.
      //
      // A real ScrollTrigger, not the scrub's onLeave: this has to resolve
      // correctly when the page loads ALREADY scrolled into the section, and
      // ScrollTrigger evaluates onEnter against the current position on refresh.
      if (circle && sheet) {
        ScrollTrigger.create({
          trigger: sheet,
          start: "top top",
          onEnter: () => {
            gsap.set(sheet, { backgroundColor: "" });
            gsap.set(circle, { autoAlpha: 0 });
          },
          onLeaveBack: () => {
            gsap.set(sheet, { backgroundColor: "transparent" });
            gsap.set(circle, { autoAlpha: 1 });
          },
        });
      }

      // Everything below the fold keeps the house pattern (top 85%, once).
      gsap.from(".contact-pair-echo .contact-word", {
        autoAlpha: 0,
        y: 14,
        stagger: 0.03,
        scrollTrigger: { trigger: ".contact-pair-echo", start: "top 85%", once: true },
      });
      gsap.from(".contact-pair-echo .contact-panel", {
        autoAlpha: 0,
        y: 32,
        scrollTrigger: { trigger: ".contact-pair-echo", start: "top 85%", once: true },
      });
      gsap.from(".contact-social", {
        autoAlpha: 0,
        y: 24,
        stagger: 0.08,
        scrollTrigger: { trigger: ".contact-social", start: "top 85%", once: true },
      });
      gsap.from(".contact-form-band", {
        autoAlpha: 0,
        y: 24,
        scrollTrigger: { trigger: ".contact-form-band", start: "top 85%", once: true },
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    // mt-[70svh]: the reference scrolls ~0.75 viewport of dark before the wipe
    // begins. Margin rather than a spacer element — <main> is transparent over
    // the ink page background, and it can't collapse through the Articles
    // pin-spacer (ScrollTrigger gives that padding-bottom, not margin).
    <Box
      as="section"
      ref={sectionRef}
      className="relative mt-[70svh]"
    >
      {/* The wipe disc — decorative only, never rendered under reduced motion
          (the sheet just arrives flat). pointer-events-none is load-bearing:
          at cover scale it lies over the clickable Articles rail. z-40 keeps
          it above that rail's stacking context but under the z-60 chrome. */}
      {!prefersReducedMotion && (
        <Box
          ref={circleRef}
          aria-hidden
          className="bg-invert-bg pointer-events-none fixed top-full left-1/2 z-40 h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      )}

      {/* The light sheet. `id` lives here, not on the section root — the nav
          anchor would otherwise drop the visitor into the dark runway.
          `relative z-50` puts it ABOVE the z-40 disc so the heading can slide in
          over a full-cover disc (see the layer table above); its background is
          held transparent by the timeline until the handoff.
          `overflow-x-clip`: the heading slides in from a full viewport-width to
          the right, which is real horizontal page scroll otherwise. */}
      <Box
        id="contact"
        data-invert
        ref={sheetRef}
        className="bg-invert-bg text-invert-text px-page-x py-section relative z-50 overflow-x-clip rounded-b-[50%_5rem]"
      >
        <Box className="contact-lede">
          <ChapterEyebrow
            index="12"
            label="Let's Talk"
          />
        </Box>

        <Box
          as="h2"
          className="contact-heading font-display-lead text-display text-ink mt-6 font-extrabold"
        >
          Contact
        </Box>

        {/* Two statement/panel beats. The second mirrors the first — panel
            first, then text — which is the whole point of the pair; below lg
            both collapse to a vertical stack in DOM order so reading and focus
            order stay sane. */}
        <Box className="mt-16 flex flex-col gap-24 lg:mt-24 lg:gap-32">
          {statements.map((statement, index) => {
            const textFirst = index % 2 === 0;
            return (
              <Box
                key={index}
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                  textFirst ? "contact-pair-lead" : "contact-pair-echo",
                )}
              >
                <Box
                  as="p"
                  className={cn(
                    "font-display-lead text-statement text-ink ml-auto max-w-[30ch] text-right",
                    textFirst ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  {statement.words.map((word, i) => (
                    <Fragment key={i}>
                      <Box
                        as="span"
                        className={cn(
                          "contact-word inline-block",
                          statement.isFocal(word) && "font-display-tail italic",
                        )}
                      >
                        {word}
                      </Box>
                      {i < statement.words.length - 1 ? " " : ""}
                    </Fragment>
                  ))}
                </Box>
                {/* max-w-sm holds the reference's panel-to-statement ratio —
                    uncapped in a half-width column the panel renders ~820px
                    tall and shoves the statement off-screen. ml/mr-auto pushes
                    each panel to its own outer edge, mirroring the pair. */}
                <GradientPanel
                  className={cn("max-w-sm", textFirst ? "lg:order-2 lg:ml-auto" : "lg:order-1 lg:mr-auto")}
                />
              </Box>
            );
          })}
        </Box>

        {/* Lower-left stack: large social links + email line (reference:
            GitHub/LinkedIn/Behance block sitting low against the sheet). */}
        <Box className="mt-24 flex flex-col items-start gap-10 lg:mt-32">
          <Box
            as="ul"
            className="flex flex-col items-start gap-1"
          >
            {socialLinks.map((social) => (
              <Box
                as="li"
                key={social.label}
                className="contact-social"
              >
                <MagneticButton>
                  <Link
                    href={social.href}
                    className="magnetic-label font-display-lead text-statement text-ink hover:text-accent-deep inline-block font-semibold transition-colors"
                  >
                    {social.label}
                  </Link>
                </MagneticButton>
              </Box>
            ))}
          </Box>
          {emailChannel && (
            <Box className="contact-social">
              <Link
                href={emailChannel.href}
                className="text-item text-ink hover:text-accent-deep underline underline-offset-8 transition-colors"
              >
                {emailChannel.value}
              </Link>
            </Box>
          )}
        </Box>

        {/* Form band. The channels list stays the first-class path — it works
            with or without EmailJS keys; the form sits beside it either way,
            inert until the keys land (see ContactForm). */}
        <Box className="contact-form-band border-ink/15 mt-24 grid gap-12 border-t pt-12 lg:mt-32 lg:grid-cols-2">
          <Box
            as="ul"
            className="flex flex-col items-start gap-6"
          >
            {contactChannels.map((channel) => (
              <Box
                as="li"
                key={channel.label}
              >
                <Box
                  as="span"
                  className="font-mono text-meta text-muted block uppercase"
                >
                  {channel.label}
                </Box>
                <Link
                  href={channel.href}
                  className="text-item text-ink hover:text-accent-deep transition-colors"
                >
                  {channel.value}
                </Link>
              </Box>
            ))}
          </Box>
          <ContactForm />
        </Box>
      </Box>
    </Box>
  );
}

/** Placeholder for the chapter's two artwork panels — an ember gradient in the
 *  reference's portrait crop, with registration marks inside the corners.
 *  Owner-requested stand-in (2026-08-04) until the real images land; swap the
 *  gradient for an `Image`/`ParallaxImage` and everything else still holds.
 *
 *  `bg-accent`/`accent-deep` are deliberately NOT remapped by `[data-invert]`
 *  — the wash is non-text, so it keeps full ember on the light sheet. */
function GradientPanel({ className }: { className?: string }) {
  return (
    <Box
      aria-hidden
      className={cn("contact-panel from-accent to-accent-deep relative aspect-[3/4] w-full bg-linear-to-br", className)}
    >
      {CROP_MARKS.map((position) => (
        <Box
          key={position}
          as="span"
          className={cn("font-mono text-meta text-paper-bright/80 absolute select-none", position)}
        >
          +
        </Box>
      ))}
    </Box>
  );
}

type FormStatus = "idle" | "sending" | "sent" | "error";

function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>();
  const [status, setStatus] = useState<FormStatus>("idle");

  const onSubmit = handleSubmit(async (values) => {
    setStatus("sending");
    try {
      await sendContactEmail(values);
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  });

  return (
    <Box
      as="form"
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-8"
    >
      <Box className="flex flex-col gap-2">
        <Box
          as="label"
          htmlFor="contact-name"
          className="font-mono text-meta text-muted uppercase"
        >
          Name
        </Box>
        <Box
          as="input"
          id="contact-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className="border-ink/50 text-body text-ink focus-visible:border-accent h-12 w-full border-b bg-transparent"
          {...register("name", { required: "Please tell me your name." })}
        />
        {errors.name && (
          <Box
            as="p"
            id="contact-name-error"
            className="font-mono text-meta text-error"
          >
            {errors.name.message}
          </Box>
        )}
      </Box>

      <Box className="flex flex-col gap-2">
        <Box
          as="label"
          htmlFor="contact-email"
          className="font-mono text-meta text-muted uppercase"
        >
          Email
        </Box>
        <Box
          as="input"
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className="border-ink/50 text-body text-ink focus-visible:border-accent h-12 w-full border-b bg-transparent"
          {...register("email", {
            required: "Please enter your email address.",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Please enter a valid email address." },
          })}
        />
        {errors.email && (
          <Box
            as="p"
            id="contact-email-error"
            className="font-mono text-meta text-error"
          >
            {errors.email.message}
          </Box>
        )}
      </Box>

      <Box className="flex flex-col gap-2">
        <Box
          as="label"
          htmlFor="contact-message"
          className="font-mono text-meta text-muted uppercase"
        >
          Message
        </Box>
        <Box
          as="textarea"
          id="contact-message"
          rows={4}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className="border-ink/50 text-body text-ink focus-visible:border-accent w-full resize-none border-b bg-transparent pt-2"
          {...register("message", {
            required: "Please write a message.",
            minLength: { value: 10, message: "A few more words, please." },
          })}
        />
        {errors.message && (
          <Box
            as="p"
            id="contact-message-error"
            className="font-mono text-meta text-error"
          >
            {errors.message.message}
          </Box>
        )}
      </Box>

      <Box className="flex flex-wrap items-center gap-6">
        <MagneticButton>
          <Box
            as="button"
            type="submit"
            disabled={!emailEnabled || status === "sending"}
            aria-describedby={emailEnabled ? undefined : "contact-form-offline"}
            className="border-ink/50 font-mono text-meta hover:bg-ink hover:text-paper-bright rounded-full border px-6 py-3 uppercase transition-colors disabled:opacity-50"
          >
            <Box
              as="span"
              className="magnetic-label inline-block"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </Box>
          </Box>
        </MagneticButton>
        {emailEnabled ? (
          <Box
            as="p"
            role="status"
            aria-live="polite"
            className={cn(
              "font-mono text-meta",
              status === "sent" && "text-success",
              status === "error" && "text-error",
            )}
          >
            {status === "sent" && "Message sent — thank you. I'll get back to you soon."}
            {status === "error" && "Something went wrong — please reach me through a channel instead."}
          </Box>
        ) : (
          // No VITE_EMAILJS_* keys: `emailEnabled` is a build-time constant, so
          // this branch is dead code the moment they land — no runtime cost and
          // nothing to remove later.
          <Box
            as="p"
            id="contact-form-offline"
            className="font-mono text-meta text-muted"
          >
            This form isn't live yet — reach me on a channel instead.
          </Box>
        )}
      </Box>
    </Box>
  );
}
