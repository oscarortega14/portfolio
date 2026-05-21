import { Sparkles } from '@react-three/drei';
import { useReducedQuality } from '@/three/hooks/useReducedQuality';

export default function Particles() {
  const reduced = useReducedQuality();

  const nearCount = reduced ? 60 : 220;
  const farCount = reduced ? 0 : 120;

  return (
    <>
      {/* Near layer — bigger, more visible particles around the astronaut */}
      <Sparkles
        count={nearCount}
        scale={[14, 10, 14]}
        position={[0, 1, 0]}
        size={2.2}
        speed={0.25}
        opacity={0.85}
        noise={1.2}
        color="#00d4ff"
      />

      {/* Far layer — sparser, finer, more stationary; gives a sense of depth */}
      {farCount > 0 && (
        <Sparkles
          count={farCount}
          scale={[32, 18, 32]}
          position={[0, 2, -4]}
          size={1.1}
          speed={0.08}
          opacity={0.55}
          noise={0.4}
          color="#67e8f9"
        />
      )}
    </>
  );
}
