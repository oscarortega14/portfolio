# Phase 5 — Particles + Satellite + Postprocessing Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Multiply the cinematic feel of the scene without changing its structure. Add a layered cyan particle field (drei's `<Sparkles>` in two depths for parallax), a procedural satellite slowly rotating offset from the astronaut to anchor the "space station" idea, and a full postprocessing chain — bloom + chromatic aberration + slight desaturation + crushed blacks + vignette — with sensible degradation on reduced-quality devices.

**Architecture:** Two particle layers via drei `<Sparkles>` (near + far) inside the Suspense block. A new `<Satellite>` procedural model wrapped in drei's `<Float>` placed at fixed world coordinates so it's visible from multiple waypoints. Postprocessing chain replaces the bloom-only Phase 2 stack; `useReducedQuality` still degrades to bloom-only.

**Tech Stack:** `@react-three/drei` `<Sparkles>` / `<Float>`, `@react-three/postprocessing` (`Bloom`, `ChromaticAberration`, `HueSaturation`, `BrightnessContrast`, `Vignette`), `three.js` `Vector2` for offset typing.

**Spec:** `docs/superpowers/specs/2026-05-21-portfolio-2026-design.md`

---

## File map

**Created:**
- `src/three/objects/Particles.tsx` — two-layer particle wrapper
- `src/three/objects/Satellite.tsx` — procedural satellite

**Modified:**
- `src/three/effects/Postprocessing.tsx` — full effect chain
- `src/three/Scene.tsx` — mount Particles + Satellite

---

## Tasks

### Task 1: Create the `Particles` component

Two layers of drei `<Sparkles>`: a near, denser layer (dust right around the astronaut) and a far, sparser layer (deeper space, slower).

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/objects/Particles.tsx`

```tsx
import { Sparkles } from '@react-three/drei';
import { useReducedQuality } from '@/three/hooks/useReducedQuality';

