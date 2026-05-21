import { useTranslation } from 'react-i18next';
import type { Locale, Localized } from '@/types/content';

export function useLocalized() {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language.startsWith('es') ? 'es' : 'en';

  const pick = (field: Localized): string => field[locale] ?? field.en;

  return { locale, pick };
}
