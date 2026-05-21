# Phase 3 — Cinematic Camera Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 3D camera move between five waypoints as the user scrolls, so each section (Hero, About, Experience, Projects, Contact) frames the astronaut from a distinct angle. Scroll progress is sourced from Lenis (already driving smooth scroll), published to a Zustand store, and consumed inside the R3F render loop by a `CameraRig` component that interpolates camera position + lookAt with `easeInOutCubic` between adjacent waypoints. A dev-only debug overlay (toggled with the `D` key) freezes the rig, mounts `<OrbitControls>` so you can fly the camera with the mouse, and displays the current position / lookAt as text — so you can tune waypoint coordinates visually and paste them back into `waypoints.ts`.

**Architecture:** Zustand store holds `progress` (0..1) as a non-reactive subscription target. `LenisProvider` subscribes to Lenis's `scroll` event and pushes `progress` on every tick. `CameraRig` runs inside `<Canvas>` and uses `useFrame` to read `progress` via `useScrollStore.getState()` (no rerender storm) and write camera transform. A `<PerspectiveCamera makeDefault>` from drei wires up the camera so the rig has a reference. Dev overlay is gated on `import.meta.env.DEV` and tree-shakes out of production builds.

**Tech Stack:** Zustand, Lenis (already installed), drei (`<PerspectiveCamera>`, `<OrbitControls>`), three.js `Vector3.lerpVectors`.

**Spec:** `docs/superpowers/specs/2026-05-21-portfolio-2026-design.md`

---

## File map

**Created:**
- `src/three/utils/easing.ts` — easeInOutCubic
- `src/stores/scrollStore.ts` — Zustand store for `progress` + dev mode flag
- `src/three/camera/waypoints.ts` — 5 waypoint data entries
- `src/three/camera/CameraRig.tsx` — interpolator
- `src/three/dev/CameraDebugOverlay.tsx` — HTML overlay (dev-only)

**Modified:**
- `src/contexts/LenisProvider.tsx` — push progress to scrollStore
- `src/three/Scene.tsx` — mount `<PerspectiveCamera makeDefault>` + `<CameraRig>` (+ `<OrbitControls>` when dev mode active)
- `src/sections/Home.tsx` — mount `<CameraDebugOverlay />` outside canvas (dev-only)

---

## Tasks

### Task 1: Create the easing utility

- [ ] **Step 1: Create the file**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/utils/easing.ts`

```ts
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function clamp01(t: number): number {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/utils/easing.ts && git commit -m "feat: add easeInOutCubic and clamp01 utilities"
```

---

### Task 2: Create the scroll store

A Zustand store holding the scroll progress (0..1) and a dev mode flag. Updates flow through `getState()` / `setState()` to avoid rerenders inside `useFrame`.

- [ ] **Step 1: Create the store**

File: `/Users/oscarortega/projects/portfolio-2026/src/stores/scrollStore.ts`

```ts
import { create } from 'zustand';

type ScrollState = {
  progress: number;
  devCameraMode: boolean;
  setProgress: (p: number) => void;
  toggleDevCameraMode: () => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  devCameraMode: false,
  setProgress: (progress) => set({ progress }),
  toggleDevCameraMode: () => set((s) => ({ devCameraMode: !s.devCameraMode })),
}));
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/stores/scrollStore.ts && git commit -m "feat: add Zustand scrollStore for progress and dev camera flag"
```

---

### Task 3: Push Lenis scroll progress into the store

Modify `LenisProvider` to subscribe to Lenis's scroll event and call `setProgress`.

- [ ] **Step 1: Update `LenisProvider.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/contexts/LenisProvider.tsx`

Replace the file with:

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

    const handleScroll = ({ progress }: { progress: number }) => {
      useScrollStore.getState().setProgress(progress);
    };
    lenis.on('scroll', handleScroll);

    // Seed initial progress (in case page loads scrolled)
    useScrollStore.getState().setProgress(lenis.progress ?? 0);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', handleScroll);
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
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/contexts/LenisProvider.tsx && git commit -m "feat: pipe Lenis scroll progress into scrollStore"
```

