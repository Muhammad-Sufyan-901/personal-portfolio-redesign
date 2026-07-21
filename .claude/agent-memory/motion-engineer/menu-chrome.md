---
name: menu-chrome
description: MenuButton/MenuPopout/SiteMenu motion mechanics — popout ScrollTrigger, end:"max" gotcha, curtain reveal, rendered-during-render pattern
metadata:
  type: reference
---

**Header removed 2026-07-08** (see `logs/feature-changes/2026-07-08-navbar-removal-hero-menu-popout.md`): the old `Header.tsx` scroll-state pattern no longer exists; replaced by the chrome below.

**MenuButton / MenuPopout** (`src/components/shared/`): `MenuButton` = prop-less glass pill (`MagneticButton` + shadcn `Button`, `setMenuOpen(true)`), placed by its caller — inline in `HeroSection`'s top row AND inside `MenuPopout` (`fixed top-6 right-page-x z-[60]`, pops in past 0.45·innerHeight via `ScrollTrigger.create({ start: () => window.innerHeight * POPOUT_START, end: POPOUT_END, onToggle })`, `back.out(2)` in / `power2.in` out on `autoAlpha`+`scale`+`y`). **Gotcha: never `end: "max"` on a no-`trigger` ScrollTrigger that must stay active through page end — GSAP flips `isActive` false exactly at `progress === 1`** (verified at the literal document bottom), so a persistent trigger vanishes at the footer; use a large fixed `end` (e.g. `100_000`) instead.

**SiteMenu reveal** (`src/components/shared/SiteMenu.tsx`, renamed from MobileMenu 2026-07-08, all viewports): stays mounted through exit via `rendered` state adjusted **during render** (`react-hooks/set-state-in-effect` bans the effect version). Open: curtain `fromTo(el, yPercent -100→0, power4.inOut 0.8s)` then `.from(".menu-link", { yPercent: 100, stagger: 0.06 }, "-=0.25")`; close: links `to yPercent 100` then curtain back up, `onComplete: setRendered(false)` unmounts; `li` wrappers `overflow-hidden`. Reduced motion: instant mount/unmount, no tweens.

MenuPopout z-[60] < SiteMenu z-[80] (z-scale: content ≤50 < 60 < 80 < preloader 90 < cursor 100).
