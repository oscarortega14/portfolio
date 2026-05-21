import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p
          className="font-mono uppercase tracking-[4px] text-sm mb-4"
          style={{ color: 'var(--cyan-400)' }}
        >
          {t('hero.greeting')}
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold"
          style={{ color: 'var(--cyan-100)', textShadow: 'var(--cyan-glow)' }}
        >
          portfolio-2026
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--cyan-300)' }}>
          Phase 0 — Scaffolding ✓
        </p>
      </div>
    </main>
  );
}
