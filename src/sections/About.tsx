import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import LinkedinIcon from '@/components/icons/LinkedinIcon';
import HologramCard from '@/components/HologramCard';
import HologramButton from '@/components/HologramButton';
import AppearingText from '@/components/AppearingText';
import { skills } from '@/data/skills';

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <AppearingText
            as="h2"
            text={t('about.title')}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--cyan-100)' }}
          />
          <AppearingText
            as="p"
            text={t('about.description')}
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--cyan-300)' }}
            staggerMs={30}
            delay={0.05}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <HologramCard>
            <h3
              className="text-2xl font-bold mb-6 font-mono uppercase tracking-widest"
              style={{ color: 'var(--cyan-100)' }}
            >
              {t('about.skillsTitle')}
            </h3>
            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2 text-sm font-mono">
                    <span style={{ color: 'var(--cyan-100)' }}>{skill.name}</span>
                    <span style={{ color: 'var(--cyan-300)', opacity: 0.6 }}>{skill.level}%</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ background: 'rgba(0, 212, 255, 0.1)' }}
                  >
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${skill.level}%`,
                        background: skill.color,
                        boxShadow: `0 0 12px ${skill.color}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </HologramCard>

          <div className="flex flex-col gap-4">
            <HologramButton
              as="a"
              href="https://www.linkedin.com/in/oscardeveloper/"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              icon={<LinkedinIcon size={14} />}
            >
              {t('about.linkedin')}
            </HologramButton>
            <HologramButton
              as="a"
              href="mailto:ortegaoscar14@gmail.com"
              variant="outline"
              icon={<Mail size={14} />}
            >
              {t('about.contact')}
            </HologramButton>
          </div>
        </div>
      </div>
    </section>
  );
}
