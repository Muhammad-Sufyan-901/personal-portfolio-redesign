# Product Requirements: Muhammad Sufyan Portfolio (Redesign)

**Target Audience:** Project Manager, Frontend Developer, Frontend AI Agents
**Product Type:** Personal portfolio (static SPA), single narrative page
**Redesign Direction:** "clean & modern / blue" → **"elegant & animated"** scroll-telling
**Motion Reference:** `lukebaffait.fr` (feel & class, not color/content)

> This file is the **single source of content truth**. All facts below are transcribed from the previous portfolio so the redesign needs **no access to the old repository**. The AI agent must build the new site using only this document (content) + `design_system.md` (look/motion) + `system_architecture.md` (structure). Facts may not be invented or altered; microcopy may be rewritten to read more narratively.

## 1. Goal & Success Criteria

Rebuild the portfolio of Muhammad Sufyan as an **elegant, motion-first, scroll-telling** experience that answers "who is this person?" while preserving every real fact about his work and background.

Success = (1) the new theme matches `design_system.md`; (2) a 7-chapter scroll narrative works smoothly on GSAP + Lenis; (3) all content below is present; (4) `prefers-reduced-motion` + accessibility pass; (5) Lighthouse ≥ 90 (Perf/A11y/Best/SEO); (6) TypeScript strict, no errors.

## 2. Persona (the subject)

**Muhammad Sufyan** — software engineer based in **Indonesia**, working across **web** and **mobile**. Roles he identifies with: Frontend Developer, Backend Developer, Mobile Developer, Software Tester. Voice: precise, humble, growth-minded ("always learning something new"), works well solo or in a team. The redesign should feel like _him_: engineer-precise (mono details) yet creative (editorial serif).

**Headline stats (from profile):** 3 Years of Experience · 7 Frameworks & Tech Stacks Used · 10 Successful Projects.

**Short bio (source copy — may be re-voiced, facts fixed):**
"Hello everyone! I am Muhammad Sufyan, a frontend, mobile and website developer. I have intermediate experience and I hope to always keep learning something new, to build digital applications that can help many people in the future. I can work independently or in a team."

**CV:** downloadable PDF (`/assets/pdf/Muhammad Sufyan CV.pdf` in the old site — re-host in `public/`).

## 3. Content Inventory (verbatim data to transcribe into typed constants)

### 3.1 Skills — Tech (`skillList`)

| Skill | Level | Skill | Level |
| ----- | ----- | ----- | ----- |
| HTML | Advanced | MySQL | Intermediate |
| CSS | Advanced | CodeIgniter | Basic |
| JavaScript | Advanced | Node JS | Basic |
| React JS | Intermediate | Laravel | Intermediate |
| Next JS | Intermediate | Vite | Basic |
| Tailwind CSS | Intermediate | Material UI | Basic |
| TypeScript | Intermediate | Flutter | Intermediate |
| React Native | Intermediate | Dart | Intermediate |
| Angular | Basic | Firebase | Basic |
| Bootstrap | Intermediate | Vue.js | Basic |
| PHP | Intermediate | | |

> Current stack he favors (from his own preference, use to shape the **Craft** chapter emphasis): **Web** — React, TypeScript, Tailwind, shadcn/ui, Laravel, Livewire. **Mobile** — Flutter, React Native.

### 3.2 Tools (`toolList`)
Visual Studio Code · GitHub · Figma · XAMPP · Android Studio · Git.

### 3.3 Work Experience (`workExperienceList`, most recent first)

1. **Mobile Developer** — Global Digital Verse · Feb 2024 – Aug 2025 · Full Time
   Built full mobile apps (Tampang.com, Digital Salesman, etc.); owned UI and API integration.
   Stack: Flutter, Dart, Firebase, React Native, TypeScript.
2. **Full Stack Web Developer** — Global Digital Verse · May 2023 – Aug 2025 · Full Time
   Built features across FindDW, Optimus, Litani, and full company-profile sites.
   Stack: Laravel, Bootstrap, MySQL, PHP.
3. **Frontend Developer** — ZettaByte Pte Ltd · Jan 2022 – Apr 2022 · Internship
   Built features (search filters, form validation) on ADMTC and EDH platforms.
   Stack: Angular, TypeScript, GraphQL.
4. **Quality Assurance** — ZettaByte Pte Ltd · Jan 2022 – Apr 2022 · Internship
   Debugged and tested features on ADMTC and EDH platforms.
   Stack: Jira, Docs.

### 3.4 Education (`educationList`)

1. **Institute of Technology and Business STIKOM Bali** — Information Systems — 2023 – Present
2. **TI Bali Global Vocational High School** — Software Engineer — 2020 – 2023

