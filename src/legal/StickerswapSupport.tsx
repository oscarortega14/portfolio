import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import HologramCard from '@/components/HologramCard';
import { useLocalized } from '@/hooks/useLocalized';
import { useCursorHover } from '@/hooks/useCursorHover';
import { LAST_UPDATED } from './legalContent';

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
    ] satisfies readonly FaqCategory[],
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
            a: "From a friend's profile tap \"Propose trade\". Choose the stickers you offer and the ones you want. The friend receives a notification and can accept, reject, or counter-propose.",
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
    ] satisfies readonly FaqCategory[],
  },
};

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
          const buttonId = `faq-btn-${category.id}-${idx}`;
          const panelId  = `faq-panel-${category.id}-${idx}`;
          return (
            <div
              key={item.q}
              style={{ borderTop: idx === 0 ? 'none' : '1px solid rgba(0,212,255,0.12)' }}
            >
              <button
                type="button"
                id={buttonId}
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
                    aria-labelledby={buttonId}
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

        <div className="space-y-6">
          {c.faq.map((category) => (
            <FaqAccordion key={category.id} category={category} />
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
