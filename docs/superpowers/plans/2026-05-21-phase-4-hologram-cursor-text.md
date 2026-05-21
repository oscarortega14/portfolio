# Phase 4 — Hologram UI + Custom Cursor + Text Reveals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Phase 3 page from "content on top of a 3D scene" into "in-universe HUD" by adding the four signature ingredients of the spec: (1) hologram card / button primitives with clip-path notched corners and cyan glow, (2) a custom cursor that lerps to the mouse and changes state when hovering links or the 3D astronaut (via R3F raycaster), (3) a typewriter cycling Hero roles, and (4) word-by-word text reveals on section titles tied to scroll-in via Framer Motion. Then apply these primitives across the existing five sections.

**Architecture:** Cursor state lives in a tiny Zustand store (`cursorStore`) so it can be written from both HTML (mouse handlers on links/buttons) and from inside the R3F Canvas (`onPointerOver`/`onPointerOut` on the astronaut group). The canvas DOM element gets `pointer-events: auto` (was `none`); the wrapper div lets HTML elements still catch their own events because they're stacked above the canvas via z-index. The hologram primitives are CSS-only — clip-path defines the notched corners, box-shadow provides the glow, backdrop-filter blurs the background. Framer Motion drives the text reveals via `whileInView` with word stagger. Typewriter is plain React state with `setTimeout`.

**Tech Stack:** Framer Motion (already installed), Zustand (already installed), CSS clip-path, R3F pointer events on a group.

**Spec:** `docs/superpowers/specs/2026-05-21-portfolio-2026-design.md`

---

## File map

**Created:**
- `src/stores/cursorStore.ts`
- `src/components/CustomCursor.tsx`
- `src/hooks/useCursorHover.ts`
- `src/components/HologramCard.tsx`
- `src/components/HologramButton.tsx`
- `src/components/Typewriter.tsx`
- `src/components/AppearingText.tsx`

**Modified:**
- `src/three/Scene.tsx` — allow canvas pointer events in non-dev mode
- `src/three/objects/Astronaut.tsx` — onPointerOver / onPointerOut → cursorStore
- `src/sections/Home.tsx` — mount CustomCursor
- `src/sections/Hero.tsx` — Typewriter on role line, HologramButton CTAs, AppearingText on name
- `src/sections/About.tsx` — HologramCard wrap, AppearingText title, useCursorHover on buttons
- `src/sections/Experience.tsx` — HologramCard per item, AppearingText title
- `src/sections/Projects.tsx` — HologramCard per project, AppearingText title
- `src/sections/Contact.tsx` — HologramCard wrap, HologramButton CTA, AppearingText title

---

## Tasks

### Task 1: Create the `cursorStore`

- [ ] **Step 1: Create the store**

File: `/Users/oscarortega/projects/portfolio-2026/src/stores/cursorStore.ts`

```ts
import { create } from 'zustand';

export type CursorState = 'default' | 'link' | 'three';

type CursorStoreShape = {
  state: CursorState;
  hoverCount: number;       // ref-counted so multiple overlapping hovers compose
  threeHover: boolean;      // separate flag for 3D hover
  setLinkHover: (on: boolean) => void;
  setThreeHover: (on: boolean) => void;
};

export const useCursorStore = create<CursorStoreShape>((set, get) => ({
  state: 'default',
  hoverCount: 0,
  threeHover: false,
  setLinkHover: (on) => {
    const next = Math.max(0, get().hoverCount + (on ? 1 : -1));
    set({
      hoverCount: next,
      state: get().threeHover ? 'three' : next > 0 ? 'link' : 'default',
    });
  },
  setThreeHover: (on) => {
    set({
      threeHover: on,
      state: on ? 'three' : get().hoverCount > 0 ? 'link' : 'default',
    });
  },
}));
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/stores/cursorStore.ts && git commit -m "feat: add cursorStore with link / three hover states"
```

---

### Task 2: Create `useCursorHover` hook

