import { useCursorStore } from '@/stores/cursorStore';

export function useCursorHover() {
  const setLinkHover = useCursorStore((s) => s.setLinkHover);
  return {
    onMouseEnter: () => setLinkHover(true),
    onMouseLeave: () => setLinkHover(false),
  };
}