---

### Task 4: Define the waypoint data

Initial coordinates — they will be tuned visually using the dev overlay in Task 7.

- [ ] **Step 1: Create the file**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/camera/waypoints.ts`

```ts
import type { Waypoint } from '@/types/three';

// Initial guesses — tune visually with the dev camera overlay (Task 7).
// Press 'D' in the running site to enter dev mode, fly the camera with the
// mouse, then copy `pos`/`look` values from the on-screen readout into here.
export const waypoints: Waypoint[] = [
  // hero — head-on, default
  { key: 'hero',       position: [0, 1.5,  8], lookAt: [0, 1, 0] },

  // about — orbit right, slight high angle
  { key: 'about',      position: [4, 2.2,  6], lookAt: [0, 1, 0] },

  // experience — orbit far right behind, looking past astronaut
  { key: 'experience', position: [5, 1.5, -2], lookAt: [0, 1, 0] },

  // projects — orbit left, low angle looking up
  { key: 'projects',   position: [-4, 0.6, 5], lookAt: [0, 1.4, 0] },

  // contact — pulled back & up
  { key: 'contact',    position: [0, 4,   12], lookAt: [0, 0.5, 0] },
];
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/camera/waypoints.ts && git commit -m "feat: add initial 5-waypoint camera data"
```

---

### Task 5: Create the `CameraRig` component

Interpolates camera position + lookAt between adjacent waypoints based on scroll progress. Pauses when dev camera mode is active.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/camera/CameraRig.tsx`

```tsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { waypoints } from './waypoints';
import { easeInOutCubic, clamp01 } from '@/three/utils/easing';
import { useScrollStore } from '@/stores/scrollStore';

export default function CameraRig() {
  // Reusable vectors to avoid GC pressure inside useFrame
  const posA = useRef(new THREE.Vector3());
  const posB = useRef(new THREE.Vector3());
  const lookA = useRef(new THREE.Vector3());
  const lookB = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  const total = useMemo(() => waypoints.length - 1, []);

  useFrame((state) => {
    const { progress, devCameraMode } = useScrollStore.getState();
    if (devCameraMode) return;
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

    state.camera.position.lerpVectors(posA.current, posB.current, eased);
    tmpLook.current.lerpVectors(lookA.current, lookB.current, eased);
    state.camera.lookAt(tmpLook.current);
  });

  return null;
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/camera/CameraRig.tsx && git commit -m "feat: add CameraRig interpolating between waypoints by scroll"
```

---

### Task 6: Mount the rig and a debuggable PerspectiveCamera in `Scene`

Switch from the static `camera` prop on `<Canvas>` to an explicit `<PerspectiveCamera makeDefault>` so the rig and OrbitControls can both target it. Mount `<CameraRig>` always; conditionally mount `<OrbitControls>` when devCameraMode is on.

- [ ] **Step 1: Update `Scene.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/Scene.tsx`

```tsx
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Lighting from './lighting/Lighting';
import Stars from './objects/Stars';
import GridFloor from './objects/GridFloor';
import Astronaut from './objects/Astronaut';
import Postprocessing from './effects/Postprocessing';
import CameraRig from './camera/CameraRig';
import { waypoints } from './camera/waypoints';
import { useScrollStore } from '@/stores/scrollStore';

export default function Scene() {
  const devCameraMode = useScrollStore((s) => s.devCameraMode);
  const initial = waypoints[0]!;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
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
          <Astronaut />
          <CameraRig />
          {devCameraMode && (
            <OrbitControls
              enablePan
              enableDamping
              dampingFactor={0.08}
              target={initial.lookAt}
            />
          )}
          <Postprocessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: When dev mode is on, the canvas must accept pointer events for OrbitControls**

Without this, the mouse drags pass through to the HTML below and OrbitControls can't capture them. Add a conditional override.

Replace the wrapper `<div>` opening tag in Scene.tsx with a derived `pointerEvents` style:

```tsx
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: devCameraMode ? 20 : 0,
        pointerEvents: devCameraMode ? 'auto' : 'none',
      }}
    >