Returns mouse handlers to spread on any HTML element that should put the cursor into `link` mode while hovered.

- [ ] **Step 1: Create the hook**

File: `/Users/oscarortega/projects/portfolio-2026/src/hooks/useCursorHover.ts`

```ts
import { useCursorStore } from '@/stores/cursorStore';

export function useCursorHover() {
  const setLinkHover = useCursorStore((s) => s.setLinkHover);
  return {
    onMouseEnter: () => setLinkHover(true),
    onMouseLeave: () => setLinkHover(false),
  };
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/hooks/useCursorHover.ts && git commit -m "feat: add useCursorHover hook"
```

---

### Task 3: Create `CustomCursor`

A two-element cursor (dot + ring) that lerps to the mouse and grows when in `link` or `three` state. Disabled on touch devices.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/CustomCursor.tsx`

```tsx
import { useEffect, useRef } from 'react';
import { useCursorStore } from '@/stores/cursorStore';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Target (mouse) and lagged (ring) positions, plus dynamic ring scale.
  const target = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const ringScale = useRef(1);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip on touch / coarse pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.documentElement.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.18;
      if (ringRef.current) {
        const s = ringScale.current;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${s})`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    // Subscribe to cursor state for ring size / color. Scale is applied in the
    // raf loop; color is set directly (so it can transition smoothly via CSS).
    const unsub = useCursorStore.subscribe((state) => {
      ringScale.current = state.state === 'three' ? 2.2 : state.state === 'link' ? 1.6 : 1;
      if (!ringRef.current) return;
      const color = state.state === 'three' ? 'var(--cyan-500)' : 'rgba(224, 251, 255, 0.7)';
      ringRef.current.style.borderColor = color;
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.documentElement.style.cursor = '';
      unsub();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--cyan-500)',
          boxShadow: 'var(--cyan-glow)',
          pointerEvents: 'none',
          zIndex: 'var(--z-cursor)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1.5px solid rgba(224, 251, 255, 0.7)',
          pointerEvents: 'none',
          zIndex: 'var(--z-cursor)',
          willChange: 'transform',
          // Border color transitions smoothly; transform (incl. scale) is rAF-driven so no transition needed.
          transition: 'border-color 0.2s ease',
        }}
      />
    </>
  );
}
```

The ring scales smoothly because we update `ringScale.current` from a Zustand subscription and apply it inside the rAF loop on each frame, composed into the existing translate transform. Border color transitions via CSS for a softer feel.

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/CustomCursor.tsx && git commit -m "feat: add CustomCursor with lerp follow and state-driven styling"
```

---

### Task 4: Mount `CustomCursor` in `Home`

- [ ] **Step 1: Update `Home.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Home.tsx`

```tsx
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Scene from '@/three/Scene';
import CameraDebugOverlay from '@/three/dev/CameraDebugOverlay';
import CustomCursor from '@/components/CustomCursor';
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
      <CameraDebugOverlay />
    </>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/sections/Home.tsx && git commit -m "feat: mount CustomCursor in Home"
```

---

### Task 5: Enable canvas pointer events and add 3D hover detection

Currently the canvas wrapper has `pointer-events: none`. Switch to allowing pointer events on the canvas, so R3F's raycaster fires `onPointerOver` on the astronaut. HTML stacking (z-index 10 vs 0) still ensures clicks on HTML elements work because they catch the event first.

- [ ] **Step 1: Update `Scene.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/Scene.tsx`

Replace the wrapper `<div>` style block:

```tsx
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: devCameraMode ? 20 : 0,
        // Normal: canvas catches pointer only where no HTML overlay sits above (z stacking).
        // Dev: canvas above everything to grab OrbitControls input freely.
      }}
    >
