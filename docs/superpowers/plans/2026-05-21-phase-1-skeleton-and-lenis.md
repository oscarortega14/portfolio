# Phase 1 — Section Skeletons + Lenis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Phase 0 placeholder Home with a real single-page scroll experience: smooth scroll (Lenis), sticky navigation with anchor links and a language switch, and five sections (Hero, About, Experience, Projects, Contact) rendering the real content from `src/data/*` in the cyan hologram visual identity. No 3D yet — this is the accessible content-complete fallback that the 3D scene will later sit on top of.

**Architecture:** A `LenisProvider` mounts at the App root, instantiates a Lenis instance, and pumps it via `requestAnimationFrame` for the lifetime of the page. Anchor links in the Navigation use `lenis.scrollTo()` for smooth jumps. Sections are stacked normal-flow blocks; each pulls its content from JSON / TS data files via a `useLocalized` hook that picks the active locale's text. No animations beyond what Tailwind / native CSS provides — the focus is "content-complete and beautiful with zero motion".

**Tech Stack:** Lenis 1, react-i18next, Tailwind v4, lucide-react icons. No GSAP / Framer Motion yet (Phase 4).

**Spec:** `docs/superpowers/specs/2026-05-21-portfolio-2026-design.md`

---

## File map

**Created:**
- `src/contexts/LenisProvider.tsx` — global smooth scroll
- `src/hooks/useLocalized.ts` — picks active locale string from `Localized`
- `src/hooks/useLenisScroll.ts` — exposes `scrollTo(target)` from Lenis context
- `src/components/Navigation.tsx` — sticky top nav with anchors
- `src/components/LangSwitch.tsx` — en/es toggle
- `src/components/Footer.tsx` — copyright + attribution
- `src/components/Tag.tsx` — small chip used for technology lists
- `src/sections/Hero.tsx`
- `src/sections/About.tsx`
- `src/sections/Experience.tsx`
- `src/sections/Projects.tsx`
- `src/sections/Contact.tsx`

**Modified:**
- `src/sections/Home.tsx` (composes all sections + Navigation + Footer)
- `src/main.tsx` (wraps `<App>` with `<LenisProvider>`)

---

## Tasks

### Task 1: Create `useLocalized` hook

This hook lets any component pick the right string from a `Localized` field (`{ en, es }`) based on the current i18next locale.

- [ ] **Step 1: Create the hook**

File: `/Users/oscarortega/projects/portfolio-2026/src/hooks/useLocalized.ts`

```ts
import { useTranslation } from 'react-i18next';
import type { Locale, Localized } from '@/types/content';

export function useLocalized() {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language.startsWith('es') ? 'es' : 'en';

  const pick = (field: Localized): string => field[locale] ?? field.en;

  return { locale, pick };
}
```

- [ ] **Step 2: Type-check**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useLocalized.ts && git commit -m "feat: add useLocalized hook for bilingual content"
```

---

### Task 2: Create the `LenisProvider` context

Lenis is instantiated once at App level. The provider exposes the instance via context so other components can call `scrollTo` for anchor links.

- [ ] **Step 1: Create the provider**

File: `/Users/oscarortega/projects/portfolio-2026/src/contexts/LenisProvider.tsx`

```tsx
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';

type LenisContextValue = {
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; duration?: number }) => void;
};

const LenisContext = createContext<LenisContextValue | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo: LenisContextValue['scrollTo'] = (target, options) => {
    lenisRef.current?.scrollTo(target, options);
  };

  return <LenisContext.Provider value={{ scrollTo }}>{children}</LenisContext.Provider>;
}

export function useLenisScroll() {
  const ctx = useContext(LenisContext);
  if (!ctx) {
    throw new Error('useLenisScroll must be used inside a LenisProvider');
  }
  return ctx;
}
```

- [ ] **Step 2: Wrap `<App />` with `<LenisProvider>`**

Edit `src/main.tsx` — wrap the `<App />` element inside `<LenisProvider>`. Final shape:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LenisProvider } from '@/contexts/LenisProvider';
import './styles/globals.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LenisProvider>
        <App />
      </LenisProvider>
    </BrowserRouter>
  </StrictMode>,
);
```

- [ ] **Step 3: Type-check**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json
```
Expected: no errors.

- [ ] **Step 4: Smoke-test the dev server boots**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && (npm run dev > /tmp/p26.log 2>&1 & echo $! > /tmp/p26.pid) && sleep 4 && curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173/ ; kill $(cat /tmp/p26.pid) 2>/dev/null
```
Expected: HTTP 200.

- [ ] **Step 5: Commit**

