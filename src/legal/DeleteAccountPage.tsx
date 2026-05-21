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