```

(Drop the `pointerEvents` style entirely. The canvas DOM defaults to pointer-events auto.)

- [ ] **Step 2: Add pointer handlers to `Astronaut`**

File: `/Users/oscarortega/projects/portfolio-2026/src/three/objects/Astronaut.tsx`

At the top of the file, add the import:

```tsx
import { useCursorStore } from '@/stores/cursorStore';
```

Wrap the outer `<Float>` group with pointer handlers. Replace the `Astronaut` function body with:

```tsx
export default function Astronaut() {
  const setThreeHover = useCursorStore((s) => s.setThreeHover);

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.3}
      floatIntensity={0.6}
      position={[0, 0.5, 0]}
    >
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setThreeHover(true);
          document.body.style.cursor = 'none';
        }}
        onPointerOut={() => {
          setThreeHover(false);
        }}
      >
        <AstronautModel />
      </group>
    </Float>
  );
}
```

- [ ] **Step 3: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/three/Scene.tsx src/three/objects/Astronaut.tsx && git commit -m "feat: enable canvas pointer events + Astronaut hover triggers cursor 'three' state"
```

---

### Task 6: Create `HologramCard` primitive

A reusable container with clip-path notched corners, cyan border + glow, and backdrop blur. Variants: `compact` (small notch, less padding) and `full` (bigger notch, more padding).

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/HologramCard.tsx`

```tsx
import type { ReactNode, CSSProperties } from 'react';

type Variant = 'compact' | 'full';

type HologramCardProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
};

// Notched-corner shapes via clip-path. The notch cuts at top-left and bottom-right.
const clipFull = `polygon(
  0% 14px, 14px 0%,
  100% 0%,
  100% calc(100% - 14px),
  calc(100% - 14px) 100%,
  0% 100%
)`;

const clipCompact = `polygon(
  0% 8px, 8px 0%,
  100% 0%,
  100% calc(100% - 8px),
  calc(100% - 8px) 100%,
  0% 100%
)`;

