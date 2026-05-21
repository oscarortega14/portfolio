import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer
      className="px-6 py-10 text-center font-mono text-xs"
      style={{
        color: 'var(--cyan-300)',
        opacity: 0.6,
        borderTop: '1px solid rgba(0, 212, 255, 0.15)',
      }}
    >
      <p className="mb-2">© {year} Oscar Ortega. {t('footer.rights')}</p>
      <p>
        {t('footer.inspired')}{' '}
        <a
          href="https://david-hckh.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--cyan-400)' }}
        >
          David Heckhoff's portfolio (2025)
        </a>{' '}
        — reimplemented in React with original assets.
      </p>
    </footer>
  );
}
