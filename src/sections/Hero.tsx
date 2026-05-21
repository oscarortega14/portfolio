import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { useLenisScroll } from '@/contexts/LenisProvider';
import GithubIcon from '@/components/icons/GithubIcon';
import Tag from '@/components/Tag';

const HERO_SKILLS = ['Ruby on Rails', 'React', 'TypeScript', 'Python'];

export default function Hero() {
  const { t } = useTranslation();
  const { scrollTo } = useLenisScroll();
  const roles = t('hero.roles', { returnObjects: true }) as string[];

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('contact');
    if (target) scrollTo(target, { offset: -80 });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-6 relative"
    >
      <div className="text-center max-w-4xl">
        <p
          className="font-mono uppercase tracking-[4px] text-sm mb-4"
          style={{ color: 'var(--cyan-400)' }}
        >
          {t('hero.greeting')}
        </p>

        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ color: 'var(--cyan-100)', textShadow: 'var(--cyan-glow)' }}
        >
          {t('hero.name')}
        </h1>

        <p
          className="font-mono text-xl md:text-2xl mb-8"
          style={{ color: 'var(--cyan-300)' }}
        >
          <span style={{ color: 'var(--cyan-500)' }}>&gt; </span>
          {roles[0]}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {HERO_SKILLS.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#contact"
            onClick={handleContactClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-mono uppercase text-sm tracking-widest transition-colors"
            style={{
              background: 'var(--cyan-500)',
              color: 'var(--bg-base)',
              boxShadow: 'var(--cyan-glow)',
            }}
          >
            <Mail size={16} />
            {t('hero.cta')}
          </a>

          <a
            href="https://github.com/oortega14"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-mono uppercase text-sm tracking-widest border transition-colors"
            style={{ borderColor: 'var(--cyan-400)', color: 'var(--cyan-100)' }}
          >
            <GithubIcon size={16} />
            {t('hero.github')}
          </a>
        </div>
      </div>
    </section>
  );
}