### 3.5 Awards (`awardList`)

1. **5th Winner, Web Design Competition** — UNBI University — Sep 2023
2. **Completed ZettaCamp Frontend Bootcamp** — ZettaByte Pte Ltd — Apr 2022
3. **Completed ZettaCamp Angular Bootcamp** — ZettaByte Pte Ltd — Jan 2022

### 3.6 Selected Projects (`portfolioList` — curate 4–6 as featured)

| Project | Stack | Live | Repo |
| ------- | ----- | ---- | ---- |
| **KNA Landing Page** — construction company landing (services, portfolio, testimonial, consultation) | HTML, CSS, Tailwind, JS | — | — |
| **KHASS E-Ticketing** — theater ticket marketplace (team project) | Next JS, Tailwind, Express JS | khass.my.id | — |
| **My Personal Portfolio** — the previous portfolio (7 sections) | Next JS, Tailwind, Framer Motion | (old) | github.com/Muhammad-Sufyan-901/personal-portfolio |
| **Phantom Landing Page** — phone-brand product site | HTML, CSS, JS | lomba-web-design.vercel.app | github.com/Muhammad-Sufyan-901/lomba-web-design |
| **Petabyte Landing Page** — software house (education) landing | HTML, CSS, Bootstrap, JS | petabyte-landing-page.vercel.app | github.com/Muhammad-Sufyan-901/petabyte-landing-page |
| **HooBank Landing Page** — modern banking landing | React JS, Tailwind, Vite | — | — |

> Re-export project thumbnails to `.avif`/`.webp` and place in `src/assets/images/`. Keep live/repo links exactly. Featured selection is a planning-approval decision.

### 3.7 Contact (`contactCardList`)

- **WhatsApp** — +62 8991622164 — `https://wa.me/628991622164`
- **Gmail** — muhammadsufyann09@gmail.com — mailto/compose link
- **Telegram** — +62 8991622164 — `https://t.me/+628991622164`

> Contact form on the old site used **EmailJS**; reuse the same approach (client SDK) with keys in `.env` (`VITE_EMAILJS_*`).

### 3.8 Navigation (old anchors)
Home · About · Skills · Educations · Experiences · Portfolio · Blog · Contact.
Blog is optional in the redesign; the rest map onto the new chapters (§4).

## 4. Redesign — Chapter Narrative (maps old sections → scroll-telling)

The homepage is one vertical story of numbered chapters (see `design_system.md §11` for motion detail):

- **00 · Preloader** — counter + name reveal + curtain wipe.
- **01 · Hero (Intro)** — name + one-line tagline + role ("Software Engineer · Web & Mobile") + scroll cue. Maps from old **Home**.
- **02 · Manifesto (Who I am)** — the bio (§2), scroll-filled word by word. Maps from old **About**.
- **03 · Craft (What I do)** — two pillars **Web** & **Mobile** (§3.1) as editorial blocks + skills marquee. Maps from old **Skills**.
- **04 · Journey (The Path)** — **Experience (§3.3) + Education (§3.4) + Awards (§3.5)** merged into one scrubbed timeline, most recent first. Maps from old **Experiences + Educations**.
- **05 · Selected Work** — featured **Projects (§3.6)** with clip-path reveals + parallax + hover. Maps from old **Portfolio**.
- **06 · Contact (Let's talk)** — big line + magnetic CTA + EmailJS form + socials (§3.7). Maps from old **Contact**.
- **Footer** — giant name marquee + copyright.

## 5. Non-Goals / Constraints

- No backend, no auth, no CMS — content is static (this file → typed constants).
- Do not invent projects, employers, dates, or metrics. If a field is unknown, omit it rather than fabricate.
- Keep the theme quiet and elegant; the accent is surgical (see `design_system.md`).
- Blog is out of scope unless explicitly requested at planning approval.
- Preserve SEO/discoverability (meta, OG, semantic headings) — this is a public portfolio.

## 6. Open Decisions (resolve at planning approval)

1. Accent: **Brass `#C8A46A`** (default) vs **Cobalt `#3B5BFF`**.
   > **Resolved (2026-07-07): Ember `#E8380F`** per `design_system.md` v2 §3.2 (evidence-sampled from the reference). Brass and cobalt are demoted to documented alternates there. Note: the interim build (chapters 00–04) shipped with cobalt tokens in `src/styles/globals.css`; the ember re-theme is pending.
2. **Dark-only** (recommended) vs light-mode toggle.
3. **Single-page** (recommended) vs multi-page with `/work/$slug`.
4. Which 4–6 projects are **featured** in chapter 05.
5. Include a **Writing/Blog** chapter? (default: no.)
