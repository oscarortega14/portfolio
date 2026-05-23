# Stickerswap Support Page — Design Spec

**Date:** 2026-05-23
**Author:** Oscar Ortega
**Route:** `/apps/stickerswap/support`
**URL público:** https://oortega14.com/apps/stickerswap/support

---

## 1. Goal

Crear la página de soporte público de la app Stickerswap, accesible desde el portfolio (`oortega14.com`). Debe servir dos audiencias:

1. **Usuarios finales** que buscan ayuda con la app (login, álbum, amistades, trades, problemas técnicos).
2. **Reviewers de App Store / Google Play** que requieren una página de soporte pública como parte del proceso de publicación.

Patrón i18n (es/en) y estética hologram consistente con las otras páginas StickerSwap (`/privacy`, `/terms`, `/delete-account`).

## 2. Non-goals

- No es un sistema de tickets ni un chat en vivo.
- No incluye troubleshooting in-app dinámico (logs, diagnósticos, etc.).
- No requiere backend nuevo — todo el contenido es estático.
- No modifica las páginas legales existentes.

## 3. Architecture

### 3.1 Routing

Agregar una nueva ruta en `src/App.tsx`:

```tsx
<Route path="/apps/stickerswap/support" element={<StickerswapSupport />} />
```

### 3.2 Archivos nuevos

- `src/legal/StickerswapSupport.tsx` — componente de la página, con contenido i18n inline (mismo patrón que `DeleteAccountPage.tsx`).

### 3.3 Archivos modificados

- `src/App.tsx` — agregar import + ruta.
- (Opcional, si el footer del Home incluye links a páginas legales) — agregar link a `/apps/stickerswap/support`.

### 3.4 Reutilización

Componentes existentes que se usan tal cual:

- `HologramCard` (`src/components/HologramCard.tsx`)
- `HologramButton` (`src/components/HologramButton.tsx`)
- `useLocalized` (`src/hooks/useLocalized.ts`)
- `useCursorHover` (`src/hooks/useCursorHover.ts`)
- `APP_CONTACT_EMAIL` y `LAST_UPDATED` desde `src/legal/legalContent.ts`
- Iconos `Mail`, `ChevronDown`, `Shield`, `FileText`, `UserX` de `lucide-react`
- `framer-motion` (`AnimatePresence`, `motion.div`) ya está en deps
- `react-router-dom` (`Link`) para navegación interna

## 4. Page Structure

Top → bottom:

```
[← Back to home]

H1: Centro de ayuda / Support Center
Subtitle: Preguntas frecuentes y contacto / Frequently asked questions and contact
Last updated: <LAST_UPDATED>

Intro paragraph (1-2 oraciones)

──── FAQ Section ────
HologramCard "Cuenta y acceso" — Accordion (4 items)
HologramCard "Álbum, amistades e intercambios" — Accordion (5 items)
HologramCard "Privacidad y datos" — Accordion (4 items)
HologramCard "Problemas técnicos" — Accordion (4 items)

──── Contact ────
HologramCard "¿Necesitás más ayuda?"
  Texto explicativo + HologramButton (mailto pre-rellenado)

──── Useful Links ────
HologramCard "Enlaces útiles"
  Link → /apps/stickerswap/privacy   (Shield icon)
  Link → /apps/stickerswap/terms     (FileText icon)
  Link → /apps/stickerswap/delete-account (UserX icon)

Footer: © <year> Oscar Ortega · Stickerswap
```

## 5. Accordion Behavior

Implementación inline dentro de `StickerswapSupport.tsx` (no se crea componente separado — solo se usa en esta página, YAGNI).

### 5.1 State

- Cada `HologramCard` de FAQ tiene su propio `useState<number | null>(null)` para el índice abierto.
- Solo **un item abierto a la vez por card** (patrón estándar de FAQ).
- Click en un item ya abierto → lo cierra (`setOpen(null)`).
- Click en otro item → reemplaza el abierto.

### 5.2 Markup por item

