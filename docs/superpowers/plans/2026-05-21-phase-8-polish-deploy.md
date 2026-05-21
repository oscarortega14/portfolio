# Phase 8 — Polish + Legal + Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the site. Port the real legal page content (Stickerswap privacy / terms / delete-account) from the old portfolio into the new cyan visual identity, replace the default Vite favicon with a brand SVG, add OpenGraph + Twitter card meta tags pointing to a custom social image, add a `vercel.json` so SPA routes work in production, finalize the README, and document the Vercel deploy steps.

**Architecture:** Legal content lives in a typed module (`src/legal/legalContent.ts`). A `LegalLayout` component re-skins it in the hologram visual language (HologramCard sections, cyan accents instead of red). The special-case Delete Account page gets its own component because its structure (two numbered options + data-deleted list + contact) is richer than the generic "sections" shape.

A static SVG favicon and OG image live in `public/`. Meta tags reference them. `vercel.json` is minimal — just the SPA catch-all rewrite. Deploy is documented but executed by the user (Vercel auth + repo connection are user actions).

**Spec:** `docs/superpowers/specs/2026-05-21-portfolio-2026-design.md`

---

## File map

**Created:**
- `src/legal/legalContent.ts` — typed legal content (privacy + terms in en/es)
- `src/legal/LegalLayout.tsx` — shared layout for privacy & terms
- `public/favicon.svg`
- `public/og-image.svg`
- `vercel.json`

**Modified:**
- `src/legal/StickerswapPrivacy.tsx` — wire LegalLayout + content
- `src/legal/StickerswapTerms.tsx` — wire LegalLayout + content
- `src/legal/DeleteAccountPage.tsx` — full content, hologram styling
- `index.html` — OG / Twitter / favicon meta tags
- `README.md` — deployment section

---

## Tasks

### Task 1: Create typed `legalContent.ts`

- [ ] **Step 1: Create the file**

File: `/Users/oscarortega/projects/portfolio-2026/src/legal/legalContent.ts`

