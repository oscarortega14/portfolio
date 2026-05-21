# Phase 6 — Preloader + Cinematic Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On first paint, show a full-screen cyan HUD preloader with a progress bar and rotating status text. When loading is "complete" (synthetic progress + drei `useProgress` + a minimum on-screen duration), the preloader fades out, the camera dollies forward from an "intro start" position to the hero waypoint, and only then does scroll get unlocked and the Hero AppearingText reveals fire naturally. The result is a 1.5–2 second curated entry that feels intentional instead of "page loaded, scroll".

**Architecture:** Three-state machine in `scrollStore` — `loading | intro | ready`. The Preloader DOM component fades out via CSS opacity when transitioning out of `loading`. The `CameraRig` adds an intro branch: in `loading`, hold the camera at a "intro-start" pose; in `intro`, lerp from intro-start to `waypoints[0]` over a fixed duration with eased interpolation; in `ready`, fall back to scroll-driven behavior (current Phase 3 logic). `LenisProvider` calls `lenis.stop()` / `lenis.start()` based on the state. Progress is the MIN of a synthetic 0–100% climb over ~1.4s and drei's real `useProgress.progress` (which, with no GLB assets yet, is essentially 100% from the start — synthetic dominates).

**Tech Stack:** `@react-three/drei` `useProgress`, existing `scrollStore`, existing `CameraRig`, plain DOM for the preloader UI.

**Spec:** `docs/superpowers/specs/2026-05-21-portfolio-2026-design.md`

---

## File map

**Created:**
- `src/components/Preloader.tsx`

**Modified:**
- `src/stores/scrollStore.ts` — add `introState` + setter
- `src/three/camera/CameraRig.tsx` — handle `loading` and `intro` phases
- `src/three/camera/waypoints.ts` — export an `INTRO_START` pose
- `src/contexts/LenisProvider.tsx` — start/stop Lenis based on `introState`
- `src/sections/Home.tsx` — mount `<Preloader />`

---

## Tasks

### Task 1: Extend `scrollStore` with `introState`

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
  setProgress: (p: number) => void;
  toggleDevCameraMode: () => void;
  startIntro: () => void;
  finishIntro: () => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  devCameraMode: false,
  introState: 'loading',
  introStartedAt: null,
  setProgress: (progress) => set({ progress }),
  toggleDevCameraMode: () => set((s) => ({ devCameraMode: !s.devCameraMode })),
  startIntro: () =>
    set({ introState: 'intro', introStartedAt: performance.now() }),
  finishIntro: () => set({ introState: 'ready' }),
}));
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/stores/scrollStore.ts && git commit -m "feat: add introState machine to scrollStore"
```

---

### Task 2: Export an `INTRO_START` pose from `waypoints.ts`

A pose further back and lower than the hero waypoint, so the dolly into the hero pose feels like flying in.

- [ ] **Step 1: Update the file**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/camera/waypoints.ts`

Append (keep existing `waypoints` array as-is):

```ts
// Camera pose used as the starting frame for the intro dolly.
// The intro lerps from this to waypoints[0] (hero) over INTRO_DURATION ms.
export const INTRO_START = {
  position: [0, 0.6, 14] as [number, number, number],
  lookAt:   [0, 1.2,  0] as [number, number, number],
};

export const INTRO_DURATION = 1500; // ms
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/camera/waypoints.ts && git commit -m "feat: add INTRO_START pose and INTRO_DURATION"
```

---

### Task 3: Teach `CameraRig` about `loading` and `intro` phases

- [ ] **Step 1: Update the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/camera/CameraRig.tsx`

Replace the file with:

```tsx
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { waypoints, INTRO_START, INTRO_DURATION } from './waypoints';
import { easeInOutCubic, clamp01 } from '@/three/utils/easing';
import { useScrollStore } from '@/stores/scrollStore';

