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
