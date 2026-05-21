import { useEffect, useState } from 'react';
import { useScrollStore } from '@/stores/scrollStore';

type CameraSnapshot = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

export default function CameraDebugOverlay() {
  const devCameraMode = useScrollStore((s) => s.devCameraMode);
  const toggleDevCameraMode = useScrollStore((s) => s.toggleDevCameraMode);
  const [snapshot, setSnapshot] = useState<CameraSnapshot | null>(null);

  // Toggle on 'D' key (only in dev builds)
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (e.key === 'd' || e.key === 'D') {
        toggleDevCameraMode();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleDevCameraMode]);

  // Poll camera state when dev mode is on.
  useEffect(() => {
    if (!devCameraMode) return;
    const id = setInterval(() => {
      const cam = (window as unknown as { __debugCamera?: CameraSnapshot }).__debugCamera;
      if (cam) {
        setSnapshot({
          position: [cam.position[0], cam.position[1], cam.position[2]],
          lookAt:   [cam.lookAt[0],   cam.lookAt[1],   cam.lookAt[2]],
        });
      }
    }, 100);
    return () => clearInterval(id);
  }, [devCameraMode]);

  if (!import.meta.env.DEV) return null;
  if (!devCameraMode) return null;

  const fmt = (n: number) => n.toFixed(2);
  const posStr = snapshot ? `[${fmt(snapshot.position[0])}, ${fmt(snapshot.position[1])}, ${fmt(snapshot.position[2])}]` : '—';
  const lookStr = snapshot ? `[${fmt(snapshot.lookAt[0])}, ${fmt(snapshot.lookAt[1])}, ${fmt(snapshot.lookAt[2])}]` : '—';

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 9990,
        padding: '12px 14px',
        background: 'rgba(5, 10, 20, 0.92)',
        border: '1px solid rgba(0, 212, 255, 0.5)',
        boxShadow: 'var(--cyan-glow)',
        color: 'var(--cyan-100)',
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        fontSize: 12,
        lineHeight: 1.5,
        borderRadius: 6,
        pointerEvents: 'none',
        minWidth: 280,
      }}
    >
      <div style={{ color: 'var(--cyan-400)', marginBottom: 6 }}>
        DEV CAMERA — press D to exit
      </div>
      <div>position: {posStr}</div>
      <div>lookAt:&nbsp;&nbsp; {lookStr}</div>
      <div style={{ marginTop: 6, opacity: 0.65 }}>
        Drag mouse to orbit, scroll wheel to zoom.<br />
        Copy values into <code>waypoints.ts</code>.
      </div>
    </div>
  );
}