export default function Particles() {
  const reduced = useReducedQuality();

  const nearCount = reduced ? 60 : 220;
  const farCount = reduced ? 0 : 120;

  return (
    <>
      {/* Near layer — bigger, more visible particles around the astronaut */}
      <Sparkles
        count={nearCount}
        scale={[14, 10, 14]}
        position={[0, 1, 0]}
        size={2.2}
        speed={0.25}
        opacity={0.85}
        noise={1.2}
        color="#00d4ff"
      />

      {/* Far layer — sparser, finer, more stationary; gives a sense of depth */}
      {farCount > 0 && (
        <Sparkles
          count={farCount}
          scale={[32, 18, 32]}
          position={[0, 2, -4]}
          size={1.1}
          speed={0.08}
          opacity={0.55}
          noise={0.4}
          color="#67e8f9"
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/objects/Particles.tsx && git commit -m "feat: add two-layer Particles using drei Sparkles"
```

---

### Task 2: Create the `Satellite` component

A small procedural satellite — central box body, two flat solar panels, a dish/antenna on top, blinking light at the tip. Floats gently and rotates slowly.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/objects/Satellite.tsx`

```tsx
import { useRef } from 'react';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Satellite() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <Float
      position={[-6.5, 3.5, -3]}
      speed={0.8}
      rotationIntensity={0.15}
      floatIntensity={0.35}
    >
      <group ref={groupRef} scale={0.55}>
        {/* Body */}
        <mesh>
          <boxGeometry args={[0.8, 0.5, 0.5]} />
          <meshStandardMaterial color="#e0fbff" metalness={0.4} roughness={0.45} />
        </mesh>

        {/* Solar panels — left */}
        <mesh position={[-1.1, 0, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.5]} />
          <meshStandardMaterial color="#0a1224" metalness={0.6} roughness={0.2} emissive="#00d4ff" emissiveIntensity={0.15} />
        </mesh>
        {/* Solar panel struts */}
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.08]} />
          <meshStandardMaterial color="#67e8f9" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Solar panels — right */}
        <mesh position={[1.1, 0, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.5]} />
          <meshStandardMaterial color="#0a1224" metalness={0.6} roughness={0.2} emissive="#00d4ff" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.08]} />
          <meshStandardMaterial color="#67e8f9" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Antenna mast */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
          <meshStandardMaterial color="#e0fbff" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Dish */}
        <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2.6, 0, 0]}>
          <coneGeometry args={[0.22, 0.18, 24, 1, true]} />
          <meshStandardMaterial color="#e0fbff" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>

        {/* Tip light — emissive */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={4} />
        </mesh>
      </group>
    </Float>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/objects/Satellite.tsx && git commit -m "feat: add procedural Satellite with solar panels and rotating dish"
```

---

### Task 3: Extend `Postprocessing` with the full effect chain

Replace the bloom-only chain with: bloom → chromatic aberration → hue/saturation desaturate → brightness/contrast crush → vignette. Reduced-quality mode keeps only bloom (matching Phase 2 behavior).

- [ ] **Step 1: Update the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/effects/Postprocessing.tsx`

```tsx
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  HueSaturation,
  BrightnessContrast,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useReducedQuality } from '@/three/hooks/useReducedQuality';

const chromaticOffset = new THREE.Vector2(0.0008, 0.0008);

export default function Postprocessing() {
  const reduced = useReducedQuality();

  if (reduced) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={0.95}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.4}
        mipmapBlur
      />

      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaticOffset}
        radialModulation={false}
        modulationOffset={0}
      />

      {/* Slightly desaturate to give a cinematic, less candy-cane look */}
      <HueSaturation
        blendFunction={BlendFunction.NORMAL}
        hue={0}
        saturation={-0.12}
      />

      {/* Crush the blacks slightly for depth */}
      <BrightnessContrast
        blendFunction={BlendFunction.NORMAL}
        brightness={-0.02}
        contrast={0.06}
      />

      <Vignette
        blendFunction={BlendFunction.NORMAL}
        offset={0.32}
        darkness={0.55}
      />
    </EffectComposer>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/effects/Postprocessing.tsx && git commit -m "feat: extend Postprocessing with chromatic aberration, grading, vignette"
```

---

### Task 4: Mount `Particles` and `Satellite` in `Scene`

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
import Satellite from './objects/Satellite';
import Particles from './objects/Particles';
import Postprocessing from './effects/Postprocessing';
import CameraRig, { CameraDebugPublisher } from './camera/CameraRig';
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
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + build + lint**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && rm -rf dist && npm run build 2>&1 | tail -8 && npm run lint 2>&1 | tail -10
```
Expected: all clean. Build size grows ~5-10KB (Sparkles + extra postprocessing passes).

- [ ] **Step 3: Commit**

```bash
git add src/three/Scene.tsx && git commit -m "feat: mount Particles + Satellite in Scene"
```

---

### Task 5: Final verification

- [ ] **Step 1: Smoke-test dev server**

```bash
pkill -f "vite" 2>/dev/null; sleep 1; export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && (npm run dev > /tmp/p26.log 2>&1 & echo $! > /tmp/p26.pid) && sleep 5 && curl -s -o /dev/null -w "/ → HTTP %{http_code}\n" http://localhost:5173/ ; kill $(cat /tmp/p26.pid) 2>/dev/null
```
Expected: HTTP 200.

- [ ] **Step 2: Manual browser verification**

```bash
cd /Users/oscarortega/projects/portfolio-2026 && npm run dev
```

In `http://localhost:5173/`:

- [ ] **Particles**: cyan motes drift around the astronaut — denser near layer + sparser far layer (visible as two depth tiers, like "dust around" + "dust in the distance")
- [ ] **Satellite**: a small satellite with solar panel wings + antenna dish + cyan tip light is visible offset behind and to the upper-left of the astronaut. It rotates slowly on its Y axis and floats gently.
- [ ] **Scroll**: as you scroll between waypoints, you may catch the satellite from different angles depending on the camera framing
- [ ] **Chromatic aberration**: edges of high-contrast objects (visor, backpack lights, particles) have a slight RGB fringe — subtle but noticeable
- [ ] **Vignette**: corners of the viewport are visibly darker than the center
- [ ] **Color**: scene feels slightly less saturated and the blacks are deeper than Phase 4
- [ ] **Bloom**: still glows on the visor and emissives
- [ ] **DevTools console**: no new errors
- [ ] **Performance**: still 60 FPS on a modern laptop. If dropping, note for Phase 7.

- [ ] **Step 3: If anything is off, report**; otherwise Phase 5 is complete.

---

## Phase 5 Deliverable

- Two-layer particle dust (near + far) drifting around the astronaut for sense of depth
- Procedural satellite with solar panels + antenna dish + cyan tip light, rotating + floating
- Full postprocessing chain: bloom + chromatic aberration + slight desaturation + black crush + vignette
- Reduced-quality mode still kicks in on mobile / low-end devices (bloom only)
- Build, type-check, lint all clean

**Next phase:** `2026-05-21-phase-6-preloader-intro.md` — Preloader with progress bar + cinematic intro reveal (camera dolly + Hero text reveal) gated on asset loading.
