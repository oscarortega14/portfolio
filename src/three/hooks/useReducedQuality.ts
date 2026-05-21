import { useEffect, useState } from 'react';

function evaluate(): boolean {
  if (typeof window === 'undefined') return false;
  const narrow = window.matchMedia('(max-width: 767px)').matches;
  const lowCores = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 8) < 4;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return narrow || lowCores || reducedMotion;
}

export function useReducedQuality(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => evaluate());

  useEffect(() => {
    const onResize = () => setReduced(evaluate());
    window.addEventListener('resize', onResize);
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionMq.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      motionMq.removeEventListener('change', onResize);
    };
  }, []);

  return reduced;
}