export default function HologramCard({ children, variant = 'full', className, style }: HologramCardProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        padding: variant === 'full' ? '24px 28px' : '14px 18px',
        background: 'rgba(10, 18, 36, 0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        clipPath: variant === 'full' ? clipFull : clipCompact,
        boxShadow:
          'inset 0 0 0 1px rgba(0, 212, 255, 0.35), 0 0 24px rgba(0, 212, 255, 0.12)',
        color: 'var(--cyan-100)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/HologramCard.tsx && git commit -m "feat: add HologramCard with clip-path corners and glow"
```

---

### Task 7: Create `HologramButton`

Angular notched-corner button with an arrow icon that translates on hover. Variants: `primary` (filled cyan), `outline` (transparent with cyan border).

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/HologramButton.tsx`

```tsx
import { useState, type ReactNode } from 'react';
import { useCursorHover } from '@/hooks/useCursorHover';

type Variant = 'primary' | 'outline';

type CommonProps = {
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
  className?: string;
};

type AnchorProps = CommonProps & {
  as: 'a';
  href: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

type ButtonProps = CommonProps & {
  as?: 'button';
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type HologramButtonProps = AnchorProps | ButtonProps;

const clip = `polygon(
  0% 10px, 10px 0%,
  100% 0%,
  100% calc(100% - 10px),
  calc(100% - 10px) 100%,
  0% 100%
)`;

export default function HologramButton(props: HologramButtonProps) {
  const variant: Variant = props.variant ?? 'primary';
  const cursor = useCursorHover();
  const [hover, setHover] = useState(false);

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 22px',
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    cursor: 'pointer',
    clipPath: clip,
    transition: 'background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
    border: 'none',
  };

  const styleByVariant: React.CSSProperties =
    variant === 'primary'
      ? {
          background: hover ? 'var(--cyan-100)' : 'var(--cyan-500)',
          color: 'var(--bg-base)',
          boxShadow: hover ? 'var(--cyan-glow-strong)' : 'var(--cyan-glow)',
        }
      : {
          background: hover ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
          color: hover ? 'var(--cyan-100)' : 'var(--cyan-300)',
          boxShadow: 'inset 0 0 0 1px rgba(0, 212, 255, 0.5)',
        };

  const innerArrow = (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        transform: hover ? 'translateX(4px)' : 'translateX(0)',
        transition: 'transform 0.18s ease',
      }}
    >
      ›
    </span>
  );

  const handlers = {
    onMouseEnter: () => {
      setHover(true);
      cursor.onMouseEnter();
    },
    onMouseLeave: () => {
      setHover(false);
      cursor.onMouseLeave();
    },
  };

  if (props.as === 'a') {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        className={props.className}
        style={{ ...baseStyle, ...styleByVariant }}
        {...handlers}
      >
        {props.icon}
        <span>{props.children}</span>
        {innerArrow}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      className={props.className}
      style={{ ...baseStyle, ...styleByVariant }}
      {...handlers}
    >
      {props.icon}
      <span>{props.children}</span>
      {innerArrow}
    </button>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/HologramButton.tsx && git commit -m "feat: add HologramButton with clip-path corners and arrow"
```

---

### Task 8: Create `Typewriter`

Cycles through an array of phrases — types each character at a steady cadence, holds, then deletes and moves to the next.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/Typewriter.tsx`

```tsx
import { useEffect, useRef, useState } from 'react';

type TypewriterProps = {
  phrases: string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function Typewriter({
  phrases,
  typeMs = 80,
  deleteMs = 40,
  holdMs = 1700,
  className,
  style,
}: TypewriterProps) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (phrases.length === 0) return;

    const current = phrases[phraseIdx] ?? '';

    if (!deleting && text === current) {
      timerRef.current = window.setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && text === '') {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
    } else if (deleting) {
      timerRef.current = window.setTimeout(() => setText(text.slice(0, -1)), deleteMs);
    } else {
      timerRef.current = window.setTimeout(() => setText(current.slice(0, text.length + 1)), typeMs);
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [text, deleting, phraseIdx, phrases, typeMs, deleteMs, holdMs]);

  return (
    <span className={className} style={style}>
      {text}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '0.55em',
          height: '1em',
          background: 'var(--cyan-500)',
          marginLeft: 4,
          verticalAlign: 'baseline',
          animation: 'tw-blink 0.85s steps(2, end) infinite',
        }}
      />
      <style>{`
        @keyframes tw-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/Typewriter.tsx && git commit -m "feat: add Typewriter cycling through phrases"
```

---

### Task 9: Create `AppearingText`

Splits a string into words and reveals them in a stagger when scrolled into view.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/AppearingText.tsx`

```tsx
import { motion } from 'framer-motion';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

type AppearingTextProps = {
  text: string;
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  staggerMs?: number;
  once?: boolean;
};

export default function AppearingText({
  text,
  as = 'p',
  className,
  style,
  delay = 0,
  staggerMs = 60,
  once = true,
}: AppearingTextProps) {
  const words = text.split(/\s+/);
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      transition={{ staggerChildren: staggerMs / 1000, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          style={{ display: 'inline-block', marginRight: '0.32em' }}
          variants={{
            hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.5, ease: [0.6, 0, 0.1, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/AppearingText.tsx && git commit -m "feat: add AppearingText with word-stagger reveal"
```

---

### Task 10: Apply primitives to `Hero`

- Use AppearingText for the greeting and name
- Use Typewriter for the role line, cycling through all roles
- Replace CTA buttons with HologramButton

- [ ] **Step 1: Rewrite `Hero.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Hero.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import GithubIcon from '@/components/icons/GithubIcon';
import Tag from '@/components/Tag';
import HologramButton from '@/components/HologramButton';
import Typewriter from '@/components/Typewriter';
import AppearingText from '@/components/AppearingText';

const HERO_SKILLS = ['Ruby on Rails', 'React', 'TypeScript', 'Python'];

export default function Hero() {
  const { t } = useTranslation();
  const { scrollTo } = useLenisScroll();
  const roles = t('hero.roles', { returnObjects: true }) as string[];

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('contact');
    if (target) scrollTo(target, { offset: -80 });
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="text-center max-w-4xl">
        <AppearingText
          as="p"
          text={t('hero.greeting')}
          className="font-mono uppercase tracking-[4px] text-sm mb-4"
          style={{ color: 'var(--cyan-400)' }}
        />

        <AppearingText
          as="h1"
          text={t('hero.name')}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ color: 'var(--cyan-100)', textShadow: 'var(--cyan-glow)' }}
          staggerMs={120}
          delay={0.15}
        />

        <p
          className="font-mono text-xl md:text-2xl mb-8"
          style={{ color: 'var(--cyan-300)' }}
        >
          <span style={{ color: 'var(--cyan-500)' }}>&gt; </span>
          <Typewriter phrases={roles} />
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {HERO_SKILLS.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <HologramButton as="a" href="#contact" onClick={handleContactClick} icon={<Mail size={14} />}>
            {t('hero.cta')}
          </HologramButton>

          <HologramButton
            as="a"
            href="https://github.com/oortega14"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            icon={<GithubIcon size={14} />}
          >
            {t('hero.github')}
          </HologramButton>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/sections/Hero.tsx && git commit -m "feat: upgrade Hero with Typewriter, AppearingText, HologramButton"
```

---

### Task 11: Apply primitives to `About`, `Experience`, `Projects`, `Contact`

- [ ] **Step 1: Update `About.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/About.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import LinkedinIcon from '@/components/icons/LinkedinIcon';
import HologramCard from '@/components/HologramCard';
import HologramButton from '@/components/HologramButton';
import AppearingText from '@/components/AppearingText';
import { skills } from '@/data/skills';

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <AppearingText
            as="h2"
            text={t('about.title')}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--cyan-100)' }}
          />
          <AppearingText
            as="p"
            text={t('about.description')}
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--cyan-300)' }}
            staggerMs={30}
            delay={0.05}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <HologramCard>
            <h3
              className="text-2xl font-bold mb-6 font-mono uppercase tracking-widest"
              style={{ color: 'var(--cyan-100)' }}
            >
              {t('about.skillsTitle')}
            </h3>
            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2 text-sm font-mono">
                    <span style={{ color: 'var(--cyan-100)' }}>{skill.name}</span>
                    <span style={{ color: 'var(--cyan-300)', opacity: 0.6 }}>{skill.level}%</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ background: 'rgba(0, 212, 255, 0.1)' }}
                  >
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${skill.level}%`,
                        background: skill.color,
                        boxShadow: `0 0 12px ${skill.color}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </HologramCard>

          <div className="flex flex-col gap-4">
            <HologramButton
              as="a"
              href="https://www.linkedin.com/in/oscardeveloper/"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              icon={<LinkedinIcon size={14} />}
            >
              {t('about.linkedin')}
            </HologramButton>
            <HologramButton
              as="a"
              href="mailto:ortegaoscar14@gmail.com"
              variant="outline"
              icon={<Mail size={14} />}
            >
              {t('about.contact')}
            </HologramButton>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update `Experience.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Experience.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { MapPin, ExternalLink } from 'lucide-react';
import experiencesData from '@/data/experiences.json';
import type { Experience as ExperienceType } from '@/types/content';
import { useLocalized } from '@/hooks/useLocalized';
import Tag from '@/components/Tag';
import HologramCard from '@/components/HologramCard';
import AppearingText from '@/components/AppearingText';
import { useCursorHover } from '@/hooks/useCursorHover';

const experiences = (experiencesData as ExperienceType[]).slice().sort((a, b) => a.position - b.position);

function formatPeriod(start: string, end: string | null, presentLabel: string): string {
  const fmt = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  return `${fmt(start)} — ${end ? fmt(end) : presentLabel}`;
}

function CompanyLink({ url, company }: { url: string; company: string }) {
  const cursor = useCursorHover();
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm"
      style={{ color: 'var(--cyan-400)' }}
      {...cursor}
    >
      {company} <ExternalLink size={12} />
    </a>
  );
}

export default function Experience() {
  const { t } = useTranslation();
  const { pick } = useLocalized();

  return (
    <section id="experience" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AppearingText
          as="h2"
          text={t('experience.title')}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          style={{ color: 'var(--cyan-100)' }}
        />

        <ol className="space-y-10">
          {experiences.map((exp) => (
            <li key={exp.id}>
              <HologramCard>
                <div className="grid md:grid-cols-[180px_1fr] gap-6">
                  <div className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--cyan-400)' }}>
                    {formatPeriod(exp.start_date, exp.end_date, t('experience.currentLabel'))}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 mb-2">
                      <h3 className="text-xl font-bold" style={{ color: 'var(--cyan-100)' }}>
                        {pick(exp.job_title)}
                      </h3>
                      {exp.company_url ? (
                        <CompanyLink url={exp.company_url} company={exp.company} />
                      ) : (
                        <span className="text-sm" style={{ color: 'var(--cyan-300)' }}>{exp.company}</span>
                      )}
                    </div>

                    <div
                      className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest mb-4"
                      style={{ color: 'var(--cyan-300)', opacity: 0.7 }}
                    >
                      <MapPin size={12} /> {exp.location}
                    </div>

                    <p className="mb-4 leading-relaxed" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
                      {pick(exp.description)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Tag key={tech} size="sm">{tech}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </HologramCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `Projects.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Projects.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { ExternalLink, Smartphone } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import projectsData from '@/data/projects.json';
import type { Project } from '@/types/content';
import { useLocalized } from '@/hooks/useLocalized';
import Tag from '@/components/Tag';
import HologramCard from '@/components/HologramCard';
import AppearingText from '@/components/AppearingText';
import { useCursorHover } from '@/hooks/useCursorHover';

const projects = (projectsData as Project[])
  .filter((p) => p.published)
  .slice()
  .sort((a, b) => a.position - b.position);

function isValidUrl(url: string | null): url is string {
  return typeof url === 'string' && url.startsWith('http');
}

function ProjectLink({ href, children }: { href: string; children: React.ReactNode }) {
  const cursor = useCursorHover();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-widest"
      style={{ color: 'var(--cyan-400)' }}
      {...cursor}
    >
      {children}
    </a>
  );
}

export default function Projects() {
  const { t } = useTranslation();
  const { pick } = useLocalized();

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <AppearingText
          as="h2"
          text={t('projects.title')}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          style={{ color: 'var(--cyan-100)' }}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <HologramCard key={project.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div
                className="aspect-video w-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(5, 10, 20, 0.4), rgba(5, 10, 20, 0.4)), url('${project.image_url}')`,
                }}
              />

              <div className="p-6 flex flex-col gap-4">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--cyan-100)' }}>
                  {pick(project.title)}
                </h3>

                <p className="leading-relaxed" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
                  {pick(project.description)}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Tag key={tech} size="sm">{tech}</Tag>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {isValidUrl(project.live_url) && (
                    <ProjectLink href={project.live_url}>
                      <ExternalLink size={14} /> {t('projects.viewLive')}
                    </ProjectLink>
                  )}
                  {isValidUrl(project.github_url) && (
                    <ProjectLink href={project.github_url}>
                      <GithubIcon size={14} /> {t('projects.viewSource')}
                    </ProjectLink>
                  )}
                  {isValidUrl(project.app_store_url) && (
                    <ProjectLink href={project.app_store_url}>
                      <Smartphone size={14} /> {t('projects.appStore')}
                    </ProjectLink>
                  )}
                  {isValidUrl(project.play_store_url) && (
                    <ProjectLink href={project.play_store_url}>
                      <Smartphone size={14} /> {t('projects.playStore')}
                    </ProjectLink>
                  )}
                </div>
              </div>
            </HologramCard>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Update `Contact.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Contact.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import LinkedinIcon from '@/components/icons/LinkedinIcon';
import HologramCard from '@/components/HologramCard';
import HologramButton from '@/components/HologramButton';
import AppearingText from '@/components/AppearingText';
import { useCursorHover } from '@/hooks/useCursorHover';

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const cursor = useCursorHover();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ color: 'var(--cyan-300)' }}
      {...cursor}
    >
      {children}
    </a>
  );
}

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="min-h-[60vh] py-32 px-6 flex items-center justify-center">
      <HologramCard style={{ maxWidth: 560, width: '100%' }}>
        <div className="text-center">
          <AppearingText
            as="h2"
            text={t('contact.title')}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--cyan-100)' }}
          />

          <div className="flex justify-center mb-10">
            <HologramButton
              as="a"
              href="mailto:ortegaoscar14@gmail.com"
              icon={<Mail size={14} />}
            >
              {t('contact.cta')}
            </HologramButton>
          </div>

          <div className="flex justify-center gap-6">
            <SocialLink href="https://www.linkedin.com/in/oscardeveloper/" label="LinkedIn">
              <LinkedinIcon size={22} />
            </SocialLink>
            <SocialLink href="https://github.com/oortega14" label="GitHub">
              <GithubIcon size={22} />
            </SocialLink>
            <SocialLink href="mailto:ortegaoscar14@gmail.com" label="Email">
              <Mail size={22} />
            </SocialLink>
          </div>
        </div>
      </HologramCard>
    </section>
  );
}
```

- [ ] **Step 5: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/sections/About.tsx src/sections/Experience.tsx src/sections/Projects.tsx src/sections/Contact.tsx && git commit -m "feat: apply HologramCard/Button + AppearingText to all sections"
```

---

### Task 12: Apply `useCursorHover` to Navigation links + LangSwitch + Footer link

The brand and section nav links should also push the cursor into `link` mode.

- [ ] **Step 1: Update `Navigation.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/Navigation.tsx`

Add the import:

```tsx
import { useCursorHover } from '@/hooks/useCursorHover';
```

Inside the component, after `handleClick`, add:

```tsx
const cursor = useCursorHover();
```

Then spread `{...cursor}` on the brand `<a>` AND on each section anchor `<a>` in the `nav.map()`.

The full updated file:

```tsx
import { useTranslation } from 'react-i18next';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { useCursorHover } from '@/hooks/useCursorHover';
import LangSwitch from './LangSwitch';

const SECTIONS = [
  { id: 'hero', key: 'nav.hero' },
  { id: 'about', key: 'nav.about' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'contact', key: 'nav.contact' },
] as const;

export default function Navigation() {
  const { t } = useTranslation();
  const { scrollTo } = useLenisScroll();
  const cursor = useCursorHover();

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) scrollTo(target, { offset: -80 });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{
        background: 'rgba(5, 10, 20, 0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
      }}
    >
      <a
        href="#hero"
        onClick={handleClick('hero')}
        className="font-mono text-sm uppercase tracking-[3px]"
        style={{ color: 'var(--cyan-100)', textShadow: 'var(--cyan-glow)' }}
        {...cursor}
      >
        OO<span style={{ color: 'var(--cyan-400)' }}>/</span>2026
      </a>

      <nav className="hidden md:flex items-center gap-6">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={handleClick(s.id)}
            className="font-mono text-xs uppercase tracking-widest transition-colors hover:opacity-100"
            style={{ color: 'var(--cyan-300)', opacity: 0.7 }}
            {...cursor}
          >
            {t(s.key)}
          </a>
        ))}
      </nav>

      <LangSwitch />
    </header>
  );
}
```

- [ ] **Step 2: Update `LangSwitch.tsx`** (optional but consistent)

File: `/Users/oscarortega/projects/portfolio-2026/src/components/LangSwitch.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { useCursorHover } from '@/hooks/useCursorHover';

