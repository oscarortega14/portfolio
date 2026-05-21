import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { waypoints } from './waypoints';
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
    const { progress, devCameraMode } = useScrollStore.getState();
    if (devCameraMode) return;
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

    state.camera.position.lerpVectors(posA.current, posB.current, eased);
    tmpLook.current.lerpVectors(lookA.current, lookB.current, eased);
    state.camera.lookAt(tmpLook.current);
  });

  return null;
}

/**
 * Writes the live camera state to window.__debugCamera so the HTML overlay
 * (outside the Canvas) can display it. Only renders when devCameraMode is on
 * and only in dev builds. Tree-shakes out of production.
 */
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
