import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Lighting from './lighting/Lighting';
import Stars from './objects/Stars';
import GridFloor from './objects/GridFloor';
import Astronaut from './objects/Astronaut';
import Postprocessing from './effects/Postprocessing';
import CameraRig, { CameraDebugPublisher } from './camera/CameraRig';
import { waypoints } from './camera/waypoints';
import { useScrollStore } from '@/stores/scrollStore';

export default function Scene() {
  const devCameraMode = useScrollStore((s) => s.devCameraMode);
  const initial = waypoints[0]!;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: devCameraMode ? 20 : 0,
        // Normal: canvas catches pointer only where no HTML overlay sits above (z stacking).
        // Dev: canvas above everything to grab OrbitControls input freely.
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[0x050a14]} />
        <fog attach="fog" args={[0x050a14, 35, 140]} />

        <PerspectiveCamera
          makeDefault
          fov={50}
          near={0.1}
          far={200}
          position={initial.position}
        />

        <Suspense fallback={null}>
          <Lighting />
          <Stars />
          <GridFloor />
          <Astronaut />
          <CameraRig />
          {devCameraMode && import.meta.env.DEV && <CameraDebugPublisher />}
          {devCameraMode && (
            <OrbitControls
              enablePan
              enableDamping
              dampingFactor={0.08}
              target={initial.lookAt}
            />
          )}
          <Postprocessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