```

(Replacing only the `style` block. Keep the rest of the component as written in Step 1.)

- [ ] **Step 3: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/Scene.tsx && git commit -m "feat: mount CameraRig + dev OrbitControls in Scene"
```

---

### Task 7: Create the dev camera debug overlay

Dev-only HTML overlay listening for the `D` key. When active, displays the current camera position + lookAt as text the user can copy.

- [ ] **Step 1: Create the overlay component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/dev/CameraDebugOverlay.tsx`

```tsx
import { useEffect, useState } from 'react';
import { useScrollStore } from '@/stores/scrollStore';

type CameraSnapshot = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

export default function CameraDebugOverlay() {
  const devCameraMode = useScrollStore((s) => s.devCameraMode);
  const toggleDevCameraMode = useScrollStore((s) => s.toggleDevCameraMode);
  const [snapshot, setSnapshot] = useState<CameraSnapshot | null>(null);

  // Toggle on 'D' key (only in dev builds)
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in an input
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (e.key === 'd' || e.key === 'D') {
        toggleDevCameraMode();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleDevCameraMode]);

  // Poll camera state when dev mode is on. We read it through a global ref
  // that Scene exposes via window — set up below.
  useEffect(() => {
    if (!devCameraMode) {
      setSnapshot(null);
      return;
    }
    const id = setInterval(() => {
      const cam = (window as unknown as { __debugCamera?: CameraSnapshot }).__debugCamera;
      if (cam) {
        setSnapshot({
          position: [cam.position[0], cam.position[1], cam.position[2]],
          lookAt:   [cam.lookAt[0],   cam.lookAt[1],   cam.lookAt[2]],
        });
      }
    }, 100);
    return () => clearInterval(id);
  }, [devCameraMode]);

  if (!import.meta.env.DEV) return null;
  if (!devCameraMode) return null;

  const fmt = (n: number) => n.toFixed(2);
  const posStr = snapshot ? `[${fmt(snapshot.position[0])}, ${fmt(snapshot.position[1])}, ${fmt(snapshot.position[2])}]` : '—';
  const lookStr = snapshot ? `[${fmt(snapshot.lookAt[0])}, ${fmt(snapshot.lookAt[1])}, ${fmt(snapshot.lookAt[2])}]` : '—';

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 9990,
        padding: '12px 14px',
        background: 'rgba(5, 10, 20, 0.92)',
        border: '1px solid rgba(0, 212, 255, 0.5)',
        boxShadow: 'var(--cyan-glow)',
        color: 'var(--cyan-100)',
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        fontSize: 12,
        lineHeight: 1.5,
        borderRadius: 6,
        pointerEvents: 'none',
        minWidth: 280,
      }}
    >
      <div style={{ color: 'var(--cyan-400)', marginBottom: 6 }}>
        DEV CAMERA — press D to exit
      </div>
      <div>position: {posStr}</div>
      <div>lookAt:   {lookStr}</div>
      <div style={{ marginTop: 6, opacity: 0.65 }}>
        Drag mouse to orbit, scroll wheel to zoom.<br />
        Copy values into <code>waypoints.ts</code>.
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Expose camera state to the overlay via `window.__debugCamera`**

The cleanest way to share the camera state between R3F (inside Canvas) and the HTML overlay (outside Canvas) is via a tiny helper component inside the scene that writes to `window.__debugCamera` every frame when dev mode is on.

Update `src/three/camera/CameraRig.tsx` — add a separate exported component for the dev publisher. Rewrite the file:

