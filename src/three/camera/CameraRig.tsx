import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { waypoints, INTRO_START, INTRO_DURATION } from './waypoints';
import { easeInOutCubic, clamp01 } from '@/three/utils/easing';
import { useScrollStore } from '@/stores/scrollStore';

export default function CameraRig() {
  const posA = useRef(new THREE.Vector3());
  const posB = useRef(new THREE.Vector3());
  const lookA = useRef(new THREE.Vector3());
  const lookB = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  const total = useMemo(() => waypoints.length - 1, []);

  useFrame((state) => {
    const { progress, devCameraMode, introState, introStartedAt, finishIntro } =
      useScrollStore.getState();

    if (devCameraMode) return;
    const cam = state.camera;

    // --- Loading phase: hold at intro-start pose, ignore scroll ---
    if (introState === 'loading') {
      posA.current.fromArray(INTRO_START.position);
      lookA.current.fromArray(INTRO_START.lookAt);
      cam.position.copy(posA.current);
      cam.lookAt(lookA.current);
      return;
    }

    // --- Intro phase: lerp from intro-start to waypoint[0] over INTRO_DURATION ms ---
    if (introState === 'intro') {
      const start = introStartedAt ?? performance.now();
      const elapsed = performance.now() - start;
      const t = clamp01(elapsed / INTRO_DURATION);
      const eased = easeInOutCubic(t);

      posA.current.fromArray(INTRO_START.position);
      lookA.current.fromArray(INTRO_START.lookAt);
      const hero = waypoints[0]!;
      posB.current.fromArray(hero.position);
      lookB.current.fromArray(hero.lookAt);

      cam.position.lerpVectors(posA.current, posB.current, eased);
      tmpLook.current.lerpVectors(lookA.current, lookB.current, eased);
      cam.lookAt(tmpLook.current);

      if (t >= 1) finishIntro();
      return;
    }

    // --- Ready phase: scroll-driven (Phase 3 logic) ---
    if (total < 1) return;

    const p = clamp01(progress);
    const segment = Math.min(Math.floor(p * total), total - 1);
    const localT = p * total - segment;
    const eased = easeInOutCubic(clamp01(localT));

    const a = waypoints[segment]!;
    const b = waypoints[segment + 1]!;

    posA.current.fromArray(a.position);
    posB.current.fromArray(b.position);
    lookA.current.fromArray(a.lookAt);
    lookB.current.fromArray(b.lookAt);

    cam.position.lerpVectors(posA.current, posB.current, eased);
    tmpLook.current.lerpVectors(lookA.current, lookB.current, eased);
    cam.lookAt(tmpLook.current);
  });

  return null;
}

export function CameraDebugPublisher() {
  const camera = useThree((state) => state.camera);
  const forward = useRef(new THREE.Vector3());

  useFrame(() => {
    const win = window as unknown as {
      __debugCamera?: { position: [number, number, number]; lookAt: [number, number, number] };
    };
    camera.getWorldDirection(forward.current);
    const look: [number, number, number] = [
      camera.position.x + forward.current.x * 5,
      camera.position.y + forward.current.y * 5,
      camera.position.z + forward.current.z * 5,
    ];
    win.__debugCamera = {
      position: [camera.position.x, camera.position.y, camera.position.z],
      lookAt: look,
    };
  });

  return null;
}