(See full content below — copied from the old portfolio's `legalContent.js`, converted to TypeScript with proper types and the `LAST_UPDATED` bumped to today.)

```ts
import type { Locale } from '@/types/content';

export const APP_NAME = 'Stickerswap';
export const APP_DEVELOPER = 'Oscar Ortega';
export const APP_CONTACT_EMAIL = 'oscardeveloper14@gmail.com';
export const LAST_UPDATED = '2026-05-21';

export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalDocument = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export type LegalContent = Record<Locale, LegalDocument>;

export const privacyContent: LegalContent = {
  es: {
    title: 'Política de privacidad',
    subtitle: `${APP_NAME} — aplicación móvil para gestionar el álbum Panini del Mundial 2026`,
    lastUpdated: 'Última actualización',
    intro:
      `Esta política describe cómo ${APP_NAME} ("la aplicación", "nosotros") recopila, usa y protege la información de los usuarios. Al usar la aplicación aceptas las prácticas aquí descritas.`,
    sections: [
      {
        heading: '1. Responsable del tratamiento',
        body: [
          `La aplicación ${APP_NAME} es desarrollada y mantenida por ${APP_DEVELOPER} como proyecto personal.`,
          `Contacto: ${APP_CONTACT_EMAIL}`,
        ],
      },
      {
        heading: '2. Datos que recopilamos',
        body: [
          'Al iniciar sesión con Google: dirección de correo, nombre público y foto de perfil asociadas a tu cuenta de Google, junto con el identificador único que Google nos provee.',
          'Datos generados por tu uso: figuritas marcadas como pegadas o repetidas, equipos vistos, lista de amigos aceptados, código de invitación, fecha de creación de cuenta.',
          'Datos técnicos mínimos: timestamps de sincronización y errores ocurridos durante la sincronización con el servidor.',
        ],
      },
      {
        heading: '3. Datos que NO recopilamos',
        body: [
          'No usamos analytics de terceros (no Google Analytics, Firebase Analytics, Mixpanel, etc.).',
          'No mostramos publicidad ni compartimos datos con redes publicitarias.',
          'No recopilamos ubicación, contactos, fotos, micrófono ni cámara más allá de lo estrictamente necesario para escanear códigos QR de amigos (la imagen no se almacena).',
        ],
      },
      {
        heading: '4. Cómo usamos los datos',
        body: [
          'Para autenticarte y mantener tu sesión iniciada.',
          'Para sincronizar tu progreso del álbum entre dispositivos.',
          'Para permitirte agregar amigos y ver coincidencias entre tus repetidas y las suyas.',
          'No vendemos, alquilamos ni cedemos tus datos a terceros con fines comerciales.',
        ],
      },
      {
        heading: '5. Almacenamiento y seguridad',
        body: [
          'Los datos se almacenan en infraestructura segura de Supabase (PostgreSQL administrado). Las conexiones se realizan vía HTTPS/TLS.',
          'El acceso a tus datos está restringido a tu propia cuenta. Tu progreso solo es visible para ti, y para los amigos que aceptes explícitamente (a quienes se les muestra qué figuritas tienes repetidas o te faltan, para facilitar el intercambio).',
          'Las credenciales de sesión se guardan localmente en almacenamiento seguro del sistema operativo (Keychain en iOS, equivalente en Android).',
        ],
      },
      {
        heading: '6. Compartir datos con otros usuarios',
        body: [
          'Cuando aceptas una amistad, el otro usuario puede ver: tu nombre público, tu @username, cuáles figuritas tienes repetidas y cuáles te faltan.',
          'Nunca compartimos tu correo electrónico con otros usuarios de la aplicación.',
          'Puedes eliminar una amistad en cualquier momento; al hacerlo, el otro usuario deja de ver tu progreso.',
        ],
      },
      {
        heading: '7. Retención de datos',
        body: [
          'Conservamos tus datos mientras tu cuenta esté activa.',
          'Cuando eliminas tu cuenta desde la aplicación, todos tus datos personales y de progreso se eliminan de forma inmediata de nuestros servidores y también de la base de datos local del dispositivo. Las copias de seguridad rotativas se purgan completamente dentro de los 30 días.',
        ],
      },
      {
        heading: '8. Eliminación de cuenta y datos',
        body: [
          `Puedes eliminar tu cuenta y todos los datos asociados directamente desde la aplicación: Perfil → "Borrar cuenta". La acción es inmediata e irreversible y elimina tu perfil, tu progreso del álbum, tus amistades, tus intercambios y cualquier dato vinculado a tu cuenta.`,
          'La aplicación también limpia la base de datos local del dispositivo (progreso, cola de sincronización, caché de amigos e intercambios) y cierra tu sesión automáticamente. Únicamente quedan en el dispositivo las preferencias cosméticas no vinculadas a tu identidad (tema visual e idioma de la app), que podés eliminar desinstalando la aplicación.',
          `Si tenés problemas con la eliminación in-app o necesitás asistencia, escribinos a ${APP_CONTACT_EMAIL} desde la cuenta de Google con la que registraste la aplicación y procesaremos manualmente la solicitud dentro de los 30 días.`,
        ],
      },
      {
        heading: '9. Menores de edad',
        body: [
          'La aplicación no está dirigida a menores de 13 años. Si descubrimos que recopilamos datos de un menor de 13 sin consentimiento parental verificable, los eliminaremos.',
        ],
      },
      {
        heading: '10. Tus derechos',
        body: [
          'Tienes derecho a acceder, rectificar y eliminar tus datos personales, así como a oponerte a su tratamiento.',
          `Para ejercer estos derechos, contáctanos a ${APP_CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: '11. Cambios a esta política',
        body: [
          'Podemos actualizar esta política ocasionalmente. La fecha de la última revisión se indica al inicio del documento. Cambios sustanciales se comunicarán dentro de la aplicación.',
        ],
      },
      {
        heading: '12. Contacto',
        body: [
          `Para cualquier consulta sobre esta política o sobre tus datos, escríbenos a ${APP_CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    subtitle: `${APP_NAME} — mobile app to manage the 2026 FIFA World Cup Panini album`,
    lastUpdated: 'Last updated',
    intro:
      `This policy describes how ${APP_NAME} ("the app", "we") collects, uses and protects user information. By using the app you accept the practices described herein.`,
    sections: [
      { heading: '1. Data controller',
        body: [`${APP_NAME} is developed and maintained by ${APP_DEVELOPER} as a personal project.`, `Contact: ${APP_CONTACT_EMAIL}`] },
      { heading: '2. Data we collect',
        body: [
          'When you sign in with Google: email address, public display name and profile picture associated with your Google account, along with the unique identifier Google provides.',
          'Data you generate by using the app: stickers marked as owned or duplicates, teams viewed, list of accepted friends, invitation code, account creation date.',
          'Minimal technical data: synchronization timestamps and errors that occur while syncing with the server.',
        ] },
      { heading: '3. Data we do NOT collect',
        body: [
          'We do not use third-party analytics (no Google Analytics, Firebase Analytics, Mixpanel, etc.).',
          'We do not show advertising or share data with ad networks.',
          'We do not collect location, contacts, photos, microphone or camera beyond what is strictly required to scan friend QR codes (the image is not stored).',
        ] },
      { heading: '4. How we use the data',
        body: [
          'To authenticate you and keep your session active.',
          'To sync your album progress across devices.',
          'To let you add friends and view trade matches between your duplicates and theirs.',
          'We do not sell, rent or transfer your data to third parties for commercial purposes.',
        ] },
      { heading: '5. Storage and security',
        body: [
          'Data is stored on Supabase infrastructure (managed PostgreSQL). Connections use HTTPS/TLS.',
          'Access to your data is restricted to your own account. Your progress is visible only to you and to friends you explicitly accept (they can see which stickers you have as duplicates or are missing, to facilitate trades).',
          'Session credentials are stored locally in the operating system’s secure storage (Keychain on iOS, equivalent on Android).',
        ] },
      { heading: '6. Sharing data with other users',
        body: [
          'When you accept a friendship, the other user can see: your public name, your @username, which stickers you have as duplicates and which you are missing.',
          'We never share your email address with other app users.',
          'You can remove a friendship at any time; once removed, the other user can no longer see your progress.',
        ] },
      { heading: '7. Data retention',
        body: [
          'We retain your data while your account is active.',
          'When you delete your account from within the app, all your personal and progress data is immediately removed from both our servers and the local database on the device. Rotating backups are fully purged within 30 days.',
        ] },
      { heading: '8. Account and data deletion',
        body: [
          'You can delete your account and all associated data directly from the app: Profile → "Delete account". The action is immediate and irreversible, and removes your profile, album progress, friendships, trades and any data linked to your account.',
          'The app also wipes the local on-device database (progress, sync queue, friends and trades cache) and signs you out automatically. The only data that remains on the device is cosmetic preferences not tied to your identity (app theme and language), which you can remove by uninstalling the application.',
          `If you have trouble with in-app deletion or need assistance, write to us at ${APP_CONTACT_EMAIL} from the Google account you used to register and we will process the request manually within 30 days.`,
        ] },
      { heading: '9. Children',
        body: ['The app is not directed to children under 13. If we learn we have collected data from a child under 13 without verifiable parental consent, we will delete it.'] },
      { heading: '10. Your rights',
        body: [
          'You have the right to access, rectify and delete your personal data, as well as to object to its processing.',
          `To exercise these rights, contact us at ${APP_CONTACT_EMAIL}.`,
        ] },
      { heading: '11. Changes to this policy',
        body: ['We may update this policy occasionally. The date of the latest revision is indicated at the top of the document. Substantial changes will be communicated within the app.'] },
      { heading: '12. Contact',
        body: [`For any question about this policy or your data, write to us at ${APP_CONTACT_EMAIL}.`] },
    ],
  },
};

export const termsContent: LegalContent = {
  es: {
    title: 'Términos y condiciones',
    subtitle: `${APP_NAME} — aplicación móvil para gestionar el álbum Panini del Mundial 2026`,
    lastUpdated: 'Última actualización',
    intro:
      `Estos términos rigen el uso de la aplicación ${APP_NAME}. Al instalar y utilizar la aplicación, aceptas estos términos en su totalidad. Si no estás de acuerdo, por favor no uses la aplicación.`,
    sections: [
      { heading: '1. Descripción del servicio',
        body: [
          `${APP_NAME} es una aplicación gratuita que permite a los usuarios llevar registro de las figuritas del álbum Panini del Mundial 2026, identificar repetidas y faltantes, y coordinar intercambios con otros usuarios.`,
          'La aplicación no está afiliada, patrocinada ni avalada por Panini, FIFA, ni ninguna otra entidad oficial. Es un proyecto personal sin fines comerciales.',
        ] },
      { heading: '2. Uso aceptable',
        body: [
          'Te comprometes a usar la aplicación únicamente para fines personales y legales.',
          'Está prohibido: usar la aplicación para acosar a otros usuarios, suplantar identidad, enviar spam, hacer ingeniería inversa, explotar vulnerabilidades, o cualquier otro uso que dañe la experiencia de otros.',
          'Nos reservamos el derecho de suspender o eliminar cuentas que incumplan estos términos.',
        ] },
      { heading: '3. Cuenta y registro',
        body: [
          'Necesitas una cuenta de Google válida para iniciar sesión. Eres responsable de mantener la confidencialidad de tu cuenta.',
          'Debes elegir un @username público al registrarte. No se permiten usernames ofensivos, suplantadores ni que infrinjan derechos de terceros.',
        ] },
      { heading: '4. Contenido generado por el usuario',
        body: [
          'Los datos que generes (qué figuritas tienes, tus amigos, etc.) te pertenecen. Nos concedes una licencia limitada para almacenarlos y mostrarlos a quien tú autorices (tus amigos aceptados), únicamente con el fin de proveer el servicio.',
          'No publicamos tus datos fuera de la aplicación.',
        ] },
      { heading: '5. Propiedad intelectual',
        body: [
          'Los nombres, escudos, fotografías y diseños de equipos, jugadores, Panini y FIFA pertenecen a sus respectivos titulares. La aplicación utiliza únicamente referencias mínimas necesarias para identificar las figuritas (códigos, números y nombres de equipos).',
          `El código y diseño de la aplicación son propiedad de ${APP_DEVELOPER}.`,
        ] },
      { heading: '6. Disponibilidad y "tal cual"',
        body: [
          'La aplicación se ofrece "tal cual" y "según disponibilidad", sin garantías de ningún tipo, expresas o implícitas.',
          'No garantizamos que el servicio esté libre de errores, interrupciones o pérdida de datos, aunque hacemos esfuerzos razonables para mantenerlo operativo.',
        ] },
      { heading: '7. Limitación de responsabilidad',
        body: [
          'En la máxima medida permitida por la ley, no seremos responsables por daños indirectos, incidentales, especiales o consecuentes derivados del uso de la aplicación, incluyendo pérdida de datos o de oportunidades de intercambio.',
          'Tu único recurso en caso de insatisfacción es dejar de usar la aplicación.',
        ] },
      { heading: '8. Modificaciones',
        body: [
          'Podemos modificar la aplicación, suspenderla o discontinuarla en cualquier momento sin previo aviso.',
          'Podemos actualizar estos términos. La fecha de la última revisión se indica al inicio. El uso continuado de la aplicación tras un cambio implica aceptación de los nuevos términos.',
        ] },
      { heading: '9. Terminación',
        body: [
          'Puedes dejar de usar la aplicación y solicitar la eliminación de tu cuenta en cualquier momento (ver política de privacidad).',
          'Podemos terminar tu acceso si incumples estos términos.',
        ] },
      { heading: '10. Ley aplicable',
        body: ['Estos términos se rigen por las leyes de la República de Colombia, sin perjuicio de las protecciones obligatorias del consumidor en tu jurisdicción de residencia.'] },
      { heading: '11. Contacto',
        body: [`Para preguntas sobre estos términos, escríbenos a ${APP_CONTACT_EMAIL}.`] },
    ],
  },
  en: {
    title: 'Terms of Service',
    subtitle: `${APP_NAME} — mobile app to manage the 2026 FIFA World Cup Panini album`,
    lastUpdated: 'Last updated',
    intro:
      `These terms govern the use of the ${APP_NAME} application. By installing and using the app, you accept these terms in full. If you do not agree, please do not use the app.`,
    sections: [
      { heading: '1. Service description',
        body: [
          `${APP_NAME} is a free application that lets users track stickers from the 2026 FIFA World Cup Panini album, identify duplicates and missing stickers, and coordinate trades with other users.`,
          'The app is not affiliated, sponsored or endorsed by Panini, FIFA or any other official entity. It is a personal, non-commercial project.',
        ] },
      { heading: '2. Acceptable use',
        body: [
          'You agree to use the app only for personal and lawful purposes.',
          'It is prohibited to: use the app to harass other users, impersonate others, send spam, reverse-engineer it, exploit vulnerabilities, or any other use that harms the experience of others.',
          'We reserve the right to suspend or remove accounts that violate these terms.',
        ] },
      { heading: '3. Account and registration',
        body: [
          'A valid Google account is required to sign in. You are responsible for keeping your account confidential.',
          'You must choose a public @username when registering. Offensive, impersonating or rights-infringing usernames are not allowed.',
        ] },
      { heading: '4. User-generated content',
        body: [
          'The data you generate (which stickers you own, your friends, etc.) belongs to you. You grant us a limited license to store it and show it to those you authorize (your accepted friends), solely to provide the service.',
          'We do not publish your data outside the application.',
        ] },
      { heading: '5. Intellectual property',
        body: [
          'Team names, crests, photographs and designs of teams, players, Panini and FIFA belong to their respective owners. The app uses only the minimal references necessary to identify stickers (codes, numbers and team names).',
          `The application code and design are property of ${APP_DEVELOPER}.`,
        ] },
      { heading: '6. Availability and "as is"',
        body: [
          'The app is provided "as is" and "as available", without warranties of any kind, express or implied.',
          'We do not guarantee that the service will be free of errors, interruptions or data loss, although we make reasonable efforts to keep it operational.',
        ] },
      { heading: '7. Limitation of liability',
        body: [
          'To the maximum extent permitted by law, we will not be liable for indirect, incidental, special or consequential damages arising from the use of the app, including loss of data or trade opportunities.',
          'Your sole remedy in case of dissatisfaction is to stop using the app.',
        ] },
      { heading: '8. Changes',
        body: [
          'We may modify, suspend or discontinue the app at any time without notice.',
          'We may update these terms. The date of the latest revision is indicated at the top. Continued use of the app after a change implies acceptance of the new terms.',
        ] },
      { heading: '9. Termination',
        body: [
          'You may stop using the app and request deletion of your account at any time (see privacy policy).',
          'We may terminate your access if you violate these terms.',
        ] },
      { heading: '10. Governing law',
        body: ['These terms are governed by the laws of the Republic of Colombia, without prejudice to mandatory consumer protections in your jurisdiction of residence.'] },
      { heading: '11. Contact',
        body: [`For questions about these terms, write to us at ${APP_CONTACT_EMAIL}.`] },
    ],
  },
};
```

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/legal/legalContent.ts && git commit -m "feat: port legal content (privacy + terms en/es)"
```

---

### Task 2: Create `LegalLayout` (shared by privacy + terms)

Hologram-skinned layout: HologramCard wrapping each section, cyan accents instead of red, "← Back to home" link at top.

- [ ] **Step 1: Create the component**

File: `/Users/oscarortega/projects/portfolio-2026/src/legal/LegalLayout.tsx`

```tsx
import { Link } from 'react-router-dom';
import { useLocalized } from '@/hooks/useLocalized';
import { useCursorHover } from '@/hooks/useCursorHover';
import HologramCard from '@/components/HologramCard';
import type { LegalContent } from './legalContent';

type Props = {
  content: LegalContent;
  lastUpdated: string;
};

export default function LegalLayout({ content, lastUpdated }: Props) {
  const { locale } = useLocalized();
  const cursor = useCursorHover();
  const c = content[locale];

  return (
    <section className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-8 text-sm font-mono uppercase tracking-widest transition-colors"
          style={{ color: 'var(--cyan-400)' }}
          {...cursor}
        >
          ← {locale === 'es' ? 'Volver al inicio' : 'Back to home'}
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
            {c.lastUpdated}: {lastUpdated}
          </p>
        </header>

        <p
          className="text-sm sm:text-base leading-relaxed mb-10"
          style={{ color: 'var(--cyan-100)', opacity: 0.85 }}
        >
          {c.intro}
        </p>

        <div className="space-y-6">
          {c.sections.map((section) => (
            <HologramCard key={section.heading}>
              <h2
                className="text-lg sm:text-xl font-semibold mb-3"
                style={{ color: 'var(--cyan-400)' }}
              >
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: 'var(--cyan-100)', opacity: 0.85 }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </HologramCard>
          ))}
        </div>

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

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/legal/LegalLayout.tsx && git commit -m "feat: add LegalLayout with hologram styling"
```

---

### Task 3: Wire `StickerswapPrivacy` and `StickerswapTerms`

- [ ] **Step 1: Replace `StickerswapPrivacy.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/legal/StickerswapPrivacy.tsx`

```tsx
import LegalLayout from './LegalLayout';
import { privacyContent, LAST_UPDATED } from './legalContent';

export default function StickerswapPrivacy() {
  return <LegalLayout content={privacyContent} lastUpdated={LAST_UPDATED} />;
}
```

- [ ] **Step 2: Replace `StickerswapTerms.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/legal/StickerswapTerms.tsx`

```tsx
import LegalLayout from './LegalLayout';
import { termsContent, LAST_UPDATED } from './legalContent';

export default function StickerswapTerms() {
  return <LegalLayout content={termsContent} lastUpdated={LAST_UPDATED} />;
}
```

- [ ] **Step 3: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/legal/StickerswapPrivacy.tsx src/legal/StickerswapTerms.tsx && git commit -m "feat: wire Privacy and Terms pages to LegalLayout"
```

---

### Task 4: Build `DeleteAccountPage`

This one has a unique structure: two numbered options + a "what data is deleted" list + contact. Hand-built in the hologram style.

- [ ] **Step 1: Replace `DeleteAccountPage.tsx`**

File: `/Users/oscarortega/projects/portfolio-2026/src/legal/DeleteAccountPage.tsx`

```tsx
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import HologramCard from '@/components/HologramCard';
import HologramButton from '@/components/HologramButton';
import Tag from '@/components/Tag';
import { useLocalized } from '@/hooks/useLocalized';
import { useCursorHover } from '@/hooks/useCursorHover';
import { APP_CONTACT_EMAIL, LAST_UPDATED } from './legalContent';

const content = {
  es: {
    title: 'Eliminar tu cuenta de Stickerswap',
    subtitle: 'Solicitud de eliminación de cuenta y datos asociados',
    lastUpdated: 'Última actualización',
    back: 'Volver al inicio',
    intro:
      'Podés eliminar tu cuenta de Stickerswap y todos los datos asociados en cualquier momento. Tenés dos opciones disponibles:',
    option1: {
      label: 'Recomendado',
      title: 'Opción 1 — Eliminar desde la aplicación',
      description: 'La forma más rápida. Es inmediata y no requiere intervención manual.',
      steps: [
        'Abrí la aplicación Stickerswap en tu dispositivo.',
        'Iniciá sesión con la cuenta de Google que querés eliminar.',
        'Andá a la pestaña "Perfil" (ícono inferior derecho).',
        'Bajá hasta el final y tocá el botón "Borrar cuenta".',
        'Confirmá la acción en el diálogo de confirmación.',
      ],
      result:
        'Tu cuenta, tu progreso del álbum, tus amistades, tus intercambios y todos los datos vinculados se eliminan inmediatamente de los servidores. La app también limpia la base de datos local del dispositivo y cierra la sesión automáticamente.',
    },
    option2: {
      title: 'Opción 2 — Solicitar por correo electrónico',
      description:
        'Si no podés acceder a la aplicación o tenés algún problema con el flujo in-app, podés solicitar la eliminación manualmente.',
      instructions: [
        `Enviá un correo a ${APP_CONTACT_EMAIL} desde la dirección de Google con la que registraste la cuenta.`,
        'Indicá en el asunto "Solicitud de eliminación de cuenta".',
        'En el cuerpo, incluí tu @username de Stickerswap si lo recordás (no es obligatorio).',
        'Procesaremos la solicitud y eliminaremos manualmente todos tus datos dentro de los 30 días posteriores al recibo. Recibirás confirmación una vez completada.',
      ],
      cta: 'Enviar correo de solicitud',
      ctaSubject: 'Solicitud de eliminación de cuenta Stickerswap',
      ctaBody:
        'Hola, solicito la eliminación completa de mi cuenta de Stickerswap y todos los datos asociados.\n\n@username (opcional): ',
    },
    dataDeleted: {
      title: '¿Qué datos se eliminan?',
      items: [
        'Identidad de autenticación (vínculo con tu cuenta de Google y email asociado).',
        'Perfil público (@username, nombre visible, foto de perfil, ciudad si la cargaste).',
        'Progreso del álbum (figuritas pegadas, repetidas, equipos vistos).',
        'Lista de amistades (en ambos sentidos) y solicitudes pendientes.',
        'Intercambios propuestos, aceptados o completados.',
        'Mensajes intercambiados en solicitudes de amistad y trades.',
        'Datos de contacto opcionales (número de WhatsApp si lo cargaste).',
        'Base de datos local del dispositivo (cola de sincronización, caché de amigos e intercambios).',
      ],
      retention:
        'Las copias de seguridad rotativas en los servidores se purgan completamente dentro de los 30 días.',
      kept:
        'Únicamente quedan en el dispositivo las preferencias cosméticas (tema visual e idioma) que podés eliminar desinstalando la aplicación.',
    },
    contact: {
      title: '¿Necesitás ayuda?',
      body: `Si tenés cualquier consulta sobre el proceso de eliminación, escribinos a ${APP_CONTACT_EMAIL}.`,
    },
  },
  en: {
    title: 'Delete your Stickerswap account',
    subtitle: 'Account and associated data deletion request',
    lastUpdated: 'Last updated',
    back: 'Back to home',
    intro:
      'You can delete your Stickerswap account and all associated data at any time. Two options are available:',
    option1: {
      label: 'Recommended',
      title: 'Option 1 — Delete from the app',
      description: 'The fastest way. It is immediate and requires no manual intervention.',
      steps: [
        'Open the Stickerswap app on your device.',
        'Sign in with the Google account you want to delete.',
        'Go to the "Profile" tab (bottom-right icon).',
        'Scroll to the bottom and tap the "Delete account" button.',
        'Confirm the action in the confirmation dialog.',
      ],
      result:
        'Your account, album progress, friendships, trades and all linked data are immediately removed from our servers. The app also wipes the local on-device database and signs you out automatically.',
    },
    option2: {
      title: 'Option 2 — Request by email',
      description:
        'If you cannot access the app or have any problem with the in-app flow, you can request deletion manually.',
      instructions: [
        `Send an email to ${APP_CONTACT_EMAIL} from the Google address you used to register your account.`,
        'Use "Account deletion request" as the subject.',
        'In the body, include your Stickerswap @username if you remember it (not required).',
        'We will process the request and manually delete all your data within 30 days of receipt. You will receive confirmation once completed.',
      ],
      cta: 'Send request email',
      ctaSubject: 'Stickerswap account deletion request',
      ctaBody:
        'Hi, I am requesting full deletion of my Stickerswap account and all associated data.\n\n@username (optional): ',
    },
    dataDeleted: {
      title: 'What data is deleted?',
      items: [
        'Authentication identity (link to your Google account and associated email).',
        'Public profile (@username, display name, profile picture, city if you set one).',
        'Album progress (stickers owned, duplicates, teams viewed).',
        'Friendships list (both sides) and pending requests.',
        'Trades proposed, accepted or completed.',
        'Messages exchanged in friend requests and trades.',
        'Optional contact data (WhatsApp number if you provided it).',
        'Local on-device database (sync queue, friends and trades cache).',
      ],
      retention:
        'Rotating server backups are fully purged within 30 days.',
      kept:
        'The only data that remains on the device is cosmetic preferences (app theme and language), which you can remove by uninstalling the application.',
    },
    contact: {
      title: 'Need help?',
      body: `If you have any question about the deletion process, write to us at ${APP_CONTACT_EMAIL}.`,
    },
  },
} as const;

export default function DeleteAccountPage() {
  const { locale } = useLocalized();
  const cursor = useCursorHover();
  const c = content[locale];

  const mailtoHref = `mailto:${APP_CONTACT_EMAIL}?subject=${encodeURIComponent(
    c.option2.ctaSubject,
  )}&body=${encodeURIComponent(c.option2.ctaBody)}`;

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

        <HologramCard style={{ marginBottom: 32 }}>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <Tag size="sm">{c.option1.label}</Tag>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--cyan-400)' }}>
              {c.option1.title}
            </h2>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
            {c.option1.description}
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            {c.option1.steps.map((step, idx) => (
              <li key={idx} className="text-sm" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
                {step}
              </li>
            ))}
          </ol>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--cyan-300)', opacity: 0.85 }}>
            {c.option1.result}
          </p>
        </HologramCard>

        <HologramCard style={{ marginBottom: 40 }}>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--cyan-400)' }}>
            {c.option2.title}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
            {c.option2.description}
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-5">
            {c.option2.instructions.map((step, idx) => (
              <li key={idx} className="text-sm" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
                {step}
              </li>
            ))}
          </ol>
          <HologramButton as="a" href={mailtoHref} icon={<Mail size={14} />}>
            {c.option2.cta}
          </HologramButton>
        </HologramCard>

        <HologramCard style={{ marginBottom: 40 }}>
          <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--cyan-400)' }}>
            {c.dataDeleted.title}
          </h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            {c.dataDeleted.items.map((item, idx) => (
              <li key={idx} className="text-sm leading-relaxed" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--cyan-300)', opacity: 0.85 }}>
            {c.dataDeleted.retention}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--cyan-300)', opacity: 0.65 }}>
            {c.dataDeleted.kept}
          </p>
        </HologramCard>

        <HologramCard>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--cyan-400)' }}>
            {c.contact.title}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
            {c.contact.body}
          </p>
        </HologramCard>

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

- [ ] **Step 2: Type-check + commit**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && git add src/legal/DeleteAccountPage.tsx && git commit -m "feat: build DeleteAccountPage with full content and hologram styling"
```

---

### Task 5: Custom favicon + OG image (SVG)

- [ ] **Step 1: Create `public/favicon.svg`**

File: `/Users/oscarortega/projects/portfolio-2026/public/favicon.svg`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="#050a14"/>
  <text x="32" y="40" font-family="ui-monospace, SFMono-Regular, monospace" font-size="20" font-weight="700"
        text-anchor="middle" fill="#00d4ff" letter-spacing="0">OO</text>
  <text x="32" y="56" font-family="ui-monospace, SFMono-Regular, monospace" font-size="9"
        text-anchor="middle" fill="#22d3ee" letter-spacing="2">2026</text>
</svg>
```

- [ ] **Step 2: Create `public/og-image.svg`**

File: `/Users/oscarortega/projects/portfolio-2026/public/og-image.svg`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#0a1224"/>
      <stop offset="100%" stop-color="#050a14"/>
    </radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- subtle grid lines -->
  <g stroke="rgba(0, 212, 255, 0.08)" stroke-width="1">
    <line x1="0" y1="160" x2="1200" y2="160"/>
    <line x1="0" y1="320" x2="1200" y2="320"/>
    <line x1="0" y1="480" x2="1200" y2="480"/>
    <line x1="200" y1="0" x2="200" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="1000" y1="0" x2="1000" y2="630"/>
  </g>

  <!-- brand glyph -->
  <text x="600" y="240" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="56" font-weight="700"
        text-anchor="middle" fill="#e0fbff" letter-spacing="20" filter="url(#glow)">
    OO<tspan fill="#22d3ee">/</tspan>2026
  </text>

  <!-- name -->
  <text x="600" y="370" font-family="system-ui, -apple-system, sans-serif" font-size="80" font-weight="700"
        text-anchor="middle" fill="#e0fbff" filter="url(#glow)">
    Oscar Ortega
  </text>

  <!-- tagline -->
  <text x="600" y="440" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22"
        text-anchor="middle" fill="#22d3ee" letter-spacing="6">
    SENIOR RUBY ON RAILS ENGINEER
  </text>

  <!-- skill chips -->
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14" fill="#67e8f9">
    <text x="430" y="540" text-anchor="middle">RAILS</text>
    <text x="520" y="540" text-anchor="middle">REACT</text>
    <text x="615" y="540" text-anchor="middle">TYPESCRIPT</text>
    <text x="715" y="540" text-anchor="middle">POSTGRES</text>
    <text x="810" y="540" text-anchor="middle">GCP</text>
  </g>

  <!-- corner ticks -->
  <g stroke="#22d3ee" stroke-width="2" fill="none">
    <path d="M40 40 L40 80 M40 40 L80 40"/>
    <path d="M1160 40 L1160 80 M1160 40 L1120 40"/>
    <path d="M40 590 L40 550 M40 590 L80 590"/>
    <path d="M1160 590 L1160 550 M1160 590 L1120 590"/>
  </g>
</svg>
```

- [ ] **Step 3: Commit**

```bash
git add public/favicon.svg public/og-image.svg && git commit -m "feat: add custom favicon and OG image (cyan hologram)"
```

---

### Task 6: Add OG / Twitter meta tags to `index.html`

The site doesn't have a known production URL yet; use a placeholder that the user updates after first deploy.

- [ ] **Step 1: Update `index.html`**

File: `/Users/oscarortega/projects/portfolio-2026/index.html`

Replace the contents with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#050a14" />
    <link rel="preconnect" href="https://images.pexels.com" crossorigin />
    <link rel="dns-prefetch" href="https://images.pexels.com" />

    <title>Oscar Ortega — portfolio</title>
    <meta name="description" content="Senior Ruby on Rails engineer with hands-on React, TypeScript and cloud infrastructure experience. Portfolio of Oscar Ortega — 3D scroll experience." />

    <!-- OpenGraph -->
    <meta property="og:title" content="Oscar Ortega — portfolio" />
    <meta property="og:description" content="Senior Ruby on Rails engineer. 3D scroll-driven portfolio." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og-image.svg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:locale:alternate" content="es_ES" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Oscar Ortega — portfolio" />
    <meta name="twitter:description" content="Senior Ruby on Rails engineer. 3D scroll-driven portfolio." />
    <meta name="twitter:image" content="/og-image.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

(Note: `og:url` is intentionally omitted — set it after first deploy when the production URL is known. Some platforms prefer PNG over SVG for OG. The user can convert `og-image.svg` to PNG (1200×630) via any vector editor or `rsvg-convert` and reference it instead. SVG works for Twitter and most modern crawlers.)

- [ ] **Step 2: Commit**

```bash
git add index.html && git commit -m "feat: add OG and Twitter card meta tags"
```

---

### Task 7: Add `vercel.json` for SPA routing

Vite SPA needs a catch-all rewrite so deep links (`/apps/stickerswap/privacy`) hit `index.html` instead of returning 404.

- [ ] **Step 1: Create `vercel.json`**

File: `/Users/oscarortega/projects/portfolio-2026/vercel.json`

```json
{
  "rewrites": [
    { "source": "/((?!assets|favicon\\.svg|og-image\\.svg|robots\\.txt|sitemap\\.xml).*)", "destination": "/index.html" }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

The rewrite regex passes through static assets (`/assets/*`, the two SVG files) and rewrites everything else to `index.html`.

- [ ] **Step 2: Commit**

```bash
git add vercel.json && git commit -m "chore: add vercel.json for SPA routing"
```

---

### Task 8: Finalize README with deploy instructions

- [ ] **Step 1: Replace `README.md`**

File: `/Users/oscarortega/projects/portfolio-2026/README.md`

```markdown
# portfolio-2026

Personal portfolio site for Oscar Ortega — single-page scroll experience built with React Three Fiber, Tailwind CSS v4, and GSAP-driven scroll animations.

A custom 3D scene (procedural astronaut, satellite, particle field, grid floor) sits as a fixed background behind five HTML sections (Hero, About, Experience, Projects, Contact). The camera moves between waypoints synced to scroll, the Hero types out roles, section titles reveal word-by-word, and the cursor reacts to both HTML links and 3D objects.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Tech stack

- **Framework:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4 + CSS custom properties (design tokens in `src/styles/tokens.css`)
- **3D:** three.js via `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Animations:** GSAP (+ ScrollTrigger), Lenis (smooth scroll), Framer Motion
- **State:** Zustand (scroll + cursor)
- **i18n:** `react-i18next` (en/es)
- **Routing:** `react-router-dom@7`

## Project structure

```
src/
  components/    Shared UI (HologramCard, HologramButton, CustomCursor, Tag, Footer, Navigation, ...)
  sections/      Page sections (Home composes Hero/About/Experience/Projects/Contact)
  three/         3D scene (Canvas, lighting, objects, camera rig, postprocessing, dev overlay)
  legal/         Stickerswap privacy/terms/delete-account pages
  data/          Mocked content JSON + typed skills
  i18n/          Locale resources (en, es)
  stores/        Zustand stores
  hooks/         Shared hooks
  types/         Shared types
  styles/        Global CSS + design tokens
public/
  favicon.svg
  og-image.svg
```

## Content

All content is mocked in `src/data/` — no backend.

- `experiences.json` — work history
- `projects.json` — featured projects
- `categories.json` — project categories
- `skills.ts` — typed skills list

Legal pages live in `src/legal/legalContent.ts`.

## Dev tooling

- Press `D` in dev mode to enter the camera debug overlay: scroll-driven camera pauses, OrbitControls activate, the on-screen HUD prints live position/lookAt to copy back into `src/three/camera/waypoints.ts`. Tree-shakes out of production.

## Deploying to Vercel

This is a standard Vite SPA. Vercel auto-detects the framework.

1. Push the repo to GitHub (or GitLab / Bitbucket):
   ```bash
   gh repo create portfolio-2026 --public --source=. --push
   ```
2. Go to https://vercel.com/new, import the repo. Vercel detects Vite — no configuration needed.
3. Click **Deploy**. First build takes ~1–2 minutes.
4. After the first successful deploy, add the production URL to `index.html`:
   - `<meta property="og:url" content="https://your-domain.example/" />`
5. Optional: connect a custom domain in Vercel → Settings → Domains.

The included `vercel.json` handles SPA rewrites so `/apps/stickerswap/*` deep links serve `index.html`.

## OpenGraph image

`public/og-image.svg` is a 1200×630 hologram-style social card. Twitter and most modern crawlers accept SVG; if you find a platform that doesn't (some older Facebook/LinkedIn cards), convert it to PNG:

```bash
# requires librsvg
rsvg-convert -w 1200 -h 630 public/og-image.svg -o public/og-image.png
# then update the OG meta tags in index.html to reference the PNG
```

## Credits & Inspiration

This portfolio was inspired by [David Heckhoff's portfolio (portfolio-2025)](https://david-hckh.com) — a Vue 3 + three.js project that pioneered the scroll-driven 3D experience pattern used here. portfolio-2026 is an independent re-implementation in the React ecosystem with original 3D assets, custom shaders, and a different visual identity. The original project's design and code are credited to David Heckhoff.
```

- [ ] **Step 2: Commit**

```bash
git add README.md && git commit -m "docs: finalize README with structure, tech stack, deploy steps"
```

---

### Task 9: Final verification

- [ ] **Step 1: Type-check + production build + lint**

```bash
export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && npx tsc --noEmit -p tsconfig.app.json && rm -rf dist && npm run build 2>&1 | tail -10 && npm run lint 2>&1 | tail -10
```
Expected: all clean. The static SVGs in `public/` ship to `dist/`.

- [ ] **Step 2: Verify dist contents**

```bash
/bin/ls -lh /Users/oscarortega/projects/portfolio-2026/dist/
/bin/ls /Users/oscarortega/projects/portfolio-2026/dist/assets/
```
Expected: `favicon.svg`, `og-image.svg`, `index.html`, `vercel.json`, `assets/`, `*.js`, `*.css`.

- [ ] **Step 3: Smoke-test the production build locally**

```bash
pkill -f "vite" 2>/dev/null; sleep 1; export PATH="$HOME/.local/share/mise/installs/node/22.13.0/bin:$PATH" && cd /Users/oscarortega/projects/portfolio-2026 && (npm run preview > /tmp/p26.log 2>&1 & echo $! > /tmp/p26.pid) && sleep 5 && curl -s -o /dev/null -w "/ → HTTP %{http_code}\n" http://localhost:4173/ && curl -s -o /dev/null -w "/apps/stickerswap/privacy → HTTP %{http_code}\n" http://localhost:4173/apps/stickerswap/privacy ; kill $(cat /tmp/p26.pid) 2>/dev/null
```
Expected: HTTP 200 on both. (`vite preview` serves the `dist/` build.)

- [ ] **Step 4: Manual browser verification**

```bash
cd /Users/oscarortega/projects/portfolio-2026 && npm run dev
```

In `http://localhost:5173/`:

- [ ] **Favicon**: browser tab shows the cyan "OO/2026" mark (may need a hard refresh or new tab to bust the old default favicon)
- [ ] **Hero / scroll / 3D / preloader**: still working as in Phase 7
- [ ] `/apps/stickerswap/privacy`: full Privacy policy renders with hologram cards
- [ ] `/apps/stickerswap/terms`: full Terms of Service renders with hologram cards
- [ ] `/apps/stickerswap/delete-account`: "Delete your Stickerswap account" page with two options, data-deleted list, contact card. "Send request email" button has hologram styling and prefills mailto subject/body
- [ ] **Lang switch** on legal pages: not visible (no Navigation on those pages) — but `?lng=es` in URL switches; OR use the lang switch on the home, then deep-link into a legal page from there
  - Note: legal pages don't include the main Navigation. Use the "← Back to home" link to return.
- [ ] **OG image**: open `http://localhost:5173/og-image.svg` directly — confirm it renders the 1200×630 social card
- [ ] **Lazy-loaded Scene**: still works
- [ ] **Custom cursor, hologram cards/buttons, preloader, intro dolly, scroll camera**: all working from earlier phases

- [ ] **Step 5: Optional — verify OG card preview**

Paste the eventual production URL (after first deploy) into:
- https://www.opengraph.xyz/
- https://cards-dev.twitter.com/validator

…to confirm the OG image renders as expected.

- [ ] **Step 6: Final git status check**

```bash
cd /Users/oscarortega/projects/portfolio-2026 && git status && git log --oneline | head -20
```
Expected: clean working tree, all commits landed.

- [ ] **Step 7: If anything is off, report**; otherwise Phase 8 is complete.

---

## Phase 8 Deliverable

- Stickerswap privacy + terms + delete-account pages fully populated with the real legal content from the previous portfolio, restyled in the hologram visual language
- Custom cyan SVG favicon
- 1200×630 SVG OpenGraph image with brand glyph, name, role and tech chips
- OpenGraph + Twitter card meta tags in `index.html`
- `vercel.json` for SPA routing
- README finalized with project structure, tech stack, dev tooling notes, deploy steps, OG → PNG conversion note, and the David Heckhoff credit
- Production build verified locally via `npm run preview`

---

## Project complete

After Phase 8, the project is feature-complete per the original design document. Open questions / follow-ups the user may want to tackle later:

- Swap the procedural astronaut for a CC0/CC-BY GLB from Sketchfab (one-line change in `src/three/objects/Astronaut.tsx`)
- Tune waypoint coordinates using the dev camera overlay (press `D`)
- Convert `og-image.svg` to PNG if Facebook/LinkedIn share previews look off
- Add a custom domain via Vercel
- Optional: sound system (Howler) — deliberately deferred from v1
