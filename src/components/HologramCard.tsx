import type { ReactNode, CSSProperties } from 'react';

type Variant = 'compact' | 'full';

type HologramCardProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
};

const clipFull = `polygon(
  0% 14px, 14px 0%,
  100% 0%,
  100% calc(100% - 14px),
  calc(100% - 14px) 100%,
  0% 100%
)`;

const clipCompact = `polygon(
  0% 8px, 8px 0%,
  100% 0%,
  100% calc(100% - 8px),
  calc(100% - 8px) 100%,
  0% 100%
)`;

export default function HologramCard({ children, variant = 'full', className, style }: HologramCardProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        padding: variant === 'full' ? '24px 28px' : '14px 18px',
        background: 'rgba(10, 18, 36, 0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        clipPath: variant === 'full' ? clipFull : clipCompact,
        boxShadow:
          'inset 0 0 0 1px rgba(0, 212, 255, 0.35), 0 0 24px rgba(0, 212, 255, 0.12)',
        color: 'var(--cyan-100)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
