# Stickerswap Support Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public Stickerswap support page at `/apps/stickerswap/support` with FAQ accordions, email contact, and links to existing legal pages — bilingual (es/en), consistent with the existing hologram aesthetic.

**Architecture:** Single React component (`StickerswapSupport.tsx`) in `src/legal/` following the pattern of `DeleteAccountPage.tsx`. All content is static and lives inline in the component as a `content = { es, en }` object. Accordion is implemented inline using local `useState` per category card + `framer-motion` for height animation. Route is registered in `src/App.tsx`.

**Tech Stack:** React 19 + TypeScript + Vite + react-router-dom v7 + framer-motion + lucide-react + Tailwind CSS v4. Reuses existing project primitives: `HologramCard`, `HologramButton`, `useLocalized`, `useCursorHover`, `APP_CONTACT_EMAIL`, `LAST_UPDATED`.

**Spec:** `docs/superpowers/specs/2026-05-23-stickerswap-support-design.md`

**No unit test infrastructure exists in this repo.** Verification at each checkpoint = `tsc -b` (typecheck) + `npm run lint` + `npm run dev` (manual browser check at `http://localhost:5173/apps/stickerswap/support`).

---

## File Structure

**Create:**
- `src/legal/StickerswapSupport.tsx` — the support page component (all content i18n + accordion + sections inline)

**Modify:**
- `src/App.tsx` — add import and `<Route>` for `/apps/stickerswap/support`

No other files are touched.

---

## Task 1: Scaffold component file + register route

**Files:**
- Create: `src/legal/StickerswapSupport.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create the scaffold file**

Create `src/legal/StickerswapSupport.tsx` with the minimum viable structure (back link + heading) so we can verify the route works before adding content:

```tsx
import { Link } from 'react-router-dom';
import { useLocalized } from '@/hooks/useLocalized';
import { useCursorHover } from '@/hooks/useCursorHover';
import { LAST_UPDATED } from './legalContent';

const content = {
  es: {
    title: 'Centro de ayuda',
    subtitle: 'Preguntas frecuentes y contacto',
    lastUpdated: 'Última actualización',
    back: 'Volver al inicio',
    intro:
      'Encontrá respuestas a las preguntas más comunes sobre Stickerswap. Si tu duda no aparece acá, escribinos al final de la página.',
  },
  en: {
    title: 'Support Center',
    subtitle: 'Frequently asked questions and contact',
    lastUpdated: 'Last updated',
    back: 'Back to home',
    intro:
      "Find answers to the most common Stickerswap questions. If your question is not here, contact us at the bottom of the page.",
  },
} as const;

