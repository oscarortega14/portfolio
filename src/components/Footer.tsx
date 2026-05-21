import { useTranslation } from 'react-i18next';
import { useCursorHover } from '@/hooks/useCursorHover';

export default function Footer() {
  const { t } = useTranslation();
  const cursor = useCursorHover();
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
          {...cursor}
        >
          David Heckhoff's portfolio (2025)
        </a>{' '}
        — reimplemented in React with original assets.
      </p>
      <p className="mt-2">
        3D astronaut by{' '}
        <a
          href="https://skfb.ly/TSBH"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--cyan-400)' }}
          {...cursor}
        >
          Carolina P.
        </a>{' '}
        (CC BY 4.0).
      </p>
    </footer>
  );
}
