import type { LegalContent } from './legalContent';
import { APP_CONTACT_EMAIL, APP_DEVELOPER } from './legalContent';

export const SELAH_NAME = 'Selah';
export const SELAH_LAST_UPDATED = '2026-11-05';
export const SELAH_REPO = 'https://github.com/oscarortega14/selah';

export const selahPrivacyContent: LegalContent = {
  es: {
    title: 'Política de privacidad',
    subtitle: `${SELAH_NAME} y ${SELAH_NAME} Remoto — proyección de letras y Biblia para iglesias`,
    lastUpdated: 'Última actualización',
    intro:
      `${SELAH_NAME} (programa para computador) y ${SELAH_NAME} Remoto (app para iPhone, iPad y Android) son software libre y gratuito para proyectar letras de canciones y la Biblia en iglesias. Esta política explica qué datos usan.`,
    sections: [
      {
        heading: '1. Resumen',
        body: [
          'No recopilamos datos personales. No hay cuentas, publicidad, analíticas ni rastreo.',
          `La app solo se comunica con el computador de tu iglesia que tiene ${SELAH_NAME}, dentro de la misma red Wi-Fi.`,
          'Nada de lo que haces en la app se envía a nosotros ni a terceros.',
        ],
      },
      {
        heading: '2. Qué guarda la app en tu teléfono',
        body: [
          `La dirección en la red local del computador con ${SELAH_NAME} y su nombre, para reconectarse sola.`,
          'La clave numérica que tú escribes para poder controlar la proyección.',
          'Estos datos quedan solo en tu teléfono y se borran al desinstalar la app.',
        ],
      },
      {
        heading: '3. Qué envía la app al computador de tu iglesia',
        body: [
          'Las órdenes que das: siguiente diapositiva, elegir canción o cita bíblica, avisos, etc. Todo viaja solo por tu red local.',
          'Si usas «Subir foto o video», la imagen o el video que tú eliges se envía a la carpeta de anuncios de ese computador. La app no accede a tus fotos de ninguna otra forma.',
        ],
      },
      {
        heading: '4. Permisos',
        body: [
          'Red local: para encontrar y controlar el computador con Selah en tu Wi-Fi.',
          'Fotos (solo si subes una foto o un video): el sistema te deja elegir el archivo; la app no ve el resto de tu galería.',
        ],
      },
      {
        heading: '5. Internet',
        body: [
          'Las versiones de App Store y Google Play no usan internet: solo la red local.',
          'La versión que se descarga desde GitHub consulta al abrirse si hay una versión nueva (en api.github.com). No envía datos tuyos.',
        ],
      },
      {
        heading: '6. Niños',
        body: ['La app no está dirigida a niños y no recopila datos de nadie.'],
      },
      {
        heading: '7. Cambios y contacto',
        body: [
          'Si esta política cambia, se publicará en esta página.',
          `Responsable: ${APP_DEVELOPER}. Contacto: ${APP_CONTACT_EMAIL}`,
        ],
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    subtitle: `${SELAH_NAME} and ${SELAH_NAME} Remote — song lyrics and Bible projection for churches`,
    lastUpdated: 'Last updated',
    intro:
      `${SELAH_NAME} (desktop program) and ${SELAH_NAME} Remote (app for iPhone, iPad and Android) are free, open-source software to project song lyrics and the Bible in churches. This policy explains what data they use.`,
    sections: [
      {
        heading: '1. Summary',
        body: [
          'We do not collect personal data. There are no accounts, ads, analytics or tracking.',
          `The app only talks to your church computer running ${SELAH_NAME}, on the same Wi-Fi network.`,
          'Nothing you do in the app is sent to us or to third parties.',
        ],
      },
      {
        heading: '2. What the app stores on your phone',
        body: [
          `The local network address and name of the computer running ${SELAH_NAME}, to reconnect automatically.`,
          'The numeric PIN you type to control the projection.',
          'This data stays on your phone only and is deleted when you uninstall the app.',
        ],
      },
      {
        heading: '3. What the app sends to your church computer',
        body: [
          'The commands you give: next slide, choose a song or Bible passage, announcements, etc. Everything travels over your local network only.',
          'If you use "Upload photo or video", the image or video you choose is sent to that computer\'s announcements folder. The app does not access your photos in any other way.',
        ],
      },
      {
        heading: '4. Permissions',
        body: [
          'Local network: to find and control the computer running Selah on your Wi-Fi.',
          'Photos (only if you upload a photo or video): the system lets you pick the file; the app cannot see the rest of your library.',
        ],
      },
      {
        heading: '5. Internet',
        body: [
          'The App Store and Google Play versions do not use the internet: local network only.',
          'The version downloaded from GitHub checks for a new version when it opens (at api.github.com). It sends no personal data.',
        ],
      },
      {
        heading: '6. Children',
        body: ['The app is not directed at children and does not collect data from anyone.'],
      },
      {
        heading: '7. Changes and contact',
        body: [
          'If this policy changes, it will be published on this page.',
          `Controller: ${APP_DEVELOPER}. Contact: ${APP_CONTACT_EMAIL}`,
        ],
      },
    ],
  },
};

export const selahSupportContent: LegalContent = {
  es: {
    title: 'Soporte',
    subtitle: `${SELAH_NAME} y ${SELAH_NAME} Remoto`,
    lastUpdated: 'Última actualización',
    intro:
      `${SELAH_NAME} proyecta letras de canciones y la Biblia en el videobeam de tu iglesia. ${SELAH_NAME} Remoto es el control remoto desde el celular. Aquí están las preguntas más comunes y cómo pedir ayuda.`,
    sections: [
      {
        heading: '¿Qué necesito para usar Selah Remoto?',
        body: [
          `Un computador con ${SELAH_NAME} abierto (gratis, para Windows) y el celular conectado al mismo Wi-Fi que ese computador.`,
          `Descarga ${SELAH_NAME}: ${SELAH_REPO}`,
        ],
      },
      {
        heading: 'La app no encuentra el computador',
        body: [
          'Revisa que el celular y el computador estén en el mismo Wi-Fi (no en datos móviles ni en una red de invitados).',
          'En iPhone, permite el acceso a la «Red local» cuando la app lo pida (o en Ajustes → Privacidad → Red local).',
          'En Windows, la primera vez acepta el aviso del firewall para redes privadas.',
          `Si sigue sin aparecer, escribe a mano la dirección que muestra ${SELAH_NAME} en el computador (menú del control remoto).`,
        ],
      },
      {
        heading: 'Me pide una clave',
        body: [
          `La clave aparece en el computador con ${SELAH_NAME}. Sirve para que nadie más en el Wi-Fi pueda mover la letra.`,
        ],
      },
      {
        heading: '¿Cuesta algo? ¿Recopila datos?',
        body: [
          'Es gratis, sin publicidad, sin cuentas y sin compras dentro de la app. No recopila datos personales.',
          'Política de privacidad: oortega14.com/apps/selah/privacy',
        ],
      },
      {
        heading: 'Contacto',
        body: [
          `Correo: ${APP_CONTACT_EMAIL}`,
          `Reportar un problema o pedir una función: ${SELAH_REPO}/issues`,
        ],
      },
    ],
  },
  en: {
    title: 'Support',
    subtitle: `${SELAH_NAME} and ${SELAH_NAME} Remote`,
    lastUpdated: 'Last updated',
    intro:
      `${SELAH_NAME} projects song lyrics and the Bible on your church projector. ${SELAH_NAME} Remote is the remote control for your phone. Here are the most common questions and how to get help.`,
    sections: [
      {
        heading: 'What do I need to use Selah Remote?',
        body: [
          `A computer running ${SELAH_NAME} (free, for Windows) and your phone on the same Wi-Fi as that computer.`,
          `Download ${SELAH_NAME}: ${SELAH_REPO}`,
        ],
      },
      {
        heading: 'The app cannot find the computer',
        body: [
          'Make sure the phone and the computer are on the same Wi-Fi (not mobile data or a guest network).',
          'On iPhone, allow "Local Network" access when the app asks (or in Settings → Privacy → Local Network).',
          'On Windows, accept the firewall prompt for private networks the first time.',
          `If it still does not appear, type the address shown by ${SELAH_NAME} on the computer (remote control menu).`,
        ],
      },
      {
        heading: 'It asks for a PIN',
        body: [
          `The PIN is shown on the computer running ${SELAH_NAME}. It keeps anyone else on the Wi-Fi from moving the lyrics.`,
        ],
      },
      {
        heading: 'Does it cost anything? Does it collect data?',
        body: [
          'It is free, with no ads, no accounts and no in-app purchases. It does not collect personal data.',
          'Privacy policy: oortega14.com/apps/selah/privacy',
        ],
      },
      {
        heading: 'Contact',
        body: [
          `Email: ${APP_CONTACT_EMAIL}`,
          `Report a problem or request a feature: ${SELAH_REPO}/issues`,
        ],
      },
    ],
  },
};
