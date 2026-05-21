export type SceneKey = 'hero' | 'about' | 'experience' | 'projects' | 'contact';

export type Waypoint = {
  key: SceneKey;
  position: [number, number, number];
  lookAt: [number, number, number];
};
