# Phase 7 — Mobile + Performance Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shrink the initial JS bundle, make the page interactive faster, and keep the 3D scene rendering smoothly on mobile / low-end devices — without changing how anything looks or feels on a healthy desktop. Specifically: (1) move the 3D scene into a lazily-loaded chunk so the HTML overlay can paint before three.js is downloaded, (2) drop drei's `useProgress` from the Preloader so the eager main bundle no longer pulls in drei, (3) let R3F adaptively lower the device pixel ratio when FPS drops, and (4) document the Lighthouse + real-device pass the user runs themselves.

**Architecture:** Add a `sceneLoaded` flag to `scrollStore`; the lazily-imported `Scene` flips it to `true` on mount. The `Preloader` waits for the synthetic timer AND `sceneLoaded` (instead of drei's `useProgress`) before triggering the intro. Lazy import is done via `React.lazy(() => import('@/three/Scene'))` and a `<Suspense fallback={null}>` boundary in `Home`. Adaptive DPR comes from drei's `<AdaptiveDpr>` + `<AdaptiveEvents>` mounted inside the Canvas. The reduced-quality detection from Phase 2 stays in place — this phase only adds dynamic adaptation on top of it.

**Tech Stack:** `React.lazy` + `Suspense`, drei `<AdaptiveDpr>` / `<AdaptiveEvents>`. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-05-21-portfolio-2026-design.md`

---

## File map

**Modified:**
- `src/stores/scrollStore.ts` — add `sceneLoaded` + setter
- `src/three/Scene.tsx` — flip `sceneLoaded=true` on mount; add `<AdaptiveDpr>` + `<AdaptiveEvents>`
- `src/components/Preloader.tsx` — drop drei's `useProgress`, gate on `sceneLoaded`
- `src/sections/Home.tsx` — lazy-import `Scene` with `<Suspense fallback={null}>`
- `index.html` — add `preconnect` for `images.pexels.com` (project images come from there)

---

## Tasks

### Task 1: Add `sceneLoaded` to `scrollStore`

- [ ] **Step 1: Update the store**

File: `/Users/oscarortega/projects/portfolio-2026/src/stores/scrollStore.ts`

```ts
import { create } from 'zustand';

export type IntroState = 'loading' | 'intro' | 'ready';

type ScrollState = {
  progress: number;
  devCameraMode: boolean;
  introState: IntroState;
  introStartedAt: number | null;
  sceneLoaded: boolean;
  setProgress: (p: number) => void;
  toggleDevCameraMode: () => void;
  startIntro: () => void;
  finishIntro: () => void;
  setSceneLoaded: (v: boolean) => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  devCameraMode: false,
  introState: 'loading',
  introStartedAt: null,
  sceneLoaded: false,
  setProgress: (progress) => set({ progress }),
  toggleDevCameraMode: () => set((s) => ({ devCameraMode: !s.devCameraMode })),
  startIntro: () =>
    set({ introState: 'intro', introStartedAt: performance.now() }),
  finishIntro: () => set({ introState: 'ready' }),
  setSceneLoaded: (v) => set({ sceneLoaded: v }),
}));
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/stores/scrollStore.ts && git commit -m "feat: add sceneLoaded flag to scrollStore"
```

---

### Task 2: Have `Scene` flip `sceneLoaded` and add adaptive DPR / events

- [ ] **Step 1: Update `Scene.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/Scene.tsx`

```tsx
import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import Lighting from './lighting/Lighting';
import Stars from './objects/Stars';
import GridFloor from './objects/GridFloor';
import Astronaut from './objects/Astronaut';
import Satellite from './objects/Satellite';
import Particles from './objects/Particles';
import Postprocessing from './effects/Postprocessing';
import CameraRig, { CameraDebugPublisher } from './camera/CameraRig';
import { waypoints } from './camera/waypoints';
import { useScrollStore } from '@/stores/scrollStore';