```bash
git add src/contexts/LenisProvider.tsx src/main.tsx && git commit -m "feat: add LenisProvider for global smooth scroll"
```

---

### Task 3: Create the `Tag` shared component

Tags are used in multiple sections (experience tech, project tech, hero skill chips). Build it once.

- [ ] **Step 1: Create `Tag.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/Tag.tsx`

```tsx
type TagProps = {
  children: React.ReactNode;
  size?: 'sm' | 'md';
};

export default function Tag({ children, size = 'md' }: TagProps) {
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';
  return (
    <span
      className={`inline-block rounded-full font-mono uppercase tracking-wider ${padding}`}
      style={{
        background: 'rgba(0, 212, 255, 0.08)',
        border: '1px solid rgba(0, 212, 255, 0.35)',
        color: 'var(--cyan-300)',
      }}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/Tag.tsx && git commit -m "feat: add Tag chip component"
```

---

### Task 4: Create the `LangSwitch` component

A two-button switch (EN / ES) that toggles `i18n.language`.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/LangSwitch.tsx`

```tsx
import { useTranslation } from 'react-i18next';

const LOCALES = ['en', 'es'] as const;

export default function LangSwitch() {
  const { i18n } = useTranslation();
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
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/LangSwitch.tsx && git commit -m "feat: add LangSwitch component"
```

---

### Task 5: Create the `Navigation` component

Sticky top header with the logo on the left, anchors in the center, language switch on the right. Anchors use `useLenisScroll` to trigger smooth scrolling.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/Navigation.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { useLenisScroll } from '@/contexts/LenisProvider';
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

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/Navigation.tsx && git commit -m "feat: add Navigation with anchors and lang switch"
```

---

### Task 6: Create the `Hero` section

The Hero is the first full-viewport section. Static for now — typewriter and reveal animations come in Phase 4.

- [ ] **Step 1: Create the section**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Hero.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { Mail, Github } from 'lucide-react';
import { useLenisScroll } from '@/contexts/LenisProvider';
import Tag from '@/components/Tag';

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
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-6 relative"
    >
      <div className="text-center max-w-4xl">
        <p
          className="font-mono uppercase tracking-[4px] text-sm mb-4"
          style={{ color: 'var(--cyan-400)' }}
        >
          {t('hero.greeting')}
        </p>

        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ color: 'var(--cyan-100)', textShadow: 'var(--cyan-glow)' }}
        >
          {t('hero.name')}
        </h1>

        <p
          className="font-mono text-xl md:text-2xl mb-8"
          style={{ color: 'var(--cyan-300)' }}
        >
          <span style={{ color: 'var(--cyan-500)' }}>&gt; </span>
          {roles[0]}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {HERO_SKILLS.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#contact"
            onClick={handleContactClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-mono uppercase text-sm tracking-widest transition-colors"
            style={{
              background: 'var(--cyan-500)',
              color: 'var(--bg-base)',
              boxShadow: 'var(--cyan-glow)',
            }}
          >
            <Mail size={16} />
            {t('hero.cta')}
          </a>

          <a
            href="https://github.com/oortega14"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-mono uppercase text-sm tracking-widest border transition-colors"
            style={{ borderColor: 'var(--cyan-400)', color: 'var(--cyan-100)' }}
          >
            <Github size={16} />
            {t('hero.github')}
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/sections/Hero.tsx && git commit -m "feat: add Hero section"
```

---

### Task 7: Create the `About` section with skills bars

- [ ] **Step 1: Create the section**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/About.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { Linkedin, Mail } from 'lucide-react';
import { skills } from '@/data/skills';

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--cyan-100)' }}
          >
            {t('about.title')}
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--cyan-300)' }}
          >
            {t('about.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
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
          </div>

          <div className="flex flex-col gap-4">
            <a
              href="https://www.linkedin.com/in/oscardeveloper/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded font-mono uppercase text-sm tracking-widest border"
              style={{ borderColor: 'var(--cyan-400)', color: 'var(--cyan-100)' }}
            >
              <Linkedin size={18} />
              {t('about.linkedin')}
            </a>
            <a
              href="mailto:ortegaoscar14@gmail.com"
              className="inline-flex items-center gap-3 px-5 py-3 rounded font-mono uppercase text-sm tracking-widest border"
              style={{ borderColor: 'var(--cyan-400)', color: 'var(--cyan-100)' }}
            >
              <Mail size={18} />
              {t('about.contact')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/sections/About.tsx && git commit -m "feat: add About section with skills bars"
```

---

### Task 8: Create the `Experience` section (timeline)

A vertical list of jobs from `experiences.json`, sorted by `position`.

- [ ] **Step 1: Create the section**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Experience.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { MapPin, ExternalLink } from 'lucide-react';
import experiencesData from '@/data/experiences.json';
import type { Experience as ExperienceType } from '@/types/content';
import { useLocalized } from '@/hooks/useLocalized';
import Tag from '@/components/Tag';

const experiences = (experiencesData as ExperienceType[]).slice().sort((a, b) => a.position - b.position);

function formatPeriod(start: string, end: string | null, presentLabel: string): string {
  const fmt = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  return `${fmt(start)} — ${end ? fmt(end) : presentLabel}`;
}

export default function Experience() {
  const { t } = useTranslation();
  const { pick } = useLocalized();

  return (
    <section id="experience" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          style={{ color: 'var(--cyan-100)' }}
        >
          {t('experience.title')}
        </h2>

        <ol className="space-y-10 relative">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              className="grid md:grid-cols-[180px_1fr] gap-6 p-6 rounded-lg"
              style={{
                background: 'rgba(10, 18, 36, 0.4)',
                border: '1px solid rgba(0, 212, 255, 0.15)',
              }}
            >
              <div className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--cyan-400)' }}>
                {formatPeriod(exp.start_date, exp.end_date, t('experience.currentLabel'))}
              </div>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 mb-2">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--cyan-100)' }}>
                    {pick(exp.job_title)}
                  </h3>
                  {exp.company_url ? (
                    <a
                      href={exp.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm"
                      style={{ color: 'var(--cyan-400)' }}
                    >
                      {exp.company} <ExternalLink size={12} />
                    </a>
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/sections/Experience.tsx && git commit -m "feat: add Experience timeline section"
```

---

### Task 9: Create the `Projects` section (cards)

- [ ] **Step 1: Create the section**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Projects.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { Github, ExternalLink, Smartphone } from 'lucide-react';
import projectsData from '@/data/projects.json';
import type { Project } from '@/types/content';
import { useLocalized } from '@/hooks/useLocalized';
import Tag from '@/components/Tag';

const projects = (projectsData as Project[])
  .filter((p) => p.published)
  .slice()
  .sort((a, b) => a.position - b.position);

function isValidUrl(url: string | null): url is string {
  return typeof url === 'string' && url.startsWith('http');
}

export default function Projects() {
  const { t } = useTranslation();
  const { pick } = useLocalized();

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          style={{ color: 'var(--cyan-100)' }}
        >
          {t('projects.title')}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-lg overflow-hidden flex flex-col"
              style={{
                background: 'rgba(10, 18, 36, 0.4)',
                border: '1px solid rgba(0, 212, 255, 0.15)',
              }}
            >
              <div
                className="aspect-video w-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(5, 10, 20, 0.4), rgba(5, 10, 20, 0.4)), url('${project.image_url}')`,
                }}
              />

              <div className="p-6 flex flex-col gap-4 flex-1">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--cyan-100)' }}>
                  {pick(project.title)}
                </h3>

                <p className="leading-relaxed flex-1" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
                  {pick(project.description)}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Tag key={tech} size="sm">{tech}</Tag>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {isValidUrl(project.live_url) && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-widest"
                      style={{ color: 'var(--cyan-400)' }}
                    >
                      <ExternalLink size={14} /> {t('projects.viewLive')}
                    </a>
                  )}
                  {isValidUrl(project.github_url) && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-widest"
                      style={{ color: 'var(--cyan-400)' }}
                    >
                      <Github size={14} /> {t('projects.viewSource')}
                    </a>
                  )}
                  {isValidUrl(project.app_store_url) && (
                    <a
                      href={project.app_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-widest"
                      style={{ color: 'var(--cyan-400)' }}
                    >
                      <Smartphone size={14} /> {t('projects.appStore')}
                    </a>
                  )}
                  {isValidUrl(project.play_store_url) && (
                    <a
                      href={project.play_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-widest"
                      style={{ color: 'var(--cyan-400)' }}
                    >
                      <Smartphone size={14} /> {t('projects.playStore')}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/sections/Projects.tsx && git commit -m "feat: add Projects cards section"
```

---

### Task 10: Create the `Contact` section

- [ ] **Step 1: Create the section**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Contact.tsx`

```tsx
import { useTranslation } from 'react-i18next';
import { Mail, Linkedin, Github } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className="min-h-[60vh] py-32 px-6 flex items-center justify-center"
    >
      <div className="text-center max-w-2xl">
        <h2
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: 'var(--cyan-100)' }}
        >
          {t('contact.title')}
        </h2>

        <a
          href="mailto:ortegaoscar14@gmail.com"
          className="inline-flex items-center gap-2 px-8 py-4 rounded font-mono uppercase text-sm tracking-widest mb-10"
          style={{
            background: 'var(--cyan-500)',
            color: 'var(--bg-base)',
            boxShadow: 'var(--cyan-glow-strong)',
          }}
        >
          <Mail size={18} />
          {t('contact.cta')}
        </a>

        <div className="flex justify-center gap-6">
          <a
            href="https://www.linkedin.com/in/oscardeveloper/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ color: 'var(--cyan-300)' }}
          >
            <Linkedin size={22} />
          </a>
          <a
            href="https://github.com/oortega14"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{ color: 'var(--cyan-300)' }}
          >
            <Github size={22} />
          </a>
          <a
            href="mailto:ortegaoscar14@gmail.com"
            aria-label="Email"
            style={{ color: 'var(--cyan-300)' }}
          >
            <Mail size={22} />
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/sections/Contact.tsx && git commit -m "feat: add Contact section"
```

---

### Task 11: Create the `Footer` with attribution

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/components/Footer.tsx`

```tsx
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
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
        >
          David Heckhoff's portfolio (2025)
        </a>{' '}
        — reimplemented in React with original assets.
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/components/Footer.tsx && git commit -m "feat: add Footer with attribution"
```

---

### Task 12: Compose everything in `Home`

Replace the Phase 0 placeholder Home with the full composition: Navigation on top, the 5 sections stacked, Footer at the bottom.

- [ ] **Step 1: Rewrite `Home.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/sections/Home.tsx`

```tsx
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
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

- [ ] **Step 2: Type-check + production build**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && rm -rf dist && npm run build 2>&1 | tail -10
```
Expected: type check passes; build succeeds; bundle size reasonable (< 400 KB JS uncompressed for now since R3F isn't used yet — `lenis`, `framer-motion`, `gsap`, `three`, etc. are imported but tree-shaken if unused).

- [ ] **Step 3: Lint**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npm run lint
```
Expected: no errors.

- [ ] **Step 4: Smoke-test the dev server**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && (npm run dev > /tmp/p26.log 2>&1 & echo $! > /tmp/p26.pid) && sleep 4 && curl -s -o /dev/null -w "/ → HTTP %{http_code}\n" http://localhost:5173/ ; kill $(cat /tmp/p26.pid) 2>/dev/null
```
Expected: HTTP 200.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Home.tsx && git commit -m "feat: compose single-page Home with all 5 sections"
```

---

### Task 13: Final manual verification

This is a human gate. After the build/type-check/lint pass, the user opens the browser and confirms.

- [ ] **Step 1: Run dev server**

```bash
cd /Users/oscarortega/projects/portfolio-2026 && npm run dev
```
(Run from an interactive terminal so `mise` activates node automatically.)

- [ ] **Step 2: Manual checks in the browser (`http://localhost:5173/`)**

- [ ] **Smooth scroll**: scrolling with mouse wheel feels eased, not snappy
- [ ] **Nav anchors**: clicking each nav link (Home / About / Experience / Projects / Contact) smoothly scrolls to that section with the sticky header staying on top
- [ ] **Hero**: name "Oscar Ortega" big and glowing, role line, skill chips, two CTA buttons
- [ ] **About**: title + description, 6 skills bars with cyan glow at the right %, LinkedIn + Contact buttons
- [ ] **Experience**: 4 cards in order EPAM → Fuzati → GFT → ISWO, with dates, location, description, tech tags
- [ ] **Projects**: 2 cards (Iswo Academy, StickerSwap) with image, description, tech tags, and link icons
- [ ] **Contact**: title + CTA button + 3 social icons
- [ ] **Footer**: copyright line + attribution to David Heckhoff's portfolio with link
- [ ] **Lang switch**: clicking ES updates all i18n-driven copy (greeting, section titles, descriptions, job titles, project descriptions, footer); clicking EN reverts
- [ ] **Mobile** (DevTools responsive ~390px): nav anchors collapse (hidden on mobile per `md:flex`), sections stack, no horizontal scroll
- [ ] **DevTools Console**: no errors

- [ ] **Step 3: If anything is off, report back**; otherwise Phase 1 is complete.

---

## Phase 1 Deliverable

- Smooth-scrolling single-page site with real content
- Sticky navigation with anchor scrolling via Lenis
- 5 sections rendering experiences, projects, skills, contact info
- Footer with attribution to the inspiration source
- Bilingual (en/es) live-switchable
- Accessible content-complete fallback (a screen reader / no-JS user gets all of the content sensibly)
- Build, type-check, lint all clean

**Next phase:** `2026-05-21-phase-2-base-3d-scene.md` (Canvas + astronaut GLB + stars + grid + base lighting + initial bloom).
