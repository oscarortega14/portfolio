import { useContext } from 'react';
import { LenisContext } from '@/contexts/lenisContext';

export function useLenisScroll() {
  const ctx = useContext(LenisContext);
  if (!ctx) {
    throw new Error('useLenisScroll must be used inside a LenisProvider');
  }
  return ctx;
}
