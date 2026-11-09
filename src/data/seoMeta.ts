import type { Locale } from '@/types/content';

type Meta = { title: string; description: string };

/** Título y descripción por ruta. La home usa los de index.html. */
export const seoMeta: Record<string, Record<Locale, Meta>> = {
  '/': {
    es: {
      title: 'Oscar Ortega — portfolio',
      description:
        'Senior Ruby on Rails engineer con experiencia en React, TypeScript e infraestructura cloud. Portafolio de Oscar Ortega.',
    },
    en: {
      title: 'Oscar Ortega — portfolio',
      description:
        'Senior Ruby on Rails engineer with hands-on React, TypeScript and cloud infrastructure experience. Portfolio of Oscar Ortega — 3D scroll experience.',
    },
  },
  '/apps/selah': {
    es: {
      title: 'Selah — letras y Biblia para el videobeam de tu iglesia',
      description:
        'Letras y Biblia en el videobeam de tu iglesia, controladas desde el celular. Gratis, de código abierto, sin publicidad y sin cuentas.',
    },
    en: {
      title: 'Selah — lyrics and Bible for your church projector',
      description:
        "Lyrics and Bible on your church's projector, controlled from your phone. Free, open source, no ads and no accounts.",
    },
  },
  '/apps/selah/privacy': {
    es: {
      title: 'Política de privacidad — Selah',
      description:
        'Política de privacidad de Selah y Selah Remoto: qué datos usa la app de proyección de letras y Biblia para iglesias.',
    },
    en: {
      title: 'Privacy policy — Selah',
      description:
        'Privacy policy for Selah and Selah Remote: what data the church lyrics and Bible projection app uses.',
    },
  },
  '/apps/selah/support': {
    es: {
      title: 'Soporte — Selah',
      description: 'Ayuda y contacto para Selah y Selah Remoto, la app de proyección de letras y Biblia para iglesias.',
    },
    en: {
      title: 'Support — Selah',
      description: 'Help and contact for Selah and Selah Remote, the church lyrics and Bible projection app.',
    },
  },
  '/apps/stickerswap/privacy': {
    es: {
      title: 'Política de privacidad — Stickerswap',
      description: 'Política de privacidad de Stickerswap, la app para intercambiar láminas del álbum.',
    },
    en: {
      title: 'Privacy policy — Stickerswap',
      description: 'Privacy policy for Stickerswap, the sticker album trading app.',
    },
  },
  '/apps/stickerswap/terms': {
    es: {
      title: 'Términos de uso — Stickerswap',
      description: 'Términos y condiciones de uso de Stickerswap, la app para intercambiar láminas del álbum.',
    },
    en: {
      title: 'Terms of use — Stickerswap',
      description: 'Terms and conditions for Stickerswap, the sticker album trading app.',
    },
  },
  '/apps/stickerswap/support': {
    es: {
      title: 'Centro de ayuda — Stickerswap',
      description: 'Preguntas frecuentes y contacto de Stickerswap: cuenta, álbum, intercambios y privacidad.',
    },
    en: {
      title: 'Support Center — Stickerswap',
      description: 'Stickerswap FAQ and contact: account, album, trades and privacy.',
    },
  },
  '/apps/stickerswap/delete-account': {
    es: {
      title: 'Eliminar tu cuenta — Stickerswap',
      description: 'Cómo eliminar tu cuenta de Stickerswap y todos los datos asociados.',
    },
    en: {
      title: 'Delete your account — Stickerswap',
      description: 'How to delete your Stickerswap account and all associated data.',
    },
  },
};