```tsx
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { waypoints } from './waypoints';
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
    const { progress, devCameraMode } = useScrollStore.getState();
    if (devCameraMode) return;
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

    state.camera.position.lerpVectors(posA.current, posB.current, eased);
    tmpLook.current.lerpVectors(lookA.current, lookB.current, eased);
    state.camera.lookAt(tmpLook.current);
  });

  return null;
}

/**
 * Writes the live camera state to window.__debugCamera so the HTML overlay
 * (outside the Canvas) can display it. Only renders when devCameraMode is on
 * and only in dev builds. Tree-shakes out of production.
 */
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

- [ ] **Step 3: Mount `CameraDebugPublisher` in `Scene.tsx`**

Inside the Suspense block, after `<CameraRig />`, add:

```tsx
{devCameraMode && import.meta.env.DEV && <CameraDebugPublisher />}
```

And add the import at the top of `Scene.tsx`:

```tsx
import CameraRig, { CameraDebugPublisher } from './camera/CameraRig';
```

(remove the previous `import CameraRig from './camera/CameraRig';` line)

- [ ] **Step 4: Mount `CameraDebugOverlay` in `Home.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Home.tsx`

```tsx
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Scene from '@/three/Scene';
import CameraDebugOverlay from '@/three/dev/CameraDebugOverlay';
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
      <CameraDebugOverlay />
    </>
  );
}
```

- [ ] **Step 5: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/camera/CameraRig.tsx src/three/dev/CameraDebugOverlay.tsx src/three/Scene.tsx src/sections/Home.tsx && git commit -m "feat: add dev camera overlay (D key) with OrbitControls and live readout"
```

---

### Task 8: Final verification

- [ ] **Step 1: Type-check + production build + lint**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && rm -rf dist && npm run build 2>&1 | tail -10 && npm run lint 2>&1 | tail -10
```
Expected: type-check passes, build succeeds (bundle similar to Phase 2 + a few KB for zustand + drei controls), lint clean.

- [ ] **Step 2: Smoke-test dev server**

```bash
pkill -f "vite" 2>/dev/null; sleep 1; export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && (npm run dev > /tmp/p26.log 2>&1 & echo $! > /tmp/p26.pid) && sleep 5 && curl -s -o /dev/null -w "/ → HTTP %{http_code}\n" http://localhost:5173/ ; kill $(cat /tmp/p26.pid) 2>/dev/null
```
Expected: HTTP 200.

- [ ] **Step 3: Manual browser verification**

```bash
cd /Users/oscarortega/projects/portfolio-2026 && npm run dev
```

In `http://localhost:5173/`:

- [ ] **Scroll-driven camera**: scrolling smoothly moves the camera around the astronaut. At each section, the framing should change visibly. The transitions should be smooth (eased), not snappy.
- [ ] **Section ↔ waypoint correspondence**: at the top of the page the astronaut looks head-on (hero). As you scroll to About, the camera orbits right. Experience, the camera continues around behind/right. Projects, orbits left low. Contact, pulled back & up.
- [ ] **Reverse scroll**: scrolling back up reverses the camera smoothly.
- [ ] **Dev camera mode**: press `D`. The HUD overlay appears top-right with "DEV CAMERA — press D to exit" and live `position` / `lookAt` numbers. The CameraRig stops; the mouse can now drag-orbit. Scroll wheel zooms. Pressing `D` again exits.
- [ ] **Dev overlay tree-shakes out of production**: `npm run build && npm run preview`, open the preview, press D → nothing happens (overlay never mounts). (Optional check — saves on first ship.)
- [ ] **DevTools console**: no new errors. The THREE.Clock deprecation warning from Phase 2 may persist; benign.

- [ ] **Step 4: If anything is off, report**; otherwise Phase 3 is complete.

---

## Phase 3 Deliverable

- Lenis scroll progress published to a Zustand store
- Camera interpolates between 5 named waypoints with `easeInOutCubic`, synced to scroll progress, in `useFrame` (no React rerenders)
- Each section frames the astronaut from a distinct angle
- Dev-only overlay (D key) lets you fly the camera with `<OrbitControls>` and read coordinates for tuning `waypoints.ts`
- Production build excludes dev overlay (gated on `import.meta.env.DEV`)
- Build, type-check, lint all clean

**Next phase:** `2026-05-21-phase-4-hologram-cursor-text.md` — Hologram UI components (HologramCard / Button), custom cursor with 3D hover detection, typewriter for Hero, word-by-word text reveals.