export default function Scene() {
  const devCameraMode = useScrollStore((s) => s.devCameraMode);
  const setSceneLoaded = useScrollStore((s) => s.setSceneLoaded);
  const initial = waypoints[0]!;

  useEffect(() => {
    setSceneLoaded(true);
    return () => setSceneLoaded(false);
  }, [setSceneLoaded]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: devCameraMode ? 20 : 0,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[0x050a14]} />
        <fog attach="fog" args={[0x050a14, 35, 140]} />

        <PerspectiveCamera
          makeDefault
          fov={50}
          near={0.1}
          far={200}
          position={initial.position}
        />

        <Suspense fallback={null}>
          <Lighting />
          <Stars />
          <GridFloor />
          <Particles />
          <Satellite />
          <Astronaut />
          <CameraRig />
          {devCameraMode && import.meta.env.DEV && <CameraDebugPublisher />}
          {devCameraMode && (
            <OrbitControls
              enablePan
              enableDamping
              dampingFactor={0.08}
              target={initial.lookAt}
            />
          )}
          <Postprocessing />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/Scene.tsx && git commit -m "feat: report sceneLoaded + add AdaptiveDpr / AdaptiveEvents"
```

---

### Task 3: Drop `useProgress` from `Preloader`, gate on `sceneLoaded`

This removes the implicit drei dependency from the main bundle. The Preloader now uses only the synthetic timer + the `sceneLoaded` flag.

- [ ] **Step 1: Update `Preloader.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/Preloader.tsx`

```tsx
import { useEffect, useState } from 'react';
import { useScrollStore } from '@/stores/scrollStore';

const SYNTH_DURATION_MS = 1400;
const MIN_VISIBLE_MS = 1200;
const FADE_OUT_MS = 450;

const STATUS_LINES = [
  'INITIALIZING SYSTEMS',
  'CALIBRATING SENSORS',
  'ESTABLISHING UPLINK',
  'DOCKING WITH PORTFOLIO',
];

export default function Preloader() {
  const introState = useScrollStore((s) => s.introState);
  const sceneLoaded = useScrollStore((s) => s.sceneLoaded);
  const startIntro = useScrollStore((s) => s.startIntro);

  const [t, setT] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const ratio = Math.min(1, elapsed / SYNTH_DURATION_MS);
      setT(ratio);
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_LINES.length);
    }, 380);
    return () => clearInterval(interval);
  }, []);

  // Trigger intro when synthetic timer is full AND Scene chunk is mounted
  useEffect(() => {
    if (!(t >= 1 && sceneLoaded)) return;
    const timer = window.setTimeout(() => {
      startIntro();
    }, Math.max(0, MIN_VISIBLE_MS - SYNTH_DURATION_MS));
    return () => window.clearTimeout(timer);
  }, [t, sceneLoaded, startIntro]);

  useEffect(() => {
    if (introState === 'loading') return;
    const timer = window.setTimeout(() => setHidden(true), FADE_OUT_MS + 50);
    return () => window.clearTimeout(timer);
  }, [introState]);

  if (hidden) return null;

  // Visual progress is capped by sceneLoaded so the bar pauses near 100% if the
  // 3D chunk hasn't loaded yet (slow connection).
  const displayPct = Math.min(t * 100, sceneLoaded ? 100 : 92);

  const fading = introState !== 'loading';

  return (
    <div
      aria-hidden={fading}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-preloader)',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: 24,
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_OUT_MS}ms ease`,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: 28,
          letterSpacing: '0.4em',
          color: 'var(--cyan-100)',
          textShadow: 'var(--cyan-glow-strong)',
        }}
      >
        OO<span style={{ color: 'var(--cyan-400)' }}>/</span>2026
      </div>

      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: 11,
          letterSpacing: '0.32em',
          color: 'var(--cyan-300)',
          minHeight: 16,
        }}
      >
        {STATUS_LINES[statusIdx]}…
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(displayPct)}
        style={{
          width: 'min(360px, 70vw)',
          height: 4,
          background: 'rgba(0, 212, 255, 0.12)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${displayPct}%`,
            height: '100%',
            background: 'var(--cyan-500)',
            boxShadow: 'var(--cyan-glow)',
            transition: 'width 0.18s linear',
          }}
        />
      </div>

      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: 11,
          letterSpacing: '0.16em',
          color: 'var(--cyan-400)',
          width: 'min(360px, 70vw)',
          textAlign: 'right',
          marginTop: -16,
        }}
      >
        {Math.round(displayPct).toString().padStart(3, '0')}%
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/Preloader.tsx && git commit -m "perf: drop drei useProgress from Preloader, gate on sceneLoaded"
```

---

### Task 4: Lazy-load `Scene` in `Home`

- [ ] **Step 1: Update `Home.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Home.tsx`

```tsx
import { lazy, Suspense } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CameraDebugOverlay from '@/three/dev/CameraDebugOverlay';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';

const Scene = lazy(() => import('@/three/Scene'));

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Navigation />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <CustomCursor />
      <Preloader />
      <CameraDebugOverlay />
    </>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/sections/Home.tsx && git commit -m "perf: lazy-load Scene to split three.js/R3F into separate chunk"
```

---

### Task 5: Add `preconnect` for the Pexels image CDN

Project images come from `images.pexels.com`. Preconnecting saves ~100–200ms on first image fetch.

- [ ] **Step 1: Update `index.html`**

File: `/Users/oscarortega/projects/portfolio-2026/index.html`

Add inside `<head>` (after the existing `<meta>` tags, before `<title>`):

```html
<link rel="preconnect" href="https://images.pexels.com" crossorigin />
<link rel="dns-prefetch" href="https://images.pexels.com" />
```

Final `<head>`:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#050a14" />
  <link rel="preconnect" href="https://images.pexels.com" crossorigin />
  <link rel="dns-prefetch" href="https://images.pexels.com" />
  <title>Oscar Ortega — portfolio</title>
  <meta name="description" content="Senior Ruby on Rails engineer. Portfolio of Oscar Ortega." />
</head>
```

