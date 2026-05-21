# Phase 2 — Base 3D Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mount a React Three Fiber `<Canvas>` as a fixed full-viewport background behind the existing Phase 1 single-page content, and populate it with a static (no scroll camera yet) scene: stars skybox, cyan grid floor (custom shader), low-poly procedural astronaut floating gently, cyan-tinted lighting, and a base bloom postprocessing pass. The result is the same Phase 1 page but now with a living 3D scene behind every section.

**Architecture:** A `Scene` component composes the `<Canvas>` with all scene objects under `Suspense`. The canvas sits `position: fixed; inset: 0; z-index: 0; pointer-events: none` (pointer interactions are added in Phase 4). All `<main>` content is forced to a higher stacking context so it overlays the canvas without conflict. The camera is static at `waypoints[0]` (hero position). Astronaut is procedural for now — a small group of primitives wrapped in drei's `<Float>` — easily swappable for a GLB later. The grid floor uses a custom shader written inline in TS (no `vite-plugin-glsl` needed for this single shader). Postprocessing is bloom-only; chromatic / vignette come in Phase 5. A `useReducedQuality` hook detects low-power devices and degrades bloom + grid quality.

**Tech Stack:** `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`. ShaderMaterial inline (no glsl-loader plugin).

**Spec:** `docs/superpowers/specs/2026-05-21-portfolio-2026-design.md`

---

## File map

**Created:**
- `src/three/Scene.tsx` — root `<Canvas>` composition
- `src/three/hooks/useReducedQuality.ts` — perf flag
- `src/three/lighting/Lighting.tsx`
- `src/three/objects/Stars.tsx` — wraps drei's `<Stars>`
- `src/three/objects/GridFloor.tsx` — shader plane
- `src/three/objects/Astronaut.tsx` — procedural body for now
- `src/three/effects/Postprocessing.tsx` — bloom

**Modified:**
- `src/sections/Home.tsx` — mounts `<Scene />` as background sibling of `<main>`
- `src/styles/globals.css` — adds `position: relative; z-index: 10` to `<main>` (already content layer per tokens)

---

## Tasks

### Task 1: Create `useReducedQuality` perf hook

A small client-only hook that returns `true` when we should ship a lighter scene. Used by Postprocessing in this phase; reused by Particles in Phase 5.

- [ ] **Step 1: Create the hook**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/hooks/useReducedQuality.ts`

```ts
import { useEffect, useState } from 'react';

function evaluate(): boolean {
  if (typeof window === 'undefined') return false;
  const narrow = window.matchMedia('(max-width: 767px)').matches;
  const lowCores = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) < 4;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return narrow || lowCores || reducedMotion;
}