export default function CameraRig() {
  const posA = useRef(new THREE.Vector3());
  const posB = useRef(new THREE.Vector3());
  const lookA = useRef(new THREE.Vector3());
  const lookB = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  const total = useMemo(() => waypoints.length - 1, []);

  useFrame((state) => {
    const { progress, devCameraMode, introState, introStartedAt, finishIntro } =
      useScrollStore.getState();

    if (devCameraMode) return;
    const cam = state.camera;

    // --- Loading phase: hold at intro-start pose, ignore scroll ---
    if (introState === 'loading') {
      posA.current.fromArray(INTRO_START.position);
      lookA.current.fromArray(INTRO_START.lookAt);
      cam.position.copy(posA.current);
      cam.lookAt(lookA.current);
      return;
    }

    // --- Intro phase: lerp from intro-start to waypoint[0] over INTRO_DURATION ms ---
    if (introState === 'intro') {
      const start = introStartedAt ?? performance.now();
      const elapsed = performance.now() - start;
      const t = clamp01(elapsed / INTRO_DURATION);
      const eased = easeInOutCubic(t);

      posA.current.fromArray(INTRO_START.position);
      lookA.current.fromArray(INTRO_START.lookAt);
      const hero = waypoints[0]!;
      posB.current.fromArray(hero.position);
      lookB.current.fromArray(hero.lookAt);

      cam.position.lerpVectors(posA.current, posB.current, eased);
      tmpLook.current.lerpVectors(lookA.current, lookB.current, eased);
      cam.lookAt(tmpLook.current);

      if (t >= 1) finishIntro();
      return;
    }

    // --- Ready phase: scroll-driven (Phase 3 logic) ---
    if (total < 1) return;

    const p = clamp01(progress);
    const segment = Math.min(Math.floor(p * total), total - 1);
    const localT = p * total - segment;
    const eased = easeInOutCubic(clamp01(localT));

    const a = waypoints[segment]!;
    const b = waypoints[segment + 1]!;

    posA.current.fromArray(a.position);
    posB.current.fromArray(b.position);
    lookA.current.fromArray(a.lookAt);
    lookB.current.fromArray(b.lookAt);

    cam.position.lerpVectors(posA.current, posB.current, eased);
    tmpLook.current.lerpVectors(lookA.current, lookB.current, eased);
    cam.lookAt(tmpLook.current);
  });

  return null;
}

