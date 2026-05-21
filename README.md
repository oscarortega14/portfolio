# portfolio-2026

Personal portfolio site for Oscar Ortega — single-page scroll experience built with React Three Fiber, Tailwind CSS v4, and GSAP-driven scroll animations.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Tech stack

- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4 + CSS custom properties (design tokens)
- **3D:** three.js via `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Animations:** GSAP (+ ScrollTrigger), Lenis (smooth scroll), Framer Motion
- **i18n:** `react-i18next` (en/es)
- **Routing:** `react-router-dom@7`

## Content

All content is mocked in `src/data/` (no backend). Bilingual fields use `{ en, es }` shape:

- `experiences.json` — work history
- `projects.json` — featured projects
- `categories.json` — project categories
- `skills.ts` — typed skills list

## Credits & Inspiration

This portfolio was inspired by [David Heckhoff's portfolio (portfolio-2025)](https://david-hckh.com) — a Vue 3 + three.js project that pioneered the scroll-driven 3D experience pattern used here. portfolio-2026 is an independent re-implementation in the React ecosystem with original 3D assets, custom shaders, and a different visual identity. The original project's design and code are credited to David Heckhoff.
