import { useEffect } from 'react';
import { upsertHead } from '@/hooks/headTags';

/** Marca la página actual como no indexable mientras está montada (p. ej. 404). */
export default function useNoIndex() {
  useEffect(() => {
    const meta = upsertHead('meta[name="robots"]', () => {
      const m = document.createElement('meta');
      m.name = 'robots';
      return m;
    }) as HTMLMetaElement;
    meta.content = 'noindex';
    const canonical = document.head.querySelector('link[rel="canonical"]');
    canonical?.remove();
    return () => meta.remove();
  }, []);
}
