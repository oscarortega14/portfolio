import { useEffect, useRef } from 'react';
import { useCursorStore } from '@/stores/cursorStore';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const ringScale = useRef(1);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.documentElement.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.18;
      if (ringRef.current) {
        const s = ringScale.current;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${s})`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const unsub = useCursorStore.subscribe((state) => {
      ringScale.current = state.state === 'three' ? 2.2 : state.state === 'link' ? 1.6 : 1;
      if (!ringRef.current) return;
      const color = state.state === 'three' ? 'var(--cyan-500)' : 'rgba(224, 251, 255, 0.7)';
      ringRef.current.style.borderColor = color;
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.documentElement.style.cursor = '';
      unsub();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--cyan-500)',
          boxShadow: 'var(--cyan-glow)',
          pointerEvents: 'none',
          zIndex: 'var(--z-cursor)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1.5px solid rgba(224, 251, 255, 0.7)',
          pointerEvents: 'none',
          zIndex: 'var(--z-cursor)',
          willChange: 'transform',
          transition: 'border-color 0.2s ease',
        }}
      />
    </>
  );
}
