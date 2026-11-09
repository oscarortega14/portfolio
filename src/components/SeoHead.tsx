import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { upsertHead } from '@/hooks/headTags';
import { useLocalized } from '@/hooks/useLocalized';
import { seoMeta } from '@/data/seoMeta';

const SITE = 'https://oortega14.com';

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  const el = upsertHead(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, key);
    return m;
  }) as HTMLMetaElement;
  el.content = value;
}

/** Canonical, título y descripción por ruta (https, sin www y sin barra final). */
export default function SeoHead() {
  const { pathname } = useLocation();
  const { locale } = useLocalized();

  useEffect(() => {
    const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const link = upsertHead('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.rel = 'canonical';
      return l;
    }) as HTMLLinkElement;
    link.href = `${SITE}${path}`;

    const meta = seoMeta[path]?.[locale];
    if (!meta) return;
    document.title = meta.title;
    setMeta('name', 'description', meta.description);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
  }, [pathname, locale]);

  return null;
}