export function useReducedQuality(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => evaluate());

  useEffect(() => {
    const onResize = () => setReduced(evaluate());
    window.addEventListener('resize', onResize);
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionMq.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      motionMq.removeEventListener('change', onResize);
    };
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/hooks/useReducedQuality.ts && git commit -m "feat: add useReducedQuality perf hook"
```

---

### Task 2: Create the `Lighting` component

A small cluster of lights that give the cyan / holographic tint to whatever is in the scene.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/lighting/Lighting.tsx`

```tsx
export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#0a1224" />

      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#22d3ee"
      />

      <pointLight
        position={[-3, 3, 2]}
        intensity={1.5}
        color="#00d4ff"
        distance={12}
        decay={1.5}
      />

      <pointLight
        position={[2, 4, -2]}
        intensity={0.8}
        color="#67e8f9"
        distance={10}
        decay={2}
      />
    </>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/lighting/Lighting.tsx && git commit -m "feat: add cyan-tinted Lighting setup"
```

---

### Task 3: Create the `Stars` background

Thin wrapper around drei's `<Stars>` with our tuning.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/objects/Stars.tsx`

```tsx
import { Stars as DreiStars } from '@react-three/drei';

export default function Stars() {
  return (
    <DreiStars
      radius={60}
      depth={80}
      count={1200}
      factor={3.5}
      saturation={0}
      fade
      speed={0.3}
    />
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/objects/Stars.tsx && git commit -m "feat: add Stars skybox"
```

---

### Task 4: Create the `GridFloor` with custom shader

A horizontal plane with a custom fragment shader drawing cyan grid lines that fade radially.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/objects/GridFloor.tsx`

```tsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uDensity;

void main() {
  vec2 uv = vUv * uDensity;
  vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
  float line = min(grid.x, grid.y);
  float gridAlpha = 1.0 - min(line, 1.0);

  // radial fade from center
  float dist = length(vUv - 0.5);
  float fade = 1.0 - smoothstep(0.15, 0.5, dist);

  // subtle time-driven pulse
  float pulse = 0.85 + 0.15 * sin(uTime * 0.6);

  float alpha = gridAlpha * fade * pulse * 0.5;
  if (alpha < 0.01) discard;

  gl_FragColor = vec4(uColor, alpha);
}
`;

type Props = {
  size?: number;
  density?: number;
};

export default function GridFloor({ size = 40, density = 36 }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#00d4ff') },
      uDensity: { value: density },
    }),
    [density],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/objects/GridFloor.tsx && git commit -m "feat: add GridFloor with custom shader"
```

---

### Task 5: Create the procedural `Astronaut`

Low-poly astronaut built from primitives, wrapped in drei's `<Float>` for idle motion. Designed so the user can later replace the inner primitives with `useGLTF('/models/astronaut.glb')` without changing surrounding wiring.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/objects/Astronaut.tsx`

```tsx
import { Float } from '@react-three/drei';

// Replace the contents of <AstronautModel /> with `useGLTF('/models/astronaut.glb')`
// in a later phase when a CC0/CC-BY astronaut model is added to public/models/.
function AstronautModel() {
  return (
    <group>
      {/* Helmet */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#0a1224"
          metalness={0.85}
          roughness={0.15}
          emissive="#00d4ff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 1.08, 0.18]}>
        <sphereGeometry args={[0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#00d4ff"
          metalness={1}
          roughness={0.05}
          emissive="#00d4ff"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.36, 0.8, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 0.2, -0.32]}>
        <boxGeometry args={[0.6, 0.7, 0.25]} />
        <meshStandardMaterial color="#67e8f9" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Backpack lights */}
      <mesh position={[-0.18, 0.45, -0.46]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.18, 0.45, -0.46]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 12]}>
        <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.2, -0.85, 0]}>
        <capsuleGeometry args={[0.14, 0.6, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.2, -0.85, 0]}>
        <capsuleGeometry args={[0.14, 0.6, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Astronaut() {
  return (
    <Float
      speed={1.2}
      rotationIntensity={0.3}
      floatIntensity={0.6}
      position={[0, 0.5, 0]}
    >
      <AstronautModel />
    </Float>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/objects/Astronaut.tsx && git commit -m "feat: add procedural Astronaut with Float"
```

---

### Task 6: Create the `Postprocessing` component (bloom)

Single-pass bloom that respects reduced-quality mode.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/effects/Postprocessing.tsx`

```tsx
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useReducedQuality } from '@/three/hooks/useReducedQuality';

