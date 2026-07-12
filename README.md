# Zeptaz V2 — Web

Premium marketing site for **Zeptaz — AI workflow automation for service businesses**.
Built fresh for V2: Next.js 16 (App Router) · React 19 · Tailwind v4 · GSAP + ScrollTrigger · Lenis.

Positioning and copy follow the Final Strategy Report (§17 Website Brand & Content Strategy):
operator-first, anti-hype, five service categories, and a connected, dependency-locked module engine.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## Stack & conventions

- **Animation:** GSAP + ScrollTrigger, synced to **Lenis** smooth scroll
  (`components/layout/SmoothScroll.tsx`). All effects are gated behind
  `prefersReducedMotion()` (`lib/gsap.ts`).
- **Signature scroll scenes:** Hero (pinned), The Engine (pinned + SVG path-draw,
  desktop only via `gsap.matchMedia`), Process (scroll-drawn progress line).
- **Design tokens:** `app/globals.css` — dark base + warm light "paper" editorial
  sections + crimson `#DC143C` accent. Fonts: Big Shoulders (display),
  JetBrains Mono (labels), Inter (body/headings).
- **Content source of truth:** `app/lib/constants.ts`.
- **Illustrations (in-code, animated):** `app/components/illustrations/`
  — `ChannelChaos` (problem), `IsoArt` (service cards), `ParticleSphere` (core offer).

## Structure

```
app/
  page.tsx                 # homepage — section order
  layout.tsx               # fonts, metadata, SmoothScroll + Navbar + Footer
  globals.css              # design system
  components/
    layout/  Navbar, Footer, SmoothScroll
    sections/ Hero, Problem, CoreOffer, ServiceCategories, Engine,
              Differentiators, Integrations, Process, Packages,
              TrustSecurity, Team, Faq, FinalCta
    ui/       Eyebrow, Reveal, StatCounter, Button, Section, LogoMark, TerminalBackdrop
    illustrations/
  lib/        gsap, gsap-utils, constants, utils
  hooks/      useReducedMotion, useMediaQuery
```

## Multipage roadmap (not yet built)

This repo currently ships the **homepage** only. Service cards and nav are written so
detail pages can be added later (e.g. `app/services/[slug]/page.tsx`): Services detail,
About, Pricing, Contact, Blog. Section IDs (`#services`, `#engine`, `#process`,
`#packages`, `#faq`, `#contact`) double as in-page anchors today.

The contact form in `FinalCta` is a working UI stub — wire `@emailjs/browser` (already a
dependency) or a server action to send.