const LOCALES = ['en', 'es'] as const;

export default function LangSwitch() {
  const { i18n } = useTranslation();
  const cursor = useCursorHover();
  const current = i18n.language.startsWith('es') ? 'es' : 'en';

  return (
    <div className="flex items-center gap-1 font-mono text-xs uppercase">
      {LOCALES.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => void i18n.changeLanguage(loc)}
            className="px-2 py-1 rounded transition-colors"
            style={{
              color: active ? 'var(--cyan-100)' : 'var(--cyan-300)',
              opacity: active ? 1 : 0.5,
              textShadow: active ? 'var(--cyan-glow)' : 'none',
            }}
            {...cursor}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Update `Footer.tsx`** to apply `useCursorHover` on the attribution link

File: `/Users/oscarortega/projects/portfolio-2026/src/components/Footer.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { useCursorHover } from '@/hooks/useCursorHover';

export default function Footer() {
  const { t } = useTranslation();
  const cursor = useCursorHover();
  const year = new Date().getFullYear();

  return (
    <footer
      className="px-6 py-10 text-center font-mono text-xs"
      style={{
        color: 'var(--cyan-300)',
        opacity: 0.6,
        borderTop: '1px solid rgba(0, 212, 255, 0.15)',
      }}
    >
      <p className="mb-2">© {year} Oscar Ortega. {t('footer.rights')}</p>
      <p>
        {t('footer.inspired')}{' '}
        <a
          href="https://david-hckh.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--cyan-400)' }}
          {...cursor}
        >
          David Heckhoff's portfolio (2025)
        </a>{' '}
        — reimplemented in React with original assets.
      </p>
    </footer>
  );
}
```

- [ ] **Step 4: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/Navigation.tsx src/components/LangSwitch.tsx src/components/Footer.tsx && git commit -m "feat: thread useCursorHover through Navigation, LangSwitch, Footer"
```

---

### Task 13: Final verification

- [ ] **Step 1: Build / type-check / lint**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && rm -rf dist && npm run build 2>&1 | tail -8 && npm run lint 2>&1 | tail -10
```
Expected: all clean.

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

- [ ] **Custom cursor**: native arrow cursor disappears; a small cyan dot + outline ring lerp-follows the mouse
- [ ] **Cursor over links**: hovering any nav link / button / social icon visibly changes the ring (color or scale — at minimum the border color brightens to white-cyan)
- [ ] **Cursor over astronaut**: hovering directly over the 3D astronaut (any open area where the helmet/body is visible behind content) changes the ring to bright cyan
- [ ] **Hologram cards**: About skills, every Experience item, every Project card, and the Contact CTA card all show notched corners + cyan border glow + backdrop blur
- [ ] **Hologram buttons**: Hero "Get in touch" + GitHub, About LinkedIn + Contact, Contact "Send a message" all have angular notched corners and an arrow that translates on hover
- [ ] **Typewriter**: under the Hero name, the role line types itself out, deletes, types the next role (Full-Stack → Rails → React, cycling)
- [ ] **Text reveals**: scroll to About / Experience / Projects / Contact — the section titles animate word-by-word as they enter view, with a subtle blur fade
- [ ] **Lang switch**: still works
- [ ] **DevTools console**: no new errors

- [ ] **Step 4: If anything is off, report**; otherwise Phase 4 is complete.

---

## Phase 4 Deliverable

- HologramCard + HologramButton primitives with clip-path corners, cyan border + glow, backdrop blur
- All five sections use the hologram primitives — site reads as a unified in-universe HUD
- CustomCursor with lerp follow + state-driven styling (default / link / three)
- 3D hover detection on the astronaut → cursor reacts when the user mouse-overs the model
- Typewriter cycling through the three roles in the Hero
- AppearingText word-stagger reveal on all section titles + Hero greeting / name
- Build, type-check, lint all clean

**Next phase:** `2026-05-21-phase-5-particles-postprocessing.md` — Particles (instanced dust drifting), Satellite secondary model, full postprocessing chain (bloom + chromatic aberration + vignette), and final color grading.
