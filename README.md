# portfolio-2026

Personal portfolio site for Oscar Ortega — single-page scroll experience built with React Three Fiber, Tailwind CSS v4, and GSAP-driven scroll animations.

A custom 3D scene (procedural astronaut, satellite, particle field, grid floor) sits as a fixed background behind five HTML sections (Hero, About, Experience, Projects, Contact). The camera moves between waypoints synced to scroll, the Hero types out roles, section titles reveal word-by-word, and the cursor reacts to both HTML links and 3D objects.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Tech stack

- **Framework:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4 + CSS custom properties (design tokens in `src/styles/tokens.css`)
- **3D:** three.js via `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Animations:** GSAP (+ ScrollTrigger), Lenis (smooth scroll), Framer Motion
- **State:** Zustand (scroll + cursor)
- **i18n:** `react-i18next` (en/es)
- **Routing:** `react-router-dom@7`

## Project structure

```
src/
  components/    Shared UI (HologramCard, HologramButton, CustomCursor, Tag, Footer, Navigation, ...)
  sections/      Page sections (Home composes Hero/About/Experience/Projects/Contact)
  three/         3D scene (Canvas, lighting, objects, camera rig, postprocessing, dev overlay)
  legal/         Stickerswap privacy/terms/delete-account pages
  data/          Mocked content JSON + typed skills
  i18n/          Locale resources (en, es)
  stores/        Zustand stores
  hooks/         Shared hooks
  types/         Shared types
  styles/        Global CSS + design tokens
public/
  favicon.svg
  og-image.svg
```

## Content

All content is mocked in `src/data/` — no backend.

- `experiences.json` — work history
- `projects.json` — featured projects
- `categories.json` — project categories
- `skills.ts` — typed skills list

Legal pages live in `src/legal/legalContent.ts`.

## Dev tooling

- Press `D` in dev mode to enter the camera debug overlay: scroll-driven camera pauses, OrbitControls activate, the on-screen HUD prints live position/lookAt to copy back into `src/three/camera/waypoints.ts`. Tree-shakes out of production.

## Deploying to Vercel

This is a standard Vite SPA. Vercel auto-detects the framework.

1. Push the repo to GitHub (or GitLab / Bitbucket):
   ```bash
   gh repo create portfolio-2026 --public --source=. --push
   ```
2. Go to https://vercel.com/new, import the repo. Vercel detects Vite — no configuration needed.
3. Click **Deploy**. First build takes ~1–2 minutes.
4. After the first successful deploy, add the production URL to `index.html`:
   - `<meta property="og:url" content="https://your-domain.example/" />`
5. Optional: connect a custom domain in Vercel → Settings → Domains.

The included `vercel.json` handles SPA rewrites so `/apps/stickerswap/*` deep links serve `index.html`.

## OpenGraph image

`public/og-image.svg` is a 1200×630 hologram-style social card. Twitter and most modern crawlers accept SVG; if you find a platform that doesn't (some older Facebook/LinkedIn cards), convert it to PNG:

```bash
# requires librsvg
rsvg-convert -w 1200 -h 630 public/og-image.svg -o public/og-image.png
# then update the OG meta tags in index.html to reference the PNG
```

## Credits & Inspiration

This portfolio was inspired by [David Heckhoff's portfolio (portfolio-2025)](https://david-hckh.com) — a Vue 3 + three.js project that pioneered the scroll-driven 3D experience pattern used here. portfolio-2026 is an independent re-implementation in the React ecosystem with original 3D assets, custom shaders, and a different visual identity. The original project's design and code are credited to David Heckhoff.
