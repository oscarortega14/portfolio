import { Stars as DreiStars } from '@react-three/drei';

export default function Stars() {
  return (
    <DreiStars
      radius={25}
      depth={45}
      count={1800}
      factor={4.5}
      saturation={0}
      fade
      speed={0.8}
    />
  );
}
