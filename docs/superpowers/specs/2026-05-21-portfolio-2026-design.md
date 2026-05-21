# portfolio-2026 — Design Document

**Date:** 2026-05-21
**Author:** Oscar Ortega (with Claude as design partner)
**Status:** Approved, ready for implementation planning

---

## 1. Summary

`portfolio-2026` is a new personal portfolio site built as a single-page scroll experience in React + TypeScript + Vite, with a custom 3D scene (astronaut floating in a space station) rendered as a fixed background via React Three Fiber. As the user scrolls, the camera moves between waypoints in the 3D scene while content sections (Hero → About/Skills → Experience → Projects → Contact) appear as HTML overlays styled as cyan holographic HUDs over a deep-black base.

The project is frontend-only with mocked data sourced from JSON files reused from the existing `portfolio/` project. It is technically inspired by [David Heckhoff's portfolio (portfolio-2025)](https://david-hckh.com) — a Vue 3 + Three.js + GSAP + Lenis source-available project — but reimplemented from scratch in the React ecosystem with original 3D assets, custom shaders, and a different visual identity. Visible attribution is preserved in the footer and README to satisfy the original project's license terms.

## 2. Goals and non-goals

### Goals

- Replace the current Framer Motion–only portfolio with a 3D-driven experience that feels distinctive.
- Reuse existing content (experiences, projects, categories, skills) without breaking the data shape.
- Keep bilingual support (English / Spanish).
- Preserve the existing Stickerswap legal routes (privacy, terms, delete-account).
- Ship a Lighthouse-acceptable performance profile on both desktop and modern mobile devices.
- Stay legally clean with respect to the inspiration source: re-implementation, not porting; original assets; visible attribution.

### Non-goals

- No backend, no CMS, no database — all content is mocked in JSON / TS files.
- No 1:1 replica of the portfolio-2025 room/avatar/lab scenes. A new astronaut + space station scene is built from scratch.
- No GLSL shaders ported from portfolio-2025. Any custom shaders are written from scratch for portfolio-2026.
- No sound system (Howler) in v1. Can be added later as an optional layer.
- No project detail routes (single-page only). Project case studies, if added later, are a follow-up project.
- No internationalization beyond en/es.

## 3. Decisions made during brainstorming

| Topic | Decision |
| --- | --- |
| Scope | Hybrid — one custom 3D scene + secondary effects |
| Central 3D scene | Astronaut + space station |
| 3D stack | React Three Fiber + @react-three/drei + @react-three/postprocessing |
| Animation libs | GSAP + ScrollTrigger, Lenis (smooth scroll), Framer Motion (HTML overlays) |
| Effects included | Cinematic scroll + preloader; custom cursor + hologram UI; particles + grid + postprocessing |
| Effects excluded (v1) | Sounds (Howler) |
| Navigation | Single-page scroll |
| Visual identity | Cyan holographic + black (evolved from current red/black) |
| Astronaut model | CC0 / CC-BY GLB from Sketchfab / Poly Pizza / Poly Haven |
| Mobile strategy | Full 3D scene with reduced quality (particles, dpr, postprocessing) |
| Content data | Reuse existing JSON files as-is |
| 3D ↔ content architecture | HTML overlay over fixed Canvas (SEO-friendly, accessible) |
| Language | TypeScript (migrated from JSX in the current portfolio) |

## 4. Tech stack

### Runtime dependencies

- `react@^19`, `react-dom@^19`, `react-router-dom@^7`
- `typescript@^5`, `vite@^6`, `@vitejs/plugin-react-swc`
- `tailwindcss@^4`, `@tailwindcss/vite`
- `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- `gsap` (with `ScrollTrigger` plugin)
- `lenis`
- `framer-motion`
- `react-i18next`, `i18next`
- `lucide-react`
- `zustand` (lightweight store for shared 3D/scroll state)

### Dev dependencies

- `@types/three`, `@types/react`, `@types/react-dom`
- `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `@eslint/js`, `globals`
- `prettier`
- `vite-plugin-glsl` (in case custom shaders are needed)

## 5. Folder structure

```
portfolio-2026/
├── public/
│   ├── models/                      # GLBs (astronaut, satellite)
│   └── textures/                    # matcaps, environment maps
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── es.json
│   ├── data/                        # mocked content (copied from current portfolio)
│   │   ├── experiences.json
│   │   ├── projects.json
│   │   ├── categories.json
│   │   └── skills.ts                # typed, was hardcoded in AboutSection
│   ├── types/
│   │   ├── content.ts               # Experience, Project, Skill, Category
│   │   └── three.ts                 # Waypoint, SceneKey
│   ├── three/
│   │   ├── Scene.tsx                # <Canvas> root composition
│   │   ├── camera/
│   │   │   ├── CameraRig.tsx
│   │   │   └── waypoints.ts
│   │   ├── objects/
│   │   │   ├── Astronaut.tsx
│   │   │   ├── Satellite.tsx
│   │   │   ├── Particles.tsx        # instanced dust
│   │   │   ├── GridFloor.tsx        # shader floor
│   │   │   └── Stars.tsx
│   │   ├── effects/
│   │   │   └── Postprocessing.tsx   # bloom + chromatic + vignette
│   │   └── hooks/
│   │       ├── useScrollProgress.ts
│   │       └── useReducedQuality.ts
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   ├── components/
│   │   ├── HologramCard.tsx
│   │   ├── HologramButton.tsx
│   │   ├── AppearingText.tsx
│   │   ├── Typewriter.tsx
│   │   ├── Tag.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── Preloader.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx               # includes attribution to David Heckhoff
│   │   └── LangSwitch.tsx
│   ├── contexts/
│   │   ├── LenisProvider.tsx
│   │   └── CursorContext.tsx
│   ├── stores/
│   │   └── scrollStore.ts           # zustand store: progress, section, hover3D
│   ├── hooks/
│   │   ├── useGsapScrollTrigger.ts
│   │   └── useAssetsLoaded.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── tokens.css
│   └── legal/
│       ├── StickerswapPrivacy.tsx
│       ├── StickerswapTerms.tsx
│       └── DeleteAccountPage.tsx
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-21-portfolio-2026-design.md
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── README.md                        # includes Credits & Inspiration section
```

## 6. Architecture

### 6.1 Composition tree

```
<LenisProvider>
  <CursorContext>
    <CustomCursor />
    <Preloader />

    <Canvas dpr={[1, 2]} fixed inset-0 z-0>
      <Suspense fallback={null}>
        <CameraRig />
        <Lighting />
        <Stars />
        <GridFloor />
        <Particles count={300} />
        <Astronaut />
        <Satellite />
        <Postprocessing />
      </Suspense>
    </Canvas>

    <main className="relative z-10">
      <Navigation />
      <Hero />        ← waypoint 0
      <About />       ← waypoint 1
      <Experience />  ← waypoint 2
      <Projects />    ← waypoint 3
      <Contact />     ← waypoint 4
      <Footer />
    </main>
  </CursorContext>
</LenisProvider>
```

The Canvas is `position: fixed; inset: 0; z-index: 0`. The `<main>` overlay scrolls normally with `z-index: 10` and transparent backgrounds, so the 3D scene shows through.

### 6.2 Scroll ↔ camera synchronization

1. **Lenis** drives smooth scrolling and emits scroll events with `progress` (0..1).
2. **`scrollStore`** (Zustand) holds `progress` as a non-reactive value (subscribed via `subscribeWithSelector` or accessed via `getState()` inside `useFrame`).
3. **`CameraRig`** runs in `useFrame`, reads progress, interpolates camera position + lookAt between waypoints, and applies easing.

```ts
// waypoints.ts (data)
export type Waypoint = {
  key: 'hero' | 'about' | 'experience' | 'projects' | 'contact';
  position: [number, number, number];
  lookAt: [number, number, number];
};

export const waypoints: Waypoint[] = [
  { key: 'hero',       position: [0, 1.5,  8], lookAt: [0, 1, 0] },
  { key: 'about',      position: [3, 2.5,  5], lookAt: [0, 1, 0] },
  { key: 'experience', position: [4, 1,   -2], lookAt: [-1, 1, 0] },
  { key: 'projects',   position: [-3, 3,  -4], lookAt: [0, 1, -2] },
  { key: 'contact',    position: [0, 5,   12], lookAt: [0, 0, 0] },
];
```

Exact values are tuned visually during Phase 3 using a dev overlay (toggle with `D` key) that prints the current camera state so values can be copied back into `waypoints.ts`.

### 6.3 HTML overlays

Each section is a normal React component. Reveal animations are split:

- **Framer Motion `whileInView`** for simple reveals (cards, tags, list items).
- **GSAP ScrollTrigger** for complex sequences (Hero typewriter, About skills cascade).

Content sources data from `src/data/*` files. Bilingual fields (`{en, es}`) are read through a translator helper that picks the active locale.

### 6.4 Custom cursor + 3D interaction

- `CustomCursor` renders two divs (dot + outline ring) that follow the mouse via `requestAnimationFrame` with lerp smoothing. Hidden on touch devices.
- `CursorContext` holds states: `default`, `hover-link`, `hover-3d`.
- HTML hover state is set via mouse enter/leave on links/buttons that opt in.
- 3D hover state is computed in the scene: a raycaster (R3F's `onPointerOver`/`onPointerOut` on interactive meshes — astronaut, satellite) sets `hover-3d` and clears it on out.

### 6.5 Hologram UI components

Three primitives provide the HUD look:

- **`HologramCard`** — `clip-path` with notched corners, 1px cyan border, `box-shadow` for outer glow, `backdrop-filter: blur(8px)` on a `rgba(10,18,36,0.5)` background. Variants: `compact`, `full`.
- **`HologramButton`** — angular frame, animated arrow icon at hover, subtle scale + glow on hover.
- **`Tag`** — rounded chip with cyan border, faint inner glow.

CSS tokens in `src/styles/tokens.css`:

```css
:root {
  --bg-base:   #050a14;
  --bg-elev:   #0a1224;
  --cyan-100:  #e0fbff;
  --cyan-400:  #22d3ee;
  --cyan-500:  #00d4ff;
  --cyan-glow: 0 0 24px rgba(0, 212, 255, 0.45);
  --hud-corner: 14px;
  --ease-hud: cubic-bezier(0.6, 0, 0.1, 1);
}
```

### 6.6 3D scene details

- **Astronaut**: CC0/CC-BY GLB from Sketchfab/Poly Pizza. `useGLTF` to load, `<Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>` from drei for idle motion. Marked `userData.interactive = true` for raycaster.
- **Satellite**: secondary GLB or procedural box+antennas. Anchored near the "projects" waypoint, rotates slowly on Y axis.
- **Stars**: drei's `<Stars />` for the background skybox with reduced count.
- **GridFloor**: a plane mesh with a custom fragment shader producing a grid of cyan lines fading with distance and viewing angle. Inspired by classic Tron-style floors; written from scratch.
- **Particles**: 300 instanced meshes (`<InstancedMesh>`) of small cyan dots drifting slowly upward with subtle X/Z noise. Reduced to 60 on low-quality mode.
- **Lighting**: low ambient (`#0a1224`), one directional with cyan tint, one point light near the astronaut's helmet for emissive glow.
- **Postprocessing**: bloom (intensity ~0.8, luminanceThreshold ~0.6) + chromatic aberration (offset ~[0.0005, 0.0005]) + vignette (darkness ~0.4). In low-quality mode, only bloom remains enabled (chromatic and vignette are skipped).

### 6.7 Mobile / reduced quality

`useReducedQuality` returns `true` if any of:

- viewport width < 768px
- `navigator.hardwareConcurrency < 4`
- `window.matchMedia('(prefers-reduced-motion: reduce)').matches`

When `true`:

- `<Canvas dpr={[1, 1.25]}>`
- `<Particles count={60} />`
- `<Postprocessing>` renders only bloom (no chromatic, no vignette)
- `<GridFloor>` falls back to a static texture instead of the shader

### 6.8 Preloader + intro

- Drei's `useProgress()` hook reports asset loading progress.
- `Preloader` displays a cyan HUD with a progress bar and rotating status messages ("INITIALIZING…", "DOCKING…", "ESTABLISHING UPLINK…").
- When progress reaches 100% AND a minimum of 800ms has elapsed, dispatches the intro:
  1. Preloader fade out (300ms).
  2. Camera dolly forward (600ms ease-in-out).
  3. Hero text reveal word-by-word (staggered).
  4. Lenis scroll unlocked.

### 6.9 Attribution

To honor the source-available license of portfolio-2025:

- **Footer**: a small line "Inspired by [David Heckhoff's portfolio](https://david-hckh.com) — reimplemented in React with original assets."
- **README**: a "Credits & Inspiration" section with the same link and a one-sentence note explaining the relationship.
- No code, models, textures, or shader source is copied from portfolio-2025. Visual style is intentionally evolved (cyan instead of the original color treatment).

## 7. Data model

### 7.1 Existing JSON shapes (kept as-is)

```ts
// src/types/content.ts
export type Locale = 'en' | 'es';
export type Localized = Record<Locale, string>;

export type Experience = {
  id: number;
  position: number;
  company: string;
  job_title: Localized;
  description: Localized;
  start_date: string;          // ISO yyyy-mm-dd
  end_date: string | null;
  location: string;
  company_url: string | null;
  technologies: string[];
};

export type Project = {
  id: number;
  title: Localized;
  description: Localized;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  app_store_url: string | null;
  play_store_url: string | null;
  image_url: string;
  published: boolean;
  featured: boolean;
  position: number;
};

export type Category = {
  id: number;
  name: Localized;
  slug: string;
};
```

### 7.2 New typed skills (was hardcoded in `AboutSection.jsx`)

```ts
// src/data/skills.ts
export type SkillGroup = 'backend' | 'frontend' | 'devops' | 'database';

export type Skill = {
  name: string;
  level: number;            // 0..100
  group: SkillGroup;
  color: string;            // hex (defaults to cyan; overrides allowed)
};

export const skills: Skill[] = [
  { name: 'Ruby on Rails', level: 95, group: 'backend',  color: '#00d4ff' },
  { name: 'PostgreSQL',    level: 90, group: 'database', color: '#00d4ff' },
  { name: 'React',         level: 85, group: 'frontend', color: '#22d3ee' },
  { name: 'TypeScript',    level: 80, group: 'frontend', color: '#22d3ee' },
  { name: 'GCP',           level: 70, group: 'devops',   color: '#67e8f9' },
  { name: 'Python',        level: 40, group: 'backend',  color: '#67e8f9' },
];
```

## 8. Routing

```ts
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/apps/stickerswap/privacy" element={<StickerswapPrivacy />} />
    <Route path="/apps/stickerswap/terms" element={<StickerswapTerms />} />
    <Route path="/apps/stickerswap/delete-account" element={<DeleteAccountPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

`Home` is the single-page scroll experience with the 3D scene + 5 sections. Legal routes are plain 2D pages with their own minimal layout (no 3D scene), reusing the same hologram visual identity for consistency.

## 9. State management

- **Local component state**: `useState` for UI state confined to a component (e.g. typewriter index, menu open/closed).
- **Shared 3D/scroll state**: `zustand` store at `src/stores/scrollStore.ts` for cross-cutting state read inside `useFrame` (scroll progress, active section, 3D hover state). Avoids React re-renders at 60fps.
- **Cursor state**: separate React context (`CursorContext`) — UI-level, low frequency.
- **Locale**: react-i18next manages locale globally. `LangSwitch` component toggles between en/es.

## 10. Implementation plan (phases)

Each phase produces a runnable, demoable state. Phases are sequential; the user reviews after each before moving on.

| Phase | Title | Estimated effort (part-time) |
| --- | --- | --- |
| 0 | Scaffolding (Vite + deps + tokens + i18n + routes) | 0.5 day |
| 1 | Section skeletons + Lenis (HTML-only, no 3D) | 0.5 day |
| 2 | Base 3D scene (astronaut + stars + grid + bloom) | 1–2 days |
| 3 | Cinematic camera (scroll → waypoint interpolation) | 1 day |
| 4 | Hologram UI + custom cursor + text reveals | 1–2 days |
| 5 | Particles + full postprocessing + visual polish | 1 day |
| 6 | Preloader + cinematic intro | 0.5 day |
| 7 | Mobile + performance pass | 1 day |
| 8 | Legal pages + footer + meta + deploy | 0.5 day |

**Total:** ~7–9 days part-time.

After Phase 1 the site already functions as an accessible, content-complete fallback — useful as a safety net for visitors with limited devices or JS disabled (with appropriate fallback markup).

## 11. Testing strategy

This is a portfolio site — there is no business logic that requires unit-test discipline. The verification model is:

- **Type safety**: TypeScript strict mode catches most regressions.
- **Visual verification**: each phase ends with manual review in `npm run dev`.
- **Cross-device verification**: Phase 7 includes Chrome DevTools mobile emulation + testing on a real device.
- **Lighthouse**: targets Performance ≥ 70 desktop / ≥ 50 mobile.
- **Accessibility spot-check**: keyboard navigation works to all links, focus states are visible, color contrast meets WCAG AA on text overlays.

No automated test suite is set up in v1. If interactive logic grows (e.g. complex form, dynamic filtering), tests can be added incrementally.

## 12. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| 3D scene tanks performance on older mobiles | Medium | High | `useReducedQuality` with aggressive fallbacks; Phase 7 dedicated to perf; option to ship a "lite mode" toggle |
| GLB models look generic or off-brand | Medium | Medium | Curated list of 3-5 CC0 options reviewed by user before commit; can revisit after Phase 2 |
| Scroll-driven camera feels janky | Low | High | Lenis + GSAP is the proven stack; dev overlay for waypoint tuning; easing per segment |
| License conflict with portfolio-2025 author | Low | High | No code/asset copying; visible attribution; visual identity intentionally diverged (cyan vs original) |
| Scope creep delays shipping | Medium | Medium | Strict phase gating; each phase ends in a demoable state so the project can ship at any phase ≥ 4 |
| Maintaining bilingual content drifts | Low | Low | Existing JSON shape with `{en, es}` is preserved; no new content added in v1 |

## 13. Open questions

None blocking. The following can be answered during implementation:

- Exact astronaut GLB model — picked during Phase 2 from a curated list.
- Specific waypoint coordinates — tuned visually during Phase 3.
- Hologram corner clip-path geometry — refined during Phase 4 with mockups.

## 14. References

- Inspiration source: [David Heckhoff's portfolio (portfolio-2025)](https://david-hckh.com)
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- @react-three/drei: https://github.com/pmndrs/drei
- @react-three/postprocessing: https://github.com/pmndrs/react-postprocessing
- Lenis: https://lenis.darkroom.engineering/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
