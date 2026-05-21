import { useRef } from 'react';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Satellite() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <Float
      position={[-6.5, 3.5, -3]}
      speed={0.8}
      rotationIntensity={0.15}
      floatIntensity={0.35}
    >
      <group ref={groupRef} scale={0.55}>
        {/* Body */}
        <mesh>
          <boxGeometry args={[0.8, 0.5, 0.5]} />
          <meshStandardMaterial color="#e0fbff" metalness={0.4} roughness={0.45} />
        </mesh>

        {/* Solar panels — left */}
        <mesh position={[-1.1, 0, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.5]} />
          <meshStandardMaterial color="#0a1224" metalness={0.6} roughness={0.2} emissive="#00d4ff" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.08]} />
          <meshStandardMaterial color="#67e8f9" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Solar panels — right */}
        <mesh position={[1.1, 0, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.5]} />
          <meshStandardMaterial color="#0a1224" metalness={0.6} roughness={0.2} emissive="#00d4ff" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.08]} />
          <meshStandardMaterial color="#67e8f9" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Antenna mast */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
          <meshStandardMaterial color="#e0fbff" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Dish */}
        <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2.6, 0, 0]}>
          <coneGeometry args={[0.22, 0.18, 24, 1, true]} />
          <meshStandardMaterial color="#e0fbff" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>

        {/* Tip light — emissive */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={4} />
        </mesh>
      </group>
    </Float>
  );
}
