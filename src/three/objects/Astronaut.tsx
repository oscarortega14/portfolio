import { Float } from '@react-three/drei';

// Replace the contents of <AstronautModel /> with `useGLTF('/models/astronaut.glb')`
// in a later phase when a CC0/CC-BY astronaut model is added to public/models/.
function AstronautModel() {
  return (
    <group>
      {/* Helmet shell — dark metallic outer */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#0a1224"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Visor — flattened ellipsoid embedded in the front of the helmet, glowing cyan */}
      <mesh position={[0, 1.05, 0.18]} scale={[0.34, 0.26, 0.16]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#00d4ff"
          metalness={0.6}
          roughness={0.05}
          emissive="#00d4ff"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Visor rim — thin dark ring outlining the visor for definition */}
      <mesh position={[0, 1.05, 0.18]} scale={[0.36, 0.28, 0.16]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#050a14"
          metalness={0.9}
          roughness={0.4}
          side={2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.36, 0.8, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 0.2, -0.32]}>
        <boxGeometry args={[0.6, 0.7, 0.25]} />
        <meshStandardMaterial color="#67e8f9" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Backpack lights */}
      <mesh position={[-0.18, 0.45, -0.46]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.18, 0.45, -0.46]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.5, 0.2, 0]} rotation={[0, 0, Math.PI / 12]}>
        <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.5, 0.2, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.2, -0.85, 0]}>
        <capsuleGeometry args={[0.14, 0.6, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.2, -0.85, 0]}>
        <capsuleGeometry args={[0.14, 0.6, 8, 16]} />
        <meshStandardMaterial color="#e0fbff" metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Astronaut() {
  return (
    <Float
      speed={1.2}
      rotationIntensity={0.3}
      floatIntensity={0.6}
      position={[0, 0.5, 0]}
    >
      <AstronautModel />
    </Float>
  );
}
