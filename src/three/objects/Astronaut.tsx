import { Float, useGLTF } from '@react-three/drei';
import { useCursorStore } from '@/stores/cursorStore';

const MODEL_URL = '/models/astronaut.glb';

useGLTF.preload(MODEL_URL);

function AstronautModel() {
  const { scene } = useGLTF(MODEL_URL);
  // scale/rotation values are starting guesses — tune visually with dev camera (press D).
  return (
    <primitive
      object={scene}
      scale={1.4}
      position={[0, -1, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function Astronaut() {
  const setThreeHover = useCursorStore((s) => s.setThreeHover);

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.3}
      floatIntensity={0.6}
      position={[0, 0.5, 0]}
    >
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setThreeHover(true);
        }}
        onPointerOut={() => {
          setThreeHover(false);
        }}
      >
        <AstronautModel />
      </group>
    </Float>
  );
}
