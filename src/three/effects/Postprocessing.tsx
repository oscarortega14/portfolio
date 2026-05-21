import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  HueSaturation,
  BrightnessContrast,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useReducedQuality } from '@/three/hooks/useReducedQuality';

const chromaticOffset = new THREE.Vector2(0.0008, 0.0008);

export default function Postprocessing() {
  const reduced = useReducedQuality();

  if (reduced) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={0.95}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.4}
        mipmapBlur
      />

      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaticOffset}
        radialModulation={false}
        modulationOffset={0}
      />

      <HueSaturation
        blendFunction={BlendFunction.NORMAL}
        hue={0}
        saturation={-0.12}
      />

      <BrightnessContrast
        blendFunction={BlendFunction.NORMAL}
        brightness={-0.02}
        contrast={0.06}
      />

      <Vignette
        blendFunction={BlendFunction.NORMAL}
        offset={0.32}
        darkness={0.55}
      />
    </EffectComposer>
  );
}
