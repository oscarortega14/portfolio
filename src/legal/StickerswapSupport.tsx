import { Link } from 'react-router-dom';
import { useLocalized } from '@/hooks/useLocalized';
import { useCursorHover } from '@/hooks/useCursorHover';
import { LAST_UPDATED } from './legalContent';

const content = {
  es: {
    title: 'Centro de ayuda',
    subtitle: 'Preguntas frecuentes y contacto',
    lastUpdatedLabel: 'Última actualización',
    back: 'Volver al inicio',
    intro:
      'Encontrá respuestas a las preguntas más comunes sobre Stickerswap. Si tu duda no aparece acá, escribinos al final de la página.',
  },
  en: {
    title: 'Support Center',
    subtitle: 'Frequently asked questions and contact',
    lastUpdatedLabel: 'Last updated',
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
            {c.lastUpdatedLabel}: {LAST_UPDATED}
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
