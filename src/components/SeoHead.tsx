import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { upsertHead } from '@/hooks/headTags';

const SITE = 'https://oortega14.com';

/** Canonical por ruta: dominio sin www, https y sin barra final. */
export default function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const link = upsertHead('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.rel = 'canonical';
      return l;
    }) as HTMLLinkElement;
    link.href = `${SITE}${path}`;
  }, [pathname]);

  return null;
}
