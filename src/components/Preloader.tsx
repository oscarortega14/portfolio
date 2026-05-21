import { useEffect, useState } from 'react';
import { useScrollStore } from '@/stores/scrollStore';

const SYNTH_DURATION_MS = 1400;
const MIN_VISIBLE_MS = 1200;
const FADE_OUT_MS = 450;

const STATUS_LINES = [
  'INITIALIZING SYSTEMS',
  'CALIBRATING SENSORS',
  'ESTABLISHING UPLINK',
  'DOCKING WITH PORTFOLIO',
];

export default function Preloader() {
  const introState = useScrollStore((s) => s.introState);
  const sceneLoaded = useScrollStore((s) => s.sceneLoaded);
  const startIntro = useScrollStore((s) => s.startIntro);

  const [t, setT] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  // If we re-mount with the intro already complete (e.g. user navigated
  // away to a legal page and came back), skip the preloader entirely.
  const [hidden, setHidden] = useState(
    () => useScrollStore.getState().introState !== 'loading',
  );

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const ratio = Math.min(1, elapsed / SYNTH_DURATION_MS);
      setT(ratio);
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_LINES.length);
    }, 380);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!(t >= 1 && sceneLoaded)) return;
    const timer = window.setTimeout(() => {
      startIntro();
    }, Math.max(0, MIN_VISIBLE_MS - SYNTH_DURATION_MS));
    return () => window.clearTimeout(timer);
  }, [t, sceneLoaded, startIntro]);

  useEffect(() => {
    if (introState === 'loading') return;
    const timer = window.setTimeout(() => setHidden(true), FADE_OUT_MS + 50);
    return () => window.clearTimeout(timer);
  }, [introState]);

  if (hidden) return null;

  const displayPct = Math.min(t * 100, sceneLoaded ? 100 : 92);

  const fading = introState !== 'loading';

  return (
    <div
      aria-hidden={fading}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-preloader)',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: 24,
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_OUT_MS}ms ease`,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: 28,
          letterSpacing: '0.4em',
          color: 'var(--cyan-100)',
          textShadow: 'var(--cyan-glow-strong)',
        }}
      >
        OO<span style={{ color: 'var(--cyan-400)' }}>/</span>2026
      </div>

      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: 11,
          letterSpacing: '0.32em',
          color: 'var(--cyan-300)',
          minHeight: 16,
        }}
      >
        {STATUS_LINES[statusIdx]}…
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(displayPct)}
        style={{
          width: 'min(360px, 70vw)',
          height: 4,
          background: 'rgba(0, 212, 255, 0.12)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${displayPct}%`,
            height: '100%',
            background: 'var(--cyan-500)',
            boxShadow: 'var(--cyan-glow)',
            transition: 'width 0.18s linear',
          }}
        />
      </div>

      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: 11,
          letterSpacing: '0.16em',
          color: 'var(--cyan-400)',
          width: 'min(360px, 70vw)',
          textAlign: 'right',
          marginTop: -16,
        }}
      >
        {Math.round(displayPct).toString().padStart(3, '0')}%
      </div>
    </div>
  );
}
