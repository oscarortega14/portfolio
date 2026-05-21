import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import GithubIcon from '@/components/icons/GithubIcon';
import Tag from '@/components/Tag';
import HologramButton from '@/components/HologramButton';
import Typewriter from '@/components/Typewriter';
import AppearingText from '@/components/AppearingText';

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
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="text-center max-w-4xl">
        <AppearingText
          as="p"
          text={t('hero.greeting')}
          className="font-mono uppercase tracking-[4px] text-sm mb-4"
          style={{ color: 'var(--cyan-400)' }}
        />

        <AppearingText
          as="h1"
          text={t('hero.name')}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{ color: 'var(--cyan-100)', textShadow: 'var(--cyan-glow)' }}
          staggerMs={120}
          delay={0.15}
        />

        <p
          className="font-mono text-xl md:text-2xl mb-8"
          style={{ color: 'var(--cyan-300)' }}
        >
          <span style={{ color: 'var(--cyan-500)' }}>&gt; </span>
          <Typewriter phrases={roles} />
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {HERO_SKILLS.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <HologramButton as="a" href="#contact" onClick={handleContactClick} icon={<Mail size={14} />}>
            {t('hero.cta')}
          </HologramButton>

          <HologramButton
            as="a"
            href="https://github.com/oortega14"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            icon={<GithubIcon size={14} />}
          >
            {t('hero.github')}
          </HologramButton>
        </div>
      </div>
    </section>
  );
}