export default function Postprocessing() {
  const reduced = useReducedQuality();

  return (
    <EffectComposer multisampling={reduced ? 0 : 2}>
      <Bloom
        intensity={reduced ? 0.5 : 0.9}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
    </EffectComposer>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/effects/Postprocessing.tsx && git commit -m "feat: add Postprocessing with bloom"
```

---

### Task 7: Create the `Scene` root

Mounts the `<Canvas>` with all scene objects inside `<Suspense>`. Pointer events are disabled on the canvas DOM element for Phase 2 (re-enabled in Phase 4).

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/Scene.tsx`

```tsx
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Lighting from './lighting/Lighting';
import Stars from './objects/Stars';
import GridFloor from './objects/GridFloor';
import Astronaut from './objects/Astronaut';
import Postprocessing from './effects/Postprocessing';

export default function Scene() {
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
        camera={{ position: [0, 1.5, 8], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[0x050a14]} />
        <fog attach="fog" args={[0x050a14, 12, 35]} />

        <Suspense fallback={null}>
          <Lighting />
          <Stars />
          <GridFloor />
          <Astronaut />
          <Postprocessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/Scene.tsx && git commit -m "feat: add Scene root with Canvas, lighting, stars, grid, astronaut, bloom"
```

---

### Task 8: Mount `<Scene />` in `<Home />` and layer content above

- [ ] **Step 1: Update `Home.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Home.tsx`

```tsx
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Scene from '@/three/Scene';
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
    </>
  );
}
```

- [ ] **Step 2: Ensure body lets the canvas show through**

The body already has `background: var(--bg-base)` from `globals.css`. The Canvas covers the entire viewport `fixed`, but since the canvas itself has `<color attach="background" args={[0x050a14]} />` set, body background is hidden under it. That's fine. No changes needed to `globals.css`.

- [ ] **Step 3: Type-check + production build**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && rm -rf dist && npm run build 2>&1 | tail -15
```
Expected: type-check passes; build succeeds. JS bundle grows noticeably (three + R3F + drei + postprocessing now actually used — expect ~1 MB JS / ~300 KB gzip, which is normal for R3F).

- [ ] **Step 4: Lint**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npm run lint
```
Expected: no errors.

- [ ] **Step 5: Smoke-test dev server**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && (npm run dev > /tmp/p26.log 2>&1 & echo $! > /tmp/p26.pid) && sleep 5 && curl -s -o /dev/null -w "/ → HTTP %{http_code}\n" http://localhost:5173/ ; kill $(cat /tmp/p26.pid) 2>/dev/null ; tail -5 /tmp/p26.log
```
Expected: HTTP 200. No errors in log.

- [ ] **Step 6: Commit**

```bash
git add src/sections/Home.tsx && git commit -m "feat: mount 3D Scene as fixed background of Home"
```

---

### Task 9: Manual visual verification (human gate)

- [ ] **Step 1: Run dev server interactively**

```bash
cd /Users/oscarortega/projects/portfolio-2026 && npm run dev
```

- [ ] **Step 2: Browser checks at `http://localhost:5173/`**

- [ ] **Background**: dark scene with faint stars drifting visible behind the Hero
- [ ] **Astronaut**: low-poly cyan-and-white astronaut centered, floating gently (visible bobbing + slight rotation from `<Float>`)
- [ ] **Helmet visor**: glowing cyan dome on the head, brighter than the rest
- [ ] **Grid floor**: cyan grid lines visible below the astronaut, fading radially outward, with a subtle pulse
- [ ] **Bloom**: cyan emissives (visor, backpack lights) softly glow
- [ ] **Content overlays**: Hero text + Navigation + sections all render on top of the 3D scene without occluding it; semi-transparent card backgrounds show grid/stars through them
- [ ] **Scroll**: Lenis smooth scroll still works; the 3D scene stays in place (no camera animation yet — that's Phase 3)
- [ ] **Nav anchors**: still scroll to correct sections smoothly
- [ ] **Lang switch**: still works
- [ ] **DevTools console**: no errors. (Warnings about `THREE.WebGLRenderer` or color management are OK if benign.)
- [ ] **DevTools Performance**: rough FPS check — should sit at or near 60 FPS on a modern laptop. If dropping, note it for Phase 7.
- [ ] **Mobile emulation (DevTools, ~390px)**: scene still renders; bloom downgraded (less halo); page remains usable.

- [ ] **Step 3: If anything looks off, report**; otherwise Phase 2 is complete.

---

## Phase 2 Deliverable

- Procedural astronaut floating gently with `<Float>`
- Stars skybox behind the astronaut
- Cyan grid floor with custom shader, radial fade, time pulse
- Cyan-tinted lighting (ambient + directional + 2 point lights)
- Single-pass bloom on emissives
- Scene rendered as fixed full-viewport background behind all sections
- Content overlays remain readable and functional
- Mobile / reduced-quality mode degrades bloom intensity and disables multisampling
- Build / type-check / lint clean

**Next phase:** `2026-05-21-phase-3-cinematic-camera.md` — scroll-driven camera moves between waypoints synced to Lenis.
