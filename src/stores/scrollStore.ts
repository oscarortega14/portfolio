import { create } from 'zustand';

type ScrollState = {
  progress: number;
  devCameraMode: boolean;
  setProgress: (p: number) => void;
  toggleDevCameraMode: () => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  devCameraMode: false,
  setProgress: (progress) => set({ progress }),
  toggleDevCameraMode: () => set((s) => ({ devCameraMode: !s.devCameraMode })),
}));
