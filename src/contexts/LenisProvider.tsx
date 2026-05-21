import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { LenisContext, type LenisContextValue } from './lenisContext';
import { useScrollStore } from '@/stores/scrollStore';

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Start stopped — Preloader will release once intro completes.
    lenis.stop();

    const handleScroll = ({ progress }: { progress: number }) => {
      useScrollStore.getState().setProgress(progress);
    };
    lenis.on('scroll', handleScroll);
    useScrollStore.getState().setProgress(lenis.progress ?? 0);

    // React to introState changes — start scrolling once ready, stop otherwise.
    const unsub = useScrollStore.subscribe((state, prev) => {
      if (state.introState !== prev.introState) {
        if (state.introState === 'ready') lenis.start();
        else lenis.stop();
      }
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', handleScroll);
      unsub();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo: LenisContextValue['scrollTo'] = (target, options) => {
    lenisRef.current?.scrollTo(target, options);
  };

  return <LenisContext.Provider value={{ scrollTo }}>{children}</LenisContext.Provider>;
}
