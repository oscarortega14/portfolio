import { useTranslation } from 'react-i18next';
import { ExternalLink, Smartphone } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import projectsData from '@/data/projects.json';
import type { Project } from '@/types/content';
import { useLocalized } from '@/hooks/useLocalized';
import Tag from '@/components/Tag';

const projects = (projectsData as Project[])
  .filter((p) => p.published)
  .slice()
  .sort((a, b) => a.position - b.position);

function isValidUrl(url: string | null): url is string {
  return typeof url === 'string' && url.startsWith('http');
}

export default function Projects() {
  const { t } = useTranslation();
  const { pick } = useLocalized();

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          style={{ color: 'var(--cyan-100)' }}
        >
          {t('projects.title')}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-lg overflow-hidden flex flex-col"
              style={{
                background: 'rgba(10, 18, 36, 0.4)',
                border: '1px solid rgba(0, 212, 255, 0.15)',
              }}
            >
              <div
                className="aspect-video w-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(5, 10, 20, 0.4), rgba(5, 10, 20, 0.4)), url('${project.image_url}')`,
                }}
              />

              <div className="p-6 flex flex-col gap-4 flex-1">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--cyan-100)' }}>
                  {pick(project.title)}
                </h3>

                <p className="leading-relaxed flex-1" style={{ color: 'var(--cyan-100)', opacity: 0.85 }}>
                  {pick(project.description)}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Tag key={tech} size="sm">{tech}</Tag>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {isValidUrl(project.live_url) && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-widest"
                      style={{ color: 'var(--cyan-400)' }}
                    >
                      <ExternalLink size={14} /> {t('projects.viewLive')}
                    </a>
                  )}
                  {isValidUrl(project.github_url) && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-widest"
                      style={{ color: 'var(--cyan-400)' }}
                    >
                      <GithubIcon size={14} /> {t('projects.viewSource')}
                    </a>
                  )}
                  {isValidUrl(project.app_store_url) && (
                    <a
                      href={project.app_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-widest"
                      style={{ color: 'var(--cyan-400)' }}
                    >
                      <Smartphone size={14} /> {t('projects.appStore')}
                    </a>
                  )}
                  {isValidUrl(project.play_store_url) && (
                    <a
                      href={project.play_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-widest"
                      style={{ color: 'var(--cyan-400)' }}
                    >
                      <Smartphone size={14} /> {t('projects.playStore')}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