export default function StickerswapSupport() {
  const { locale } = useLocalized();
  const cursor = useCursorHover();
  const c = content[locale];

  return (
    <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-8 text-sm font-mono uppercase tracking-widest"
          style={{ color: 'var(--cyan-400)' }}
          {...cursor}
        >
          ← {c.back}
        </Link>

        <header className="mb-10">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight"
            style={{ color: 'var(--cyan-100)', textShadow: 'var(--cyan-glow)' }}
          >
            {c.title}
          </h1>
          <p className="text-sm mb-2" style={{ color: 'var(--cyan-300)' }}>
            {c.subtitle}
          </p>
          <p className="text-xs font-mono" style={{ color: 'var(--cyan-300)', opacity: 0.6 }}>
            {c.lastUpdated}: {LAST_UPDATED}
          </p>
        </header>

        <p
          className="text-sm sm:text-base leading-relaxed mb-10"
          style={{ color: 'var(--cyan-100)', opacity: 0.85 }}
        >
          {c.intro}
        </p>

        <div
          className="mt-16 pt-8 text-xs font-mono"
          style={{
            borderTop: '1px solid rgba(0, 212, 255, 0.2)',
            color: 'var(--cyan-300)',
            opacity: 0.6,
          }}
        >
          © {new Date().getFullYear()} Oscar Ortega · Stickerswap
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Register the route in App.tsx**

Open `src/App.tsx`. After the existing imports, add:

```tsx
import StickerswapSupport from '@/legal/StickerswapSupport';
```

After the `<Route path="/apps/stickerswap/delete-account" ... />` line, add:

```tsx
<Route path="/apps/stickerswap/support" element={<StickerswapSupport />} />
```

The final file should look like:

```tsx
import { Routes, Route } from 'react-router-dom';
import Home from '@/sections/Home';
import StickerswapPrivacy from '@/legal/StickerswapPrivacy';
import StickerswapTerms from '@/legal/StickerswapTerms';
import DeleteAccountPage from '@/legal/DeleteAccountPage';
import StickerswapSupport from '@/legal/StickerswapSupport';
import NotFound from '@/components/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/apps/stickerswap/privacy" element={<StickerswapPrivacy />} />
      <Route path="/apps/stickerswap/terms" element={<StickerswapTerms />} />
      <Route path="/apps/stickerswap/delete-account" element={<DeleteAccountPage />} />
      <Route path="/apps/stickerswap/support" element={<StickerswapSupport />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run:
```bash
npx tsc -b
npm run lint
```
Expected: both pass with no errors.

- [ ] **Step 4: Verify in dev server**

Run `npm run dev` and open `http://localhost:5173/apps/stickerswap/support` in the browser.
Expected: page renders with back link, title "Centro de ayuda" or "Support Center" (depending on browser language), subtitle, last-updated meta, intro paragraph, and footer.
Test the language switch (if present on the page) — content should swap between es/en.
Click "← Volver al inicio" — should navigate to `/`.

- [ ] **Step 5: Commit**

```bash
git add src/legal/StickerswapSupport.tsx src/App.tsx
git commit -m "feat(stickerswap): scaffold support page route and skeleton"
```

---

## Task 2: Add FAQ data structure and category cards (without accordion behavior yet)

**Files:**
- Modify: `src/legal/StickerswapSupport.tsx`

Add the full FAQ content as data, render each category as a `HologramCard` showing all questions and answers expanded (no accordion yet — that comes in Task 3). This lets us confirm the content reads well before adding interaction.

- [ ] **Step 1: Extend the content object with FAQ data**

In `src/legal/StickerswapSupport.tsx`, replace the existing `content` object with the full version including the four FAQ categories:

```tsx
const content = {
  es: {
    title: 'Centro de ayuda',
    subtitle: 'Preguntas frecuentes y contacto',
    lastUpdated: 'Última actualización',
    back: 'Volver al inicio',
    intro:
      'Encontrá respuestas a las preguntas más comunes sobre Stickerswap. Si tu duda no aparece acá, escribinos al final de la página.',
    faq: [
      {
        id: 'account',
        title: 'Cuenta y acceso',
        items: [
          {
            q: '¿Cómo inicio sesión en Stickerswap?',
            a: 'Stickerswap usa inicio de sesión con Google. Tocá "Continuar con Google" en la pantalla inicial y elegí la cuenta que querés usar. Necesitás una cuenta de Google activa en el dispositivo.',
          },
          {
            q: '¿Puedo cambiar mi @username?',
            a: 'El @username se elige una sola vez al crear el perfil. Si necesitás cambiarlo por un error de tipeo o un nombre inapropiado, escribinos por email y lo revisamos manualmente.',
          },
          {
            q: '¿Cómo elimino mi cuenta?',
            aPrefix:
              'Podés eliminar tu cuenta desde la pestaña "Perfil" → "Borrar cuenta". Para ver el procedimiento completo y qué datos se eliminan, ',
            aLink: { to: '/apps/stickerswap/delete-account', text: 'consultá la página de eliminación de cuenta' },
            aSuffix: '.',
          },
          {
            q: 'Olvidé qué cuenta de Google usé para registrarme',
            a: 'La autenticación se hace contra Google, así que no podemos cambiarte la cuenta vinculada. Probá ingresar con cada cuenta de Google que uses hasta encontrar la que tiene tu perfil. Si no la encontrás, escribinos.',
          },
        ],
      },
      {
        id: 'album',
        title: 'Álbum, amistades e intercambios',
        items: [
          {
            q: '¿Cómo marco una figurita como pegada o repetida?',
            a: 'Andá a la pestaña "Álbum", buscá la figurita y tocá su número. Se abre un selector con: pegada, repetida (con contador) o ninguna. El cambio se sincroniza automáticamente cuando hay conexión.',
          },
          {
            q: '¿Cómo agrego un amigo?',
            a: 'En la pestaña "Amigos" tocá "Agregar amigo" e ingresá su @username. Le llega una solicitud que tiene que aceptar antes de que puedan intercambiar.',
          },
          {
            q: '¿Cómo propongo un intercambio?',
            a: 'Desde el perfil de un amigo tocá "Proponer intercambio". Elegí las figuritas que ofrecés y las que querés recibir. El amigo recibe una notificación y puede aceptarlo, rechazarlo o contraproponer.',
          },
          {
            q: '¿Qué pasa si el otro no responde un intercambio?',
            a: 'Las propuestas no expiran automáticamente. Si querés cancelar una propuesta pendiente, andá a "Intercambios" → tocá la propuesta → "Cancelar". Una vez completado el intercambio en persona, ambos tienen que marcarlo como entregado.',
          },
          {
            q: '¿Qué ven mis amigos de mi perfil?',
            a: 'Tus amigos confirmados ven: tu @username, foto de perfil, nombre visible, progreso del álbum (figuritas pegadas y repetidas) y tu número de WhatsApp si lo cargaste. No ven tu email ni datos privados.',
          },
        ],
      },
      {
        id: 'privacy',
        title: 'Privacidad y datos',
        items: [
          {
            q: '¿Es obligatorio cargar mi número de WhatsApp?',
            a: 'No. El número de WhatsApp es opcional y solo se muestra a tus amigos confirmados. Sirve para coordinar entregas de intercambios fuera de la app. Podés eliminarlo desde "Perfil" → "Editar".',
          },
          {
            q: '¿Quién ve mi ciudad?',
            a: 'La ciudad es opcional. Si la cargaste, la ven tus amigos confirmados (sirve para encontrar gente cerca para intercambiar). No se comparte con desconocidos ni se usa para publicidad.',
          },
          {
            q: '¿Dónde leo la política de privacidad?',
            aPrefix: 'Está disponible en ',
            aLink: { to: '/apps/stickerswap/privacy', text: 'la página de privacidad' },
            aSuffix: '.',
          },
          {
            q: '¿Cuáles son los términos de uso?',
            aPrefix: 'Podés leerlos en ',
            aLink: { to: '/apps/stickerswap/terms', text: 'términos y condiciones' },
            aSuffix: '.',
          },
        ],
      },
      {
        id: 'technical',
        title: 'Problemas técnicos',
        items: [
          {
            q: 'La app no carga o se queda en la pantalla inicial',
            a: 'Cerrá la app completamente (deslizá hacia arriba en el selector de apps) y volvé a abrirla. Si persiste, verificá que tengas conexión a internet y que la versión de la app esté actualizada en la App Store / Play Store.',
          },
          {
            q: 'Mis cambios no se sincronizan',
            a: 'Stickerswap funciona offline-first: tus cambios se guardan localmente y se sincronizan cuando hay conexión. Verificá tu conexión. Si tras 5 minutos no se sincroniza, cerrá y abrí la app — fuerza un reintento.',
          },
          {
            q: 'No recibo notificaciones de trades o amistades',
            a: 'Revisá que las notificaciones estén habilitadas en: Ajustes del dispositivo → Stickerswap → Notificaciones. Si están activas y aún así no llegan, reinstalá la app para resetear el token de notificaciones.',
          },
          {
            q: '¿Cómo reporto un bug?',
            a: 'Escribinos al email de contacto al final de esta página. Incluí: descripción del problema, versión de la app (Perfil → Acerca de), modelo de tu dispositivo y sistema operativo. Si tenés una captura de pantalla del error, mucho mejor.',
          },
        ],
      },
    ],
  },
  en: {
    title: 'Support Center',
    subtitle: 'Frequently asked questions and contact',
    lastUpdated: 'Last updated',
    back: 'Back to home',
    intro:
      "Find answers to the most common Stickerswap questions. If your question is not here, contact us at the bottom of the page.",
    faq: [
      {
        id: 'account',
        title: 'Account and access',
        items: [
          {
            q: 'How do I sign in to Stickerswap?',
            a: 'Stickerswap uses Google sign-in. Tap "Continue with Google" on the welcome screen and choose the account you want to use. You need an active Google account on the device.',
          },
          {
            q: 'Can I change my @username?',
            a: 'The @username is chosen once when creating your profile. If you need to change it due to a typo or an inappropriate name, email us and we will review it manually.',
          },
          {
            q: 'How do I delete my account?',
            aPrefix:
              'You can delete your account from the "Profile" tab → "Delete account". For the full procedure and what data gets removed, ',
            aLink: { to: '/apps/stickerswap/delete-account', text: 'see the account deletion page' },
            aSuffix: '.',
          },
          {
            q: 'I forgot which Google account I used to sign up',
            a: 'Authentication is done through Google, so we cannot change the account linked to your profile. Try signing in with each Google account you use until you find the one with your profile. If you cannot find it, email us.',
          },
        ],
      },
      {
        id: 'album',
        title: 'Album, friends and trades',
        items: [
          {
            q: 'How do I mark a sticker as pasted or duplicate?',
            a: 'Go to the "Album" tab, find the sticker and tap its number. A selector opens with: pasted, duplicate (with counter), or none. The change syncs automatically when online.',
          },
          {
            q: 'How do I add a friend?',
            a: 'In the "Friends" tab tap "Add friend" and enter their @username. They receive a request they need to accept before you can trade.',
          },
          {
            q: 'How do I propose a trade?',
            a: 'From a friend\'s profile tap "Propose trade". Choose the stickers you offer and the ones you want. The friend receives a notification and can accept, reject, or counter-propose.',
          },
          {
            q: "What happens if the other person doesn't respond to a trade?",
            a: 'Proposals do not expire automatically. To cancel a pending proposal, go to "Trades" → tap the proposal → "Cancel". Once the trade is completed in person, both parties have to mark it as delivered.',
          },
          {
            q: 'What can my friends see in my profile?',
            a: 'Your confirmed friends see: your @username, profile picture, display name, album progress (pasted and duplicate stickers), and your WhatsApp number if you provided it. They do not see your email or private data.',
          },
        ],
      },
      {
        id: 'privacy',
        title: 'Privacy and data',
        items: [
          {
            q: 'Do I have to provide my WhatsApp number?',
            a: 'No. WhatsApp number is optional and only shown to your confirmed friends. It helps coordinate trade hand-offs outside the app. You can remove it from "Profile" → "Edit".',
          },
          {
            q: 'Who can see my city?',
            a: 'City is optional. If you provided one, your confirmed friends can see it (useful for finding people nearby to trade with). It is not shared with strangers or used for advertising.',
          },
          {
            q: 'Where can I read the privacy policy?',
            aPrefix: 'It is available on ',
            aLink: { to: '/apps/stickerswap/privacy', text: 'the privacy page' },
            aSuffix: '.',
          },
          {
            q: 'What are the terms of use?',
            aPrefix: 'You can read them in ',
            aLink: { to: '/apps/stickerswap/terms', text: 'terms of service' },
            aSuffix: '.',
          },
        ],
      },
      {
        id: 'technical',
        title: 'Technical issues',
        items: [
          {
            q: "The app doesn't load or gets stuck on the splash screen",
            a: 'Fully close the app (swipe up in the app switcher) and open it again. If it persists, check your internet connection and make sure the app version is up to date in the App Store / Play Store.',
          },
          {
            q: 'My changes are not syncing',
            a: 'Stickerswap is offline-first: your changes are saved locally and sync when online. Check your connection. If it does not sync after 5 minutes, close and reopen the app — that forces a retry.',
          },
          {
            q: "I'm not receiving trade or friendship notifications",
            a: 'Make sure notifications are enabled in: Device Settings → Stickerswap → Notifications. If they are enabled and still not arriving, reinstall the app to reset the notification token.',
          },
          {
            q: 'How do I report a bug?',
            a: 'Email us at the contact address at the bottom of this page. Include: description of the problem, app version (Profile → About), your device model and operating system. If you have a screenshot, even better.',
          },
        ],
      },
    ],
  },
} as const;
```

- [ ] **Step 2: Add a TypeScript type for FAQ items**

Inside `src/legal/StickerswapSupport.tsx`, above the `content` object, add the type alias so later code can iterate safely:

```tsx
type FaqItem =
  | { q: string; a: string }
  | {
      q: string;
      aPrefix: string;
      aLink: { to: string; text: string };
      aSuffix: string;
    };

type FaqCategory = {
  id: string;
  title: string;
  items: readonly FaqItem[];
};
```

- [ ] **Step 3: Render categories as static lists (no accordion yet)**

Below the intro paragraph in the JSX (still inside the `max-w-3xl mx-auto` container, before the footer `<div>`), add:

```tsx
import HologramCard from '@/components/HologramCard';
```

Add the import at the top of the file (alongside the existing imports).

Then in the JSX add the FAQ rendering block:

```tsx
<div className="space-y-6">
  {c.faq.map((category) => (
    <HologramCard key={category.id}>
      <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--cyan-400)' }}>
        {category.title}
      </h2>
      <div>
        {category.items.map((item, idx) => (
          <div
            key={idx}
            className="py-3"
            style={{ borderTop: idx === 0 ? 'none' : '1px solid rgba(0,212,255,0.12)' }}
          >
            <p className="font-semibold mb-2" style={{ color: 'var(--cyan-100)' }}>
              {item.q}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--cyan-100)', opacity: 0.85 }}
            >
              {'a' in item ? (
                item.a
              ) : (
                <>
                  {item.aPrefix}
                  <Link to={item.aLink.to} style={{ color: 'var(--cyan-400)' }} {...cursor}>
                    {item.aLink.text}
                  </Link>
                  {item.aSuffix}
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </HologramCard>
  ))}
</div>
```

- [ ] **Step 4: Typecheck + lint**

Run:
```bash
npx tsc -b
npm run lint
```
Expected: both pass with no errors.

If `tsc` complains about `readonly` arrays from `as const` not matching mutable `FaqItem[]`, change the type to `readonly FaqItem[]` everywhere it's used (the type alias above already has `readonly` — check the iteration sites).

- [ ] **Step 5: Verify in browser**

`npm run dev` running already. Reload `http://localhost:5173/apps/stickerswap/support`.
Expected:
- 4 `HologramCard`s with titles "Cuenta y acceso", "Álbum, amistades e intercambios", "Privacidad y datos", "Problemas técnicos" (or English equivalents).
- All Q&A visible.
- Inline links in "¿Cómo elimino mi cuenta?", "¿Dónde leo la política de privacidad?" and "¿Cuáles son los términos de uso?" render in cyan and navigate correctly when clicked.
- Switch language → all content updates.

- [ ] **Step 6: Commit**

```bash
git add src/legal/StickerswapSupport.tsx
git commit -m "feat(stickerswap): add FAQ content and category cards (static)"
```

---

## Task 3: Convert FAQ to accordion behavior

**Files:**
- Modify: `src/legal/StickerswapSupport.tsx`

Add per-card accordion state, click-to-expand, smooth height animation with `framer-motion`, ChevronDown icon, and ARIA attributes.

- [ ] **Step 1: Add imports for `useState`, `motion`, `AnimatePresence`, and `ChevronDown`**

At the top of `src/legal/StickerswapSupport.tsx`, ensure these imports exist:

```tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import HologramCard from '@/components/HologramCard';
import { useLocalized } from '@/hooks/useLocalized';
import { useCursorHover } from '@/hooks/useCursorHover';
import { LAST_UPDATED } from './legalContent';
```

- [ ] **Step 2: Extract a `FaqAccordion` sub-component inside the same file**

Below the `content` object and types, above `export default function StickerswapSupport`, add the helper component:

```tsx
type FaqAccordionProps = {
  category: FaqCategory;
};

function FaqAccordion({ category }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);
  const cursor = useCursorHover();

  return (
    <HologramCard>
      <h2 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: 'var(--cyan-400)' }}>
        {category.title}
      </h2>
      <div>
        {category.items.map((item, idx) => {
          const isOpen = open === idx;
          const panelId = `faq-panel-${category.id}-${idx}`;
          return (
            <div
              key={item.q}
              style={{ borderTop: idx === 0 ? 'none' : '1px solid rgba(0,212,255,0.12)' }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex items-center justify-between gap-3 py-4 text-left"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                {...cursor}
              >
                <span className="text-sm sm:text-base font-semibold" style={{ color: 'var(--cyan-100)' }}>
                  {item.q}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    flexShrink: 0,
                    color: 'var(--cyan-400)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p
                      className="pb-4 text-sm leading-relaxed"
                      style={{ color: 'var(--cyan-100)', opacity: 0.85 }}
                    >
                      {'a' in item ? (
                        item.a
                      ) : (
                        <>
                          {item.aPrefix}
                          <Link to={item.aLink.to} style={{ color: 'var(--cyan-400)' }} {...cursor}>
                            {item.aLink.text}
                          </Link>
                          {item.aSuffix}
                        </>
                      )}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </HologramCard>
  );
}
```

- [ ] **Step 3: Replace the static FAQ rendering in the main component with `<FaqAccordion>`**

Inside `StickerswapSupport`, find the `<div className="space-y-6">…</div>` block added in Task 2 (Step 3) and replace its inner content:

```tsx
<div className="space-y-6">
  {c.faq.map((category) => (
    <FaqAccordion key={category.id} category={category} />
  ))}
</div>
```

The static rendering from Task 2 is replaced — do not keep both.

- [ ] **Step 4: Typecheck + lint**

Run:
```bash
npx tsc -b
npm run lint
```
Expected: both pass.

If `tsc` flags `FaqCategory` items as `readonly` and `FaqAccordion` expects mutable, update the `FaqAccordionProps` to use the same `readonly` types — match the shape coming from `as const`.

- [ ] **Step 5: Verify in browser**

Reload `http://localhost:5173/apps/stickerswap/support`.
Expected:
- Each question is a clickable row with a ChevronDown icon on the right.
- Clicking a question expands the answer smoothly (200ms).
- Clicking the same question again collapses it.
- Clicking a different question in the same card closes the previous one and opens the new one.
- Questions in different cards can be open simultaneously.
- ChevronDown rotates 180° when open.
- Keyboard: Tab navigates to each button; Enter/Space expands.
- DevTools → Accessibility: each button has `aria-expanded` matching its state.

- [ ] **Step 6: Commit**

```bash
git add src/legal/StickerswapSupport.tsx
git commit -m "feat(stickerswap): convert FAQ to accordion with framer-motion"
```

---

## Task 4: Add contact section with mailto button

**Files:**
- Modify: `src/legal/StickerswapSupport.tsx`

- [ ] **Step 1: Extend content with contact strings**

In `src/legal/StickerswapSupport.tsx`, add a `contact` block to both `es` and `en` inside `content`:

```tsx
// inside content.es
contact: {
  title: '¿Necesitás más ayuda?',
  body:
    'Si tu pregunta no está en las FAQ o necesitás soporte personalizado, escribinos por email. Respondemos dentro de las 48 horas hábiles.',
  cta: 'Enviar correo',
  ctaSubject: 'Solicitud de soporte Stickerswap',
  ctaBody:
    'Hola, necesito ayuda con:\n\nDescribí el problema:\n\nVersión de la app (Perfil → Acerca de):\nDispositivo y SO:\n',
},
```

```tsx
// inside content.en
contact: {
  title: 'Need more help?',
  body:
    "If your question isn't in the FAQ or you need personalized support, write to us by email. We respond within 48 business hours.",
  cta: 'Send email',
  ctaSubject: 'Stickerswap support request',
  ctaBody:
    'Hi, I need help with:\n\nDescribe the problem:\n\nApp version (Profile → About):\nDevice and OS:\n',
},
```

- [ ] **Step 2: Import `HologramButton`, `Mail` and `APP_CONTACT_EMAIL`**

Update imports at the top of the file:

```tsx
import { Mail } from 'lucide-react';
import HologramButton from '@/components/HologramButton';
import { APP_CONTACT_EMAIL, LAST_UPDATED } from './legalContent';
```

(`ChevronDown` and `Mail` can be combined into one import line if you prefer: `import { ChevronDown, Mail } from 'lucide-react';`.)

- [ ] **Step 3: Render the contact card**

In the JSX of `StickerswapSupport`, after the `<div className="space-y-6">…</div>` FAQ block and before the footer `<div>`, add:

```tsx
<div className="mt-8">
  <HologramCard>
    <h2 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: 'var(--cyan-400)' }}>
      {c.contact.title}
    </h2>
    <p
      className="text-sm sm:text-base leading-relaxed mb-5"
      style={{ color: 'var(--cyan-100)', opacity: 0.85 }}
    >
      {c.contact.body}
    </p>
    <HologramButton
      as="a"
      href={`mailto:${APP_CONTACT_EMAIL}?subject=${encodeURIComponent(
        c.contact.ctaSubject,
      )}&body=${encodeURIComponent(c.contact.ctaBody)}`}
      icon={<Mail size={14} />}
    >
      {c.contact.cta}
    </HologramButton>
  </HologramCard>
</div>
```

- [ ] **Step 4: Typecheck + lint**

```bash
npx tsc -b
npm run lint
```
Expected: pass.

- [ ] **Step 5: Verify in browser**

Reload the page.
Expected:
- A new HologramCard appears below the FAQ with title "¿Necesitás más ayuda?" / "Need more help?".
- The "Enviar correo" / "Send email" button is styled as a hologram button with a mail icon.
- Clicking the button opens the OS mail client with:
  - To: `oscardeveloper14@gmail.com`
  - Subject: "Solicitud de soporte Stickerswap" or "Stickerswap support request"
  - Body: pre-filled template with the placeholder lines
- Language switch updates all contact strings.

- [ ] **Step 6: Commit**

```bash
git add src/legal/StickerswapSupport.tsx
git commit -m "feat(stickerswap): add contact section with mailto CTA"
```

---

## Task 5: Add useful links section

**Files:**
- Modify: `src/legal/StickerswapSupport.tsx`

- [ ] **Step 1: Extend content with links strings**

In `src/legal/StickerswapSupport.tsx`, add a `links` block to both `es` and `en` inside `content`:

```tsx
// inside content.es
links: {
  title: 'Enlaces útiles',
  items: [
    { to: '/apps/stickerswap/privacy', label: 'Política de privacidad', icon: 'shield' },
    { to: '/apps/stickerswap/terms', label: 'Términos y condiciones', icon: 'fileText' },
    { to: '/apps/stickerswap/delete-account', label: 'Eliminar cuenta', icon: 'userX' },
  ],
},
```

```tsx
// inside content.en
links: {
  title: 'Useful links',
  items: [
    { to: '/apps/stickerswap/privacy', label: 'Privacy policy', icon: 'shield' },
    { to: '/apps/stickerswap/terms', label: 'Terms of service', icon: 'fileText' },
    { to: '/apps/stickerswap/delete-account', label: 'Delete account', icon: 'userX' },
  ],
},
```

- [ ] **Step 2: Import the link icons**

Update the lucide-react import line:

```tsx
import { ChevronDown, Mail, Shield, FileText, UserX } from 'lucide-react';
```

- [ ] **Step 3: Add a small helper to map icon names to components**

Inside the file, above `export default function StickerswapSupport`, add:

```tsx
const linkIconMap = {
  shield: Shield,
  fileText: FileText,
  userX: UserX,
} as const;

type LinkIconName = keyof typeof linkIconMap;
```

- [ ] **Step 4: Render the useful links card**

In the JSX of `StickerswapSupport`, after the contact `HologramCard` block and before the footer `<div>`, add:

```tsx
<div className="mt-8">
  <HologramCard>
    <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--cyan-400)' }}>
      {c.links.title}
    </h2>
    <ul className="space-y-3">
      {c.links.items.map((link) => {
        const Icon = linkIconMap[link.icon as LinkIconName];
        return (
          <li key={link.to}>
            <Link
              to={link.to}
              className="inline-flex items-center gap-3 text-sm sm:text-base"
              style={{ color: 'var(--cyan-100)' }}
              {...cursor}
            >
              <Icon size={16} style={{ color: 'var(--cyan-400)' }} />
              <span style={{ borderBottom: '1px solid rgba(0,212,255,0.3)' }}>{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  </HologramCard>
</div>
```

- [ ] **Step 5: Typecheck + lint**

```bash
npx tsc -b
npm run lint
```
Expected: pass.

- [ ] **Step 6: Verify in browser**

Reload the page.
Expected:
- A new HologramCard appears below the contact section with title "Enlaces útiles" / "Useful links".
- Three links, each with their respective lucide icon (Shield, FileText, UserX) on the left in cyan-400.
- Clicking each link navigates to the corresponding legal page (`/privacy`, `/terms`, `/delete-account`).
- Custom cursor hover state activates on each link.
- Language switch updates the title and labels.

- [ ] **Step 7: Commit**

```bash
git add src/legal/StickerswapSupport.tsx
git commit -m "feat(stickerswap): add useful links section"
```

---

## Task 6: Final verification + production build

**Files:** none (only running commands)

- [ ] **Step 1: Full typecheck + lint + build**

```bash
npx tsc -b
npm run lint
npm run build
```
Expected: all three commands succeed with no errors. The `npm run build` step runs `tsc -b && vite build` per `package.json`.

- [ ] **Step 2: Preview the production bundle**

```bash
npm run preview
```
Open `http://localhost:4173/apps/stickerswap/support` in the browser.
Expected: the production-built page loads identically to dev. SPA routing works (no 404 on direct URL hit — Vercel rewrite is already configured in `vercel.json`).

- [ ] **Step 3: Run the full manual testing plan**

Walk through the testing plan from the spec (`docs/superpowers/specs/2026-05-23-stickerswap-support-design.md`, Section 8):

- [ ] Page accessible at `/apps/stickerswap/support` (preview server).
- [ ] "← Volver al inicio" navigates to `/`.
- [ ] Language switch (es ↔ en) updates all content (headers, FAQ, contact, links).
- [ ] Each accordion opens and closes smoothly (test on a mobile viewport using DevTools).
- [ ] Opening an item in a card closes the previously open one in that same card.
- [ ] Items in different cards can be open simultaneously.
- [ ] Mailto opens with correct subject and body.
- [ ] Inline links in FAQ answers (`/delete-account`, `/privacy`, `/terms`) navigate correctly.
- [ ] Useful links section: all three links navigate.
- [ ] Custom cursor hover works on accordion buttons and links.
- [ ] Responsive: layout legible at 375px (iPhone SE), 768px (tablet), 1280px (desktop).
- [ ] Keyboard navigation: Tab through accordion buttons, Enter/Space expands.
- [ ] DevTools → Accessibility: buttons have `aria-expanded` matching state, panels have `role="region"`.
- [ ] `LAST_UPDATED` displays correctly under the subtitle.

- [ ] **Step 4: If any issue is found, fix it and re-commit**

For each issue, make a focused fix and commit it with a clear message (e.g., `fix(stickerswap): collapse-on-outside-click bug`). Do not bundle unrelated fixes.

- [ ] **Step 5: Final wrap-up commit (only if there were no fixes in Step 4)**

Nothing to commit if Step 4 produced no changes. Otherwise, the commits from Step 4 are the wrap-up.

- [ ] **Step 6: Report to user**

Tell the user the implementation is complete and the page is available at `/apps/stickerswap/support`. List the commits made and any open follow-ups (e.g., "Footer of the home does not currently include legal links — if you want a link to Support from there, that's a separate change.").

---

## Summary of files changed

| File | Change |
|---|---|
| `src/legal/StickerswapSupport.tsx` | Created — page component with FAQ accordion, contact, useful links, i18n |
| `src/App.tsx` | Modified — import + `<Route>` for `/apps/stickerswap/support` |

## Summary of commits

1. `feat(stickerswap): scaffold support page route and skeleton`
2. `feat(stickerswap): add FAQ content and category cards (static)`
3. `feat(stickerswap): convert FAQ to accordion with framer-motion`
4. `feat(stickerswap): add contact section with mailto CTA`
5. `feat(stickerswap): add useful links section`
6. (Optional) Bug-fix commits from Task 6 Step 4

---

## Notes / Open items

- The home page footer (`src/components/Footer.tsx`) currently doesn't reference legal pages. If a "Support" link should be added to the global footer or to the Home section, that's a separate change — out of scope for this plan.
- No analytics or telemetry is wired up for this page.
- No SEO meta tags are added — the existing SPA setup serves a single `index.html` for all routes. If SEO becomes important, that would be a separate piece of work (likely SSR or pre-rendering).
