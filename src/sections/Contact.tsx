import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import GithubIcon from '@/components/icons/GithubIcon';
import LinkedinIcon from '@/components/icons/LinkedinIcon';
import HologramCard from '@/components/HologramCard';
import HologramButton from '@/components/HologramButton';
import AppearingText from '@/components/AppearingText';
import { useCursorHover } from '@/hooks/useCursorHover';

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const cursor = useCursorHover();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ color: 'var(--cyan-300)' }}
      {...cursor}
    >
      {children}
    </a>
  );
}

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="min-h-[60vh] py-32 px-6 flex items-center justify-center">
      <HologramCard style={{ maxWidth: 560, width: '100%' }}>
        <div className="text-center">
          <AppearingText
            as="h2"
            text={t('contact.title')}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--cyan-100)' }}
          />

          <div className="flex justify-center mb-10">
            <HologramButton
              as="a"
              href="mailto:ortegaoscar14@gmail.com"
              icon={<Mail size={14} />}
            >
              {t('contact.cta')}
            </HologramButton>
          </div>

          <div className="flex justify-center gap-6">
            <SocialLink href="https://www.linkedin.com/in/oscardeveloper/" label="LinkedIn">
              <LinkedinIcon size={22} />
            </SocialLink>
            <SocialLink href="https://github.com/oortega14" label="GitHub">
              <GithubIcon size={22} />
            </SocialLink>
            <SocialLink href="mailto:ortegaoscar14@gmail.com" label="Email">
              <Mail size={22} />
            </SocialLink>
          </div>
        </div>
      </HologramCard>
    </section>
  );
}
