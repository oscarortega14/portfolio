import { useTranslation } from 'react-i18next';
import { MapPin, ExternalLink } from 'lucide-react';
import experiencesData from '@/data/experiences.json';
import type { Experience as ExperienceType } from '@/types/content';
import { useLocalized } from '@/hooks/useLocalized';
import Tag from '@/components/Tag';
import HologramCard from '@/components/HologramCard';
import AppearingText from '@/components/AppearingText';
import { useCursorHover } from '@/hooks/useCursorHover';

const experiences = (experiencesData as ExperienceType[]).slice().sort((a, b) => a.position - b.position);

function formatPeriod(start: string, end: string | null, presentLabel: string): string {
  const fmt = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  return `${fmt(start)} — ${end ? fmt(end) : presentLabel}`;
}

function CompanyLink({ url, company }: { url: string; company: string }) {
  const cursor = useCursorHover();
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm"
      style={{ color: 'var(--cyan-400)' }}
      {...cursor}
    >
      {company} <ExternalLink size={12} />
    </a>
  );
}

export default function Experience() {
  const { t } = useTranslation();
  const { pick } = useLocalized();

  return (
    <section id="experience" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AppearingText
          as="h2"
          text={t('experience.title')}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          style={{ color: 'var(--cyan-100)' }}
        />

        <ol className="space-y-10">
          {experiences.map((exp) => (
            <li key={exp.id}>
              <HologramCard>
                <div className="grid md:grid-cols-[180px_1fr] gap-6">
                  <div className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--cyan-400)' }}>
                    {formatPeriod(exp.start_date, exp.end_date, t('experience.currentLabel'))}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 mb-2">
                      <h3 className="text-xl font-bold" style={{ color: 'var(--cyan-100)' }}>
                        {pick(exp.job_title)}
                      </h3>
                      {exp.company_url ? (
                        <CompanyLink url={exp.company_url} company={exp.company} />
                      ) : (
                        <span className="text-sm" style={{ color: 'var(--cyan-300)' }}>{exp.company}</span>
                      )}
                    </div>

                    <div
                      className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest mb-4"
                      style={{ color: 'var(--cyan-300)', opacity: 0.7 }}
                    >
                      <MapPin size={12} /> {exp.location}
                    </div>

                    <p className="mb-4 leading-relaxed" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
                      {pick(exp.description)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Tag key={tech} size="sm">{tech}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </HologramCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
