import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import LinkedinIcon from '@/components/icons/LinkedinIcon';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className="min-h-[60vh] py-32 px-6 flex items-center justify-center"
    >
      <div className="text-center max-w-2xl">
        <h2
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: 'var(--cyan-100)' }}
        >
          {t('contact.title')}
        </h2>

        <a
          href="mailto:ortegaoscar14@gmail.com"
          className="inline-flex items-center gap-2 px-8 py-4 rounded font-mono uppercase text-sm tracking-widest mb-10"
          style={{
            background: 'var(--cyan-500)',
            color: 'var(--bg-base)',
            boxShadow: 'var(--cyan-glow-strong)',
          }}
        >
          <Mail size={18} />
          {t('contact.cta')}
        </a>

        <div className="flex justify-center gap-6">
          <a
            href="https://www.linkedin.com/in/oscardeveloper/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ color: 'var(--cyan-300)' }}
          >
            <LinkedinIcon size={22} />
          </a>
          <a
            href="https://github.com/oortega14"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{ color: 'var(--cyan-300)' }}
          >
            <GithubIcon size={22} />
          </a>
          <a
            href="mailto:ortegaoscar14@gmail.com"
            aria-label="Email"
            style={{ color: 'var(--cyan-300)' }}
          >
            <Mail size={22} />
          </a>
        </div>
      </div>
    </section>
  );
}