export function CameraDebugPublisher() {
  const camera = useThree((state) => state.camera);
  const forward = useRef(new THREE.Vector3());

  useFrame(() => {
    const win = window as unknown as {
      __debugCamera?: { position: [number, number, number]; lookAt: [number, number, number] };
    };
    camera.getWorldDirection(forward.current);
    const look: [number, number, number] = [
      camera.position.x + forward.current.x * 5,
      camera.position.y + forward.current.y * 5,
      camera.position.z + forward.current.z * 5,
    ];
    win.__debugCamera = {
      position: [camera.position.x, camera.position.y, camera.position.z],
      lookAt: look,
    };
  });

  return null;
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/camera/CameraRig.tsx && git commit -m "feat: CameraRig handles loading/intro/ready phases via state machine"
```

---

### Task 4: Stop Lenis during `loading` and `intro`

- [ ] **Step 1: Update `LenisProvider.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/contexts/LenisProvider.tsx`

```tsx
import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { LenisContext, type LenisContextValue } from './lenisContext';
import { useScrollStore } from '@/stores/scrollStore';

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Start stopped — Preloader will release once intro completes.
    lenis.stop();

    const handleScroll = ({ progress }: { progress: number }) => {
      useScrollStore.getState().setProgress(progress);
    };
    lenis.on('scroll', handleScroll);
    useScrollStore.getState().setProgress(lenis.progress ?? 0);

    // React to introState changes — start scrolling once ready, stop otherwise.
    const unsub = useScrollStore.subscribe((state, prev) => {
      if (state.introState !== prev.introState) {
        if (state.introState === 'ready') lenis.start();
        else lenis.stop();
      }
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', handleScroll);
      unsub();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo: LenisContextValue['scrollTo'] = (target, options) => {
    lenisRef.current?.scrollTo(target, options);
  };

  return <LenisContext.Provider value={{ scrollTo }}>{children}</LenisContext.Provider>;
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/contexts/LenisProvider.tsx && git commit -m "feat: lock Lenis during loading/intro, unlock on ready"
```

---

### Task 5: Create the `Preloader` component

Full-screen cyan HUD with brand glyph, rotating status text, and a progress bar. Combines drei `useProgress` with a synthetic timer. Triggers `startIntro()` on completion.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/Preloader.tsx`

```tsx
import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
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
  const startIntro = useScrollStore((s) => s.startIntro);
  const { progress: assetProgress, active: assetsActive } = useProgress();

  const [t, setT] = useState(0);            // synthetic progress 0..1
  const [statusIdx, setStatusIdx] = useState(0);
  const [hidden, setHidden] = useState(false);

  // Synthetic progress timer 0..1
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

  // Cycle the status line
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_LINES.length);
    }, 380);
    return () => clearInterval(interval);
  }, []);

  // Trigger intro when synthetic+real are complete and min visible time elapsed
  useEffect(() => {
    const ready =
      t >= 1 &&
      !assetsActive &&
      (assetProgress === 0 || assetProgress >= 100);

    if (!ready) return;

    const timer = window.setTimeout(() => {
      startIntro();
    }, Math.max(0, MIN_VISIBLE_MS - SYNTH_DURATION_MS));
    return () => window.clearTimeout(timer);
  }, [t, assetProgress, assetsActive, startIntro]);

  // Fade out when leaving 'loading'
  useEffect(() => {
    if (introState === 'loading') return;
    const timer = window.setTimeout(() => setHidden(true), FADE_OUT_MS + 50);
    return () => window.clearTimeout(timer);
  }, [introState]);

  if (hidden) return null;

  // Display progress: synthetic visual, capped by real asset progress when applicable
  const displayPct =
    Math.min(t * 100, assetsActive && assetProgress > 0 ? assetProgress : 100);

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
      {/* Brand glyph */}
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

      {/* Status line */}
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

      {/* Progress bar */}
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

      {/* Percentage */}
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
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/Preloader.tsx && git commit -m "feat: add Preloader with progress bar and rotating status text"
```

---

### Task 6: Mount `Preloader` in `Home`

- [ ] **Step 1: Update `Home.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Home.tsx`

```tsx
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Scene from '@/three/Scene';
import CameraDebugOverlay from '@/three/dev/CameraDebugOverlay';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';

export default function Home() {
  return (
    <>
      <Scene />
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

- [ ] **Step 2: Type-check + production build + lint**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && rm -rf dist && npm run build 2>&1 | tail -8 && npm run lint 2>&1 | tail -10
```
Expected: all clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Home.tsx && git commit -m "feat: mount Preloader in Home"
```

---

### Task 7: Final verification

- [ ] **Step 1: Smoke-test dev server**

```bash
pkill -f "vite" 2>/dev/null; sleep 1; export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && (npm run dev > /tmp/p26.log 2>&1 & echo $! > /tmp/p26.pid) && sleep 5 && curl -s -o /dev/null -w "/ → HTTP %{http_code}\n" http://localhost:5173/ ; kill $(cat /tmp/p26.pid) 2>/dev/null
```
Expected: HTTP 200.

- [ ] **Step 2: Manual browser verification**

```bash
cd /Users/oscarortega/projects/portfolio-2026 && npm run dev
```

Hard-refresh `http://localhost:5173/` (Cmd+Shift+R).

- [ ] **Preloader appears immediately** on load — full-screen cyan HUD with brand glyph "OO/2026" + rotating status line + progress bar climbing to 100%
- [ ] **Scroll is locked** during the preloader (try scrolling — page should not move)
- [ ] **At ~1.2–1.4s** the bar reaches 100%, the preloader fades out (~450ms)
- [ ] **Camera dolly**: as the preloader fades, the 3D camera "flies in" toward the astronaut (forward dolly from a pulled-back, lower start to the hero waypoint)
- [ ] **After the dolly completes (~1.5s)** scroll unlocks. Try scrolling — Lenis works again, sections animate normally
- [ ] **Hero AppearingText reveals** play as soon as the preloader fades (greeting + name appear word-by-word)
- [ ] **Subsequent navigation** (clicking nav links, language switch) still works
- [ ] **Pressing D** still toggles dev camera mode normally (after ready)
- [ ] **DevTools console**: no new errors

- [ ] **Step 3: If anything is off, report**; otherwise Phase 6 is complete.

---

## Phase 6 Deliverable

- Full-screen cyan HUD preloader: brand glyph + rotating status text + progress bar + percentage
- Synthetic progress (~1.4s) combined with drei `useProgress` (asset readiness)
- Smooth fade-out of the preloader (450ms)
- Camera dolly forward from intro-start to hero waypoint (1500ms easeInOutCubic)
- Lenis locked during loading + intro, unlocked on ready
- Three-state machine (`loading | intro | ready`) coordinates everything
- Build, type-check, lint all clean

**Next phase:** `2026-05-21-phase-7-mobile-perf.md` — mobile / performance pass (reduced quality already in place, but expand it: dynamic dpr based on FPS, lazy-load Scene if needed, Lighthouse pass, real-device test).
