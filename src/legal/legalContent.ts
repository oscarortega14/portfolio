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
