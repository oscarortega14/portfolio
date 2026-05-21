import { create } from 'zustand';

export type CursorState = 'default' | 'link' | 'three';

type CursorStoreShape = {
  state: CursorState;
  hoverCount: number;
  threeHover: boolean;
  setLinkHover: (on: boolean) => void;
  setThreeHover: (on: boolean) => void;
};

export const useCursorStore = create<CursorStoreShape>((set, get) => ({
  state: 'default',
  hoverCount: 0,
  threeHover: false,
  setLinkHover: (on) => {
    const next = Math.max(0, get().hoverCount + (on ? 1 : -1));
    set({
      hoverCount: next,
      state: get().threeHover ? 'three' : next > 0 ? 'link' : 'default',
    });
  },
  setThreeHover: (on) => {
    set({
      threeHover: on,
      state: on ? 'three' : get().hoverCount > 0 ? 'link' : 'default',
    });
  },
}));
