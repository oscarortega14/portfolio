import { useTranslation } from 'react-i18next';
import { Award } from 'lucide-react';
import certificationsData from '@/data/certifications.json';
import type { Certification } from '@/types/content';
import HologramCard from '@/components/HologramCard';
import AppearingText from '@/components/AppearingText';
import Tag from '@/components/Tag';

const certifications = (certificationsData as Certification[])
  .slice()
  .sort((a, b) => a.position - b.position);

function formatIssued(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function Certifications() {
  const { t } = useTranslation();

  return (
    <section id="certifications" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AppearingText
          as="h2"
          text={t('certifications.title')}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          style={{ color: 'var(--cyan-100)' }}
        />

        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <HologramCard key={cert.id}>
              <div className="flex items-start gap-3">
                <Award size={18} style={{ color: 'var(--cyan-400)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 className="font-bold leading-snug mb-1" style={{ color: 'var(--cyan-100)' }}>
                    {cert.name}
                  </h3>
                  <div
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-2"
                    style={{ color: 'var(--cyan-300)', opacity: 0.7 }}
                  >
                    <span>{cert.issuer}</span>
                  </div>
                  <Tag size="sm">
                    {cert.in_progress
                      ? t('certifications.inProgress')
                      : `${t('certifications.issued')} ${formatIssued(cert.issued_date as string)}`}
                  </Tag>
                </div>
              </div>
            </HologramCard>
          ))}
        </div>
      </div>
    </section>
  );
}
