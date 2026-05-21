import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import LinkedinIcon from '@/components/icons/LinkedinIcon';
import { skills } from '@/data/skills';

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--cyan-100)' }}
          >
            {t('about.title')}
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--cyan-300)' }}
          >
            {t('about.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
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
          </div>

          <div className="flex flex-col gap-4">
            <a
              href="https://www.linkedin.com/in/oscardeveloper/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded font-mono uppercase text-sm tracking-widest border"
              style={{ borderColor: 'var(--cyan-400)', color: 'var(--cyan-100)' }}
            >
              <LinkedinIcon size={18} />
              {t('about.linkedin')}
            </a>
            <a
              href="mailto:ortegaoscar14@gmail.com"
              className="inline-flex items-center gap-3 px-5 py-3 rounded font-mono uppercase text-sm tracking-widest border"
              style={{ borderColor: 'var(--cyan-400)', color: 'var(--cyan-100)' }}
            >
              <Mail size={18} />
              {t('about.contact')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
