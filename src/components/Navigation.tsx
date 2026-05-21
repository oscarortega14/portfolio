import { useTranslation } from 'react-i18next';
import { useLenisScroll } from '@/contexts/LenisProvider';
import LangSwitch from './LangSwitch';

const SECTIONS = [
  { id: 'hero', key: 'nav.hero' },
  { id: 'about', key: 'nav.about' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'contact', key: 'nav.contact' },
] as const;

export default function Navigation() {
  const { t } = useTranslation();
  const { scrollTo } = useLenisScroll();

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) scrollTo(target, { offset: -80 });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{
        background: 'rgba(5, 10, 20, 0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
      }}
    >
      <a
        href="#hero"
        onClick={handleClick('hero')}
        className="font-mono text-sm uppercase tracking-[3px]"
        style={{ color: 'var(--cyan-100)', textShadow: 'var(--cyan-glow)' }}
      >
        OO<span style={{ color: 'var(--cyan-400)' }}>/</span>2026
      </a>

      <nav className="hidden md:flex items-center gap-6">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={handleClick(s.id)}
            className="font-mono text-xs uppercase tracking-widest transition-colors hover:opacity-100"
            style={{ color: 'var(--cyan-300)', opacity: 0.7 }}
          >
            {t(s.key)}
          </a>
        ))}
      </nav>

      <LangSwitch />
    </header>
  );
}
