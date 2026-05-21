import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useReducedQuality } from '@/three/hooks/useReducedQuality';

export default function Postprocessing() {
  const reduced = useReducedQuality();

  return (
    <EffectComposer multisampling={reduced ? 0 : 2}>
      <Bloom
        intensity={reduced ? 0.5 : 0.9}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
    </EffectComposer>
  );
}
