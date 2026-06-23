# FireSafeX NexGen — Website

Marketing site for FireSafeX NexGen, built as a **Next.js (App Router)** application.

The cinematic motion engine (Lenis smooth scroll + GSAP/ScrollTrigger) and the
finale Three.js scene are bundled from npm — no runtime CDN dependency.

## Tech

- **Next.js 15** (App Router) + **React 19**
- **GSAP** + **ScrollTrigger** (npm) — scroll animations
- **Lenis** (npm) — smooth inertia scroll
- **Three.js** (npm) — finale atmospheric scene

## Project structure

```
app/
  layout.js     # <html>/<body>, metadata, global CSS
  page.js       # full page markup (JSX)
  globals.css   # site styles
components/
  home/sections/   # page sections for the marketing homepage
  layout/          # layout chrome such as navigation
  modals/          # shared modal UI
  system/          # client-side bootstrapping components
lib/
  boot/            # app-wide runtime scripts loaded after mount
  experience/      # hero/hardware/problem/finale visual engines
data/
  video-urls.json  # local-path → hosted video URL manifest
scripts/
  media/           # one-off uploaders for hosted media manifests
public/         # images, videos, and frame sequences
```

Public assets are organized under:

```text
public/assets/
  images/product/        # static product stills/posters
  sequences/hero/        # hero frame sequence
  sequences/hardware/    # hardware frame sequence
  videos/global/         # shared/global product videos
  videos/overview/       # overview tab videos
  videos/problem/
    legacy/              # "old way" comparison clips
    firesafex/           # FireSafeX comparison clips
```

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build & run (production)

```bash
npm run build
npm run start    # serves on $PORT (default 3000)
```

## Deploy

The page is fully static (prerendered at build time), so it deploys cleanly on:

- **Vercel** — zero config; it detects Next.js and runs `next build`.
- **Any Node host** — `npm install && npm run build && npm run start`
  (the host must set `PORT`).
- **Static hosting** (Netlify drop, S3, etc.) — optional: add
  `output: 'export'` to `next.config.js`, run `npm run build`, and deploy the
  generated `out/` folder.
```

> Note on dev: `reactStrictMode` is disabled in `next.config.js` so the
> imperative GSAP/Three.js setup is not double-invoked in development.

## Recent Changes

- Reworked the Product Overview experience and stabilized tabbed video playback.
- Replaced the old technical hardware spec messaging with user-friendly FireSafeX hardware feature cards.
- Added a centralized Book Demo modal used by the navbar, hero, CTA, footer, and hardware CTA buttons.
- Improved modal UX with glassmorphism styling, validation, success/error states, close-on-backdrop click, and proper scroll locking.
- Fixed modal scroll behavior so wheel and touch scrolling work anywhere inside the popup.
- Updated the Global Deployment section to use the latest FireSafeX product training video.
- Fixed the Global Deployment heading visibility by removing it from the hidden split-title animation pipeline.
- Cleaned up one unused app video asset and tightened ignore rules for local clutter such as nested `.DS_Store`, `SKILLS.md`, and backup files.
