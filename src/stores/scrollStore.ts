import { create } from 'zustand';

export type IntroState = 'loading' | 'intro' | 'ready';

type ScrollState = {
  progress: number;
  devCameraMode: boolean;
  introState: IntroState;
  introStartedAt: number | null;
  sceneLoaded: boolean;
  setProgress: (p: number) => void;
  toggleDevCameraMode: () => void;
  startIntro: () => void;
  finishIntro: () => void;
  setSceneLoaded: (v: boolean) => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  devCameraMode: false,
  introState: 'loading',
  introStartedAt: null,
  sceneLoaded: false,
  setProgress: (progress) => set({ progress }),
  toggleDevCameraMode: () => set((s) => ({ devCameraMode: !s.devCameraMode })),
  startIntro: () =>
    set({ introState: 'intro', introStartedAt: performance.now() }),
  finishIntro: () => set({ introState: 'ready' }),
  setSceneLoaded: (v) => set({ sceneLoaded: v }),
}));
