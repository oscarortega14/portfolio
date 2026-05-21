import { createContext } from 'react';

export type LenisContextValue = {
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; duration?: number }) => void;
};

export const LenisContext = createContext<LenisContextValue | null>(null);
