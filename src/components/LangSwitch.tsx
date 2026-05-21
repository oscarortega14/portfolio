import { useTranslation } from 'react-i18next';
import { useCursorHover } from '@/hooks/useCursorHover';

const LOCALES = ['en', 'es'] as const;

export default function LangSwitch() {
  const { i18n } = useTranslation();
  const cursor = useCursorHover();
  const current = i18n.language.startsWith('es') ? 'es' : 'en';

  return (
    <div className="flex items-center gap-1 font-mono text-xs uppercase">
      {LOCALES.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => void i18n.changeLanguage(loc)}
            className="px-2 py-1 rounded transition-colors"
            style={{
              color: active ? 'var(--cyan-100)' : 'var(--cyan-300)',
              opacity: active ? 1 : 0.5,
              textShadow: active ? 'var(--cyan-glow)' : 'none',
            }}
            {...cursor}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