- [ ] **Step 2: Commit**

```bash
git add index.html && git commit -m "perf: preconnect to images.pexels.com"
```

---

### Task 6: Verify the bundle was split

- [ ] **Step 1: Clean build**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && rm -rf dist && npm run build 2>&1 | tail -20
```

Expected output should show **multiple chunks** instead of one big bundle, e.g.:

```
dist/assets/index-XXX.js          (small — ~200-400 KB)   main bundle
dist/assets/Scene-XXX.js          (large — ~700-900 KB)   3D scene chunk
```

The exact filenames depend on Vite's hashing. The key win is the main bundle dropping to the 200–400KB range so the page can paint before three.js loads.

- [ ] **Step 2: Inspect chunk sizes**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && ls -lh dist/assets/*.js
```

Note the size of each chunk. The largest one is the 3D code (deferred). The main one should be drastically smaller than Phase 6's 1.44MB.

- [ ] **Step 3: Lint**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npm run lint 2>&1 | tail -10
```
Expected: no errors.

- [ ] **Step 4: Smoke-test dev server**

```bash
pkill -f "vite" 2>/dev/null; sleep 1; export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && (npm run dev > /tmp/p26.log 2>&1 & echo $! > /tmp/p26.pid) && sleep 5 && curl -s -o /dev/null -w "/ → HTTP %{http_code}\n" http://localhost:5173/ ; kill $(cat /tmp/p26.pid) 2>/dev/null
```
Expected: HTTP 200.

---

### Task 7: Manual verification (browser + mobile + Lighthouse)

This is a human gate. Builds and assertions can't measure perceived performance — you have to drive it.

- [ ] **Step 1: Run dev server**

```bash
cd /Users/oscarortega/projects/portfolio-2026 && npm run dev
```

- [ ] **Step 2: Desktop smoke (`http://localhost:5173/`)**

- [ ] First paint: HTML overlay (Hero / Navigation / sections) shows quickly even before the 3D appears
- [ ] Preloader stays visible until the Scene chunk loads (not 1.4s flat — possibly longer on slow networks)
- [ ] Once Scene loads: dolly intro plays, scroll unlocks. Everything else works as in Phase 6
- [ ] No new console errors
- [ ] DevTools → Network: confirm two main JS chunks loaded (main + Scene)
- [ ] DevTools → Network → "Slow 3G" throttle, hard refresh: page renders HTML quickly while the 3D chunk takes a while; Preloader visibly pauses near 92% until 3D arrives

- [ ] **Step 3: Mobile emulation in DevTools**

DevTools → Device Toolbar → choose "iPhone 14 Pro Max" (or any modern phone).

- [ ] Layout responsive — sections stack, navigation collapses, no horizontal scroll
- [ ] Custom cursor is hidden (touch device)
- [ ] 3D scene still renders with reduced quality (fewer particles, no chromatic / vignette)
- [ ] Scroll is smooth (Lenis tuned for touch)
- [ ] Hero typewriter works; AppearingText reveals work

- [ ] **Step 4: CPU throttle (Chrome DevTools → Performance → CPU 4× slowdown)**

Refresh and observe:
- [ ] FPS doesn't tank to single digits — drei's `AdaptiveDpr` should kick in and drop dpr to 1
- [ ] Animations remain comprehensible

- [ ] **Step 5: Lighthouse**

DevTools → Lighthouse → "Mobile" + "Performance" + "Accessibility" + "Best Practices" + "SEO" → Generate.

Note the scores. Targets:
- [ ] Performance ≥ 50 (mobile is hard for a 3D portfolio; if you score higher, great)
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 95

If Performance is < 50, common culprits:
- Largest Contentful Paint affected by the lazy chunk size → consider further code-splitting of project images, or `<link rel="preload">` for the Scene chunk
- Total Blocking Time → already minimized by lazy loading; little to do further at this stage

These improvements (if needed) can be follow-up — record the number and move on.

- [ ] **Step 6: Real device (optional but recommended)**

Open `http://<your-local-ip>:5173/` on your phone (run `npm run dev -- --host` if your phone is on the same Wi-Fi). Confirm scene runs at acceptable FPS and battery isn't draining absurdly.

- [ ] **Step 7: If anything is off, report**; otherwise Phase 7 is complete.

---

## Phase 7 Deliverable

- Scene component lazy-loaded → main bundle drops by ~70% on first paint
- Preloader gates on a tiny `sceneLoaded` flag instead of pulling drei into the main bundle
- drei's `<AdaptiveDpr>` + `<AdaptiveEvents>` dynamically lower render resolution + throttle pointer events when FPS drops
- Preconnect to Pexels CDN for project images
- Lighthouse run by user; bundle sizes inspected
- Build, type-check, lint all clean

**Next phase:** `2026-05-21-phase-8-polish-deploy.md` — favicon + OpenGraph image + final meta tags + README finalization + Vercel deploy.
