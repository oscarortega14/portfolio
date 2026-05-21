import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Lighting from './lighting/Lighting';
import Stars from './objects/Stars';
import GridFloor from './objects/GridFloor';
import Astronaut from './objects/Astronaut';
import Postprocessing from './effects/Postprocessing';

export default function Scene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 8], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[0x050a14]} />
        <fog attach="fog" args={[0x050a14, 35, 140]} />

        <Suspense fallback={null}>
          <Lighting />
          <Stars />
          <GridFloor />
          <Astronaut />
          <Postprocessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
