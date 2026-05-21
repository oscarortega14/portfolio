import { create } from 'zustand';

export type IntroState = 'loading' | 'intro' | 'ready';

type ScrollState = {
  progress: number;
  devCameraMode: boolean;
  introState: IntroState;
  introStartedAt: number | null;
  setProgress: (p: number) => void;
  toggleDevCameraMode: () => void;
  startIntro: () => void;
  finishIntro: () => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  devCameraMode: false,
  introState: 'loading',
  introStartedAt: null,
  setProgress: (progress) => set({ progress }),
  toggleDevCameraMode: () => set((s) => ({ devCameraMode: !s.devCameraMode })),
  startIntro: () =>
    set({ introState: 'intro', introStartedAt: performance.now() }),
  finishIntro: () => set({ introState: 'ready' }),
}));
