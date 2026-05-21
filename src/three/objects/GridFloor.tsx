import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uDensity;

void main() {
  vec2 uv = vUv * uDensity;
  vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
  float line = min(grid.x, grid.y);
  float gridAlpha = 1.0 - min(line, 1.0);

  // radial fade from center
  float dist = length(vUv - 0.5);
  float fade = 1.0 - smoothstep(0.15, 0.5, dist);

  // subtle time-driven pulse
  float pulse = 0.85 + 0.15 * sin(uTime * 0.6);

  float alpha = gridAlpha * fade * pulse * 0.5;
  if (alpha < 0.01) discard;

  gl_FragColor = vec4(uColor, alpha);
}
`;

type Props = {
  size?: number;
  density?: number;
};

export default function GridFloor({ size = 40, density = 36 }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#00d4ff') },
      uDensity: { value: density },
    }),
    [density],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
