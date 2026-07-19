# Hero tagline line break after "that"

- **Date:** 2026-07-20
- **Author:** main
- **Type:** style
- **Chapter/Area:** 01 Hero

## Summary
Owner asked for the tagline's emphasized phrase to start on its own line. Added a `<br />` between the pre-emphasis text ("Building digital applications that ") and the italic emphasis span, so "help many people." now renders on the second line instead of wrapping wherever `max-w-[34ch]` happened to break.

## Files touched
- `src/features/home/sections/HeroSection.tsx` — `<br />` inserted between `{taglinePre}` and the emphasis span.

## Notable decisions
- Kept the break in JSX rather than the data layer — `profile.tagline` stays a plain sentence; the break is presentation, tied to where the emphasis split already happens.
- Did not make the emphasis span `block` — that would push the trailing "." (taglinePost) onto a third line.

## Verification
- [x] `npx tsc --noEmit` clean
- [ ] `npm run lint` clean (not run — one-tag JSX change)
- [x] reduced-motion / a11y unaffected (static text, `br` is inert)
- [ ] Lighthouse ≥ 90 (n/a — no section shipped)

## Follow-ups
- None.
