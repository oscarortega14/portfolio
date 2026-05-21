import type { Waypoint } from '@/types/three';

// Initial guesses — tune visually with the dev camera overlay.
// Press 'D' in the running site to enter dev mode, fly the camera with the
// mouse, then copy `position`/`lookAt` values from the on-screen readout into here.
export const waypoints: Waypoint[] = [
  // hero — head-on, default
  { key: 'hero',       position: [0, 1.5,  8], lookAt: [0, 1, 0] },

  // about — orbit right, slight high angle
  { key: 'about',      position: [4, 2.2,  6], lookAt: [0, 1, 0] },

  // experience — orbit far right behind, looking past astronaut
  { key: 'experience', position: [5, 1.5, -2], lookAt: [0, 1, 0] },

  // projects — orbit left, low angle looking up
  { key: 'projects',   position: [-4, 0.6, 5], lookAt: [0, 1.4, 0] },

  // contact — pulled back & up
  { key: 'contact',    position: [0, 4,   12], lookAt: [0, 0.5, 0] },
];