```tsx
<div className="border-b" style={{ borderColor: 'rgba(0,212,255,0.15)' }}>
  <button
    type="button"
    onClick={() => setOpen(open === idx ? null : idx)}
    aria-expanded={open === idx}
    aria-controls={`faq-panel-${cardId}-${idx}`}
    className="w-full flex items-center justify-between py-4 text-left"
    {...cursor}
  >
    <span style={{ color: 'var(--cyan-100)' }}>{q.question}</span>
    <ChevronDown
      size={16}
      style={{
        color: 'var(--cyan-400)',
        transform: open === idx ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 200ms ease',
      }}
    />
  </button>
  <AnimatePresence initial={false}>
    {open === idx && (
      <motion.div
        id={`faq-panel-${cardId}-${idx}`}
        role="region"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ overflow: 'hidden' }}
      >
        <div className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
          {q.answer}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

### 5.3 Accesibilidad

- `aria-expanded` sincronizado con el estado.
- `aria-controls` apunta a un `id` único del panel.
- `role="region"` en el panel.
- Botones nativos `<button type="button">` (navegables con teclado por defecto).

### 5.4 Animation

Uso `framer-motion` (consistente con el resto del portfolio). `height: 0 → auto` + `opacity: 0 → 1`, 200ms ease-out.

## 6. Content (i18n)

Estructura en `StickerswapSupport.tsx`:

```ts
const content = {
  es: { /* ... */ },
  en: { /* ... */ },
} as const;
```

### 6.1 Strings comunes

- `title`: "Centro de ayuda" / "Support Center"
- `subtitle`: "Preguntas frecuentes y contacto" / "Frequently asked questions and contact"
- `lastUpdatedLabel`: "Última actualización" / "Last updated"
- `back`: "Volver al inicio" / "Back to home"
- `intro`: (es) "Encontrá respuestas a las preguntas más comunes sobre Stickerswap. Si tu duda no aparece acá, escribinos al final de la página." / (en) "Find answers to the most common Stickerswap questions. If your question is not here, contact us at the bottom of the page."

### 6.2 FAQ — Categorías y Q&A

#### Categoría 1: "Cuenta y acceso" / "Account and access"

1. **¿Cómo inicio sesión en Stickerswap?** / "How do I sign in to Stickerswap?"
   - Stickerswap usa inicio de sesión con Google. Tocá "Continuar con Google" en la pantalla inicial y elegí la cuenta que querés usar. Necesitás una cuenta de Google activa en el dispositivo.

2. **¿Puedo cambiar mi @username?** / "Can I change my @username?"
   - El @username se elige una sola vez al crear el perfil. Si necesitás cambiarlo por un error de tipeo o un nombre inapropiado, escribinos por email y lo revisamos manualmente.

3. **¿Cómo elimino mi cuenta?** / "How do I delete my account?"
   - Podés eliminar tu cuenta desde la pestaña "Perfil" → "Borrar cuenta". Para ver el procedimiento completo y qué datos se eliminan, consultá la página de eliminación de cuenta (link inline en la respuesta usando `<Link to="/apps/stickerswap/delete-account">`).

4. **Olvidé qué cuenta de Google usé para registrarme** / "I forgot which Google account I used to sign up"
   - La autenticación se hace contra Google, así que no podemos cambiarte la cuenta vinculada. Probá ingresar con cada cuenta de Google que uses hasta encontrar la que tiene tu perfil. Si no la encontrás, escribinos.

#### Categoría 2: "Álbum, amistades e intercambios" / "Album, friends and trades"

1. **¿Cómo marco una figurita como pegada o repetida?** / "How do I mark a sticker as pasted or duplicate?"
   - Andá a la pestaña "Álbum", buscá la figurita y tocá su número. Se abre un selector con: pegada, repetida (con contador) o ninguna. El cambio se sincroniza automáticamente cuando hay conexión.

2. **¿Cómo agrego un amigo?** / "How do I add a friend?"
   - En la pestaña "Amigos" tocá "Agregar amigo" e ingresá su @username. Le llega una solicitud que tiene que aceptar antes de que puedan intercambiar.

3. **¿Cómo propongo un intercambio?** / "How do I propose a trade?"
   - Desde el perfil de un amigo tocá "Proponer intercambio". Elegí las figuritas que ofrecés y las que querés recibir. El amigo recibe una notificación y puede aceptarlo, rechazarlo o contrapropuesta.

4. **¿Qué pasa si el otro no responde un intercambio?** / "What happens if the other person doesn't respond to a trade?"
   - Las propuestas no expiran automáticamente. Si querés cancelar una propuesta pendiente, andá a "Intercambios" → tocá la propuesta → "Cancelar". Una vez completado el intercambio en persona, ambos tienen que marcarlo como entregado.

5. **¿Qué ven mis amigos de mi perfil?** / "What can my friends see in my profile?"
   - Tus amigos confirmados ven: tu @username, foto de perfil, nombre visible, progreso del álbum (figuritas pegadas y repetidas) y tu número de WhatsApp si lo cargaste. No ven tu email ni datos privados.

#### Categoría 3: "Privacidad y datos" / "Privacy and data"

1. **¿Es obligatorio cargar mi número de WhatsApp?** / "Do I have to provide my WhatsApp number?"
   - No. El número de WhatsApp es opcional y solo se muestra a tus amigos confirmados. Sirve para coordinar entregas de intercambios fuera de la app. Podés eliminarlo desde "Perfil" → "Editar".

2. **¿Quién ve mi ciudad?** / "Who can see my city?"
   - La ciudad es opcional. Si la cargaste, la ven tus amigos confirmados (sirve para encontrar gente cerca para intercambiar). No se comparte con desconocidos ni se usa para publicidad.

3. **¿Dónde leo la política de privacidad?** / "Where can I read the privacy policy?"
   - Está disponible en la página de privacidad (link inline usando `<Link to="/apps/stickerswap/privacy">`).

4. **¿Cuáles son los términos de uso?** / "What are the terms of use?"
   - Podés leerlos en términos y condiciones (link inline usando `<Link to="/apps/stickerswap/terms">`).

#### Categoría 4: "Problemas técnicos" / "Technical issues"

1. **La app no carga o se queda en la pantalla inicial** / "The app doesn't load or gets stuck on the splash screen"
   - Cerrá la app completamente (deslizá hacia arriba en el selector de apps) y volvé a abrirla. Si persiste, verificá que tengas conexión a internet y que la versión de la app esté actualizada en la App Store / Play Store.

2. **Mis cambios no se sincronizan** / "My changes are not syncing"
   - Stickerswap funciona offline-first: tus cambios se guardan localmente y se sincronizan cuando hay conexión. Verificá tu conexión. Si tras 5 minutos no se sincroniza, cerrá y abrí la app — fuerza un reintento.

3. **No recibo notificaciones de trades o amistades** / "I'm not receiving trade or friendship notifications"
   - Revisá que las notificaciones estén habilitadas en: Ajustes del dispositivo → Stickerswap → Notificaciones. Si están activas y aún así no llegan, reinstalá la app para resetear el token de notificaciones.

4. **¿Cómo reporto un bug?** / "How do I report a bug?"
   - Escribinos al email de contacto al final de esta página. Incluí: descripción del problema, versión de la app (Perfil → Acerca de), modelo de tu dispositivo y sistema operativo. Si tenés una captura de pantalla del error, mucho mejor.

### 6.3 Contacto

- `contactTitle`: "¿Necesitás más ayuda?" / "Need more help?"
- `contactBody`: (es) "Si tu pregunta no está en las FAQ o necesitás soporte personalizado, escribinos por email. Respondemos dentro de las 48 horas hábiles." / (en) "If your question isn't in the FAQ or you need personalized support, write to us by email. We respond within 48 business hours."
- `contactCta`: "Enviar correo" / "Send email"
- `contactSubject`: "Solicitud de soporte Stickerswap" / "Stickerswap support request"
- `contactBodyTemplate`:
  ```
  Hola, necesito ayuda con:

  Describí el problema:

  Versión de la app (Perfil → Acerca de):
  Dispositivo y SO:
  ```

### 6.4 Enlaces útiles

- `linksTitle`: "Enlaces útiles" / "Useful links"
- Items:
  - `/apps/stickerswap/privacy` — "Política de privacidad" / "Privacy policy" (icono `Shield`)
  - `/apps/stickerswap/terms` — "Términos y condiciones" / "Terms of service" (icono `FileText`)
  - `/apps/stickerswap/delete-account` — "Eliminar cuenta" / "Delete account" (icono `UserX`)

## 7. Styling

Consistente con `DeleteAccountPage.tsx` y `LegalLayout.tsx`:

- Container: `min-h-screen px-4 sm:px-6 lg:px-8 py-12`, `max-w-3xl mx-auto`.
- Headings: `var(--cyan-400)` (sm) / `var(--cyan-100)` con `textShadow: var(--cyan-glow)` (h1).
- Body: `var(--cyan-100)` con `opacity: 0.85`.
- Mono / meta info: `var(--cyan-300)` con `opacity: 0.6`.
- Border separadores: `rgba(0, 212, 255, 0.15-0.2)`.
- Footer: `© <year> Oscar Ortega · Stickerswap`.

## 8. Testing Plan (manual)

- [ ] Página accesible en `/apps/stickerswap/support` (local dev y producción Vercel).
- [ ] Botón "← Volver al inicio" navega a `/`.
- [ ] Switch de idioma (es ↔ en) actualiza todo el contenido (headers, FAQ, contacto, links).
- [ ] Cada accordion abre y cierra suavemente (mobile y desktop).
- [ ] Al abrir un item, el anterior dentro de la misma card se cierra.
- [ ] Items de cards distintas pueden estar abiertos simultáneamente.
- [ ] `mailto:` abre el cliente con subject y body pre-rellenados correctos.
- [ ] Links inline en respuestas (a `/privacy`, `/terms`, `/delete-account`) funcionan.
- [ ] Links de "Enlaces útiles" funcionan y navegan correctamente.
- [ ] `cursor` hover funciona en botones de accordion y links.
- [ ] Responsive: layout legible en mobile (375px), tablet, desktop.
- [ ] Accesibilidad: navegación con Tab funciona; `aria-expanded` cambia con click.
- [ ] Última fecha de actualización (`LAST_UPDATED`) se muestra correctamente.

## 9. Risks / Decisions

- **Ubicación del archivo**: Se elige `src/legal/StickerswapSupport.tsx` por consistencia con `DeleteAccountPage` (que tampoco es estrictamente "legal" pero vive ahí). Si en el futuro hay más páginas no-legales de StickerSwap, se puede mover todo a `src/apps/stickerswap/`.
- **No se crea componente `<Accordion>` separado**: usado solo acá; si se necesita en otra página, se extrae después (YAGNI).
- **Sin backend**: contenido estático; cambios futuros requieren rebuild + deploy. Aceptable dado el volumen y la naturaleza del contenido.
- **SEO**: la página es SPA-rendered (React Router), pero el SPA rewrite de Vercel (`vercel.json`) ya garantiza que la URL directa funciona. No se agrega SSR / metadata específica en este alcance.
