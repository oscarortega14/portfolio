import { Stars as DreiStars } from '@react-three/drei';

export default function Stars() {
  return (
    <DreiStars
      radius={60}
      depth={80}
      count={1200}
      factor={3.5}
      saturation={0}
      fade
      speed={0.3}
    />
  );
}
