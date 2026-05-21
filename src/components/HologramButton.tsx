import { useState, type ReactNode } from 'react';
import { useCursorHover } from '@/hooks/useCursorHover';

type Variant = 'primary' | 'outline';

type CommonProps = {
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
  className?: string;
};

type AnchorProps = CommonProps & {
  as: 'a';
  href: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

type ButtonProps = CommonProps & {
  as?: 'button';
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type HologramButtonProps = AnchorProps | ButtonProps;

const clip = `polygon(
  0% 10px, 10px 0%,
  100% 0%,
  100% calc(100% - 10px),
  calc(100% - 10px) 100%,
  0% 100%
)`;

export default function HologramButton(props: HologramButtonProps) {
  const variant: Variant = props.variant ?? 'primary';
  const cursor = useCursorHover();
  const [hover, setHover] = useState(false);

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 22px',
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    cursor: 'pointer',
    clipPath: clip,
    transition: 'background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
    border: 'none',
  };

  const styleByVariant: React.CSSProperties =
    variant === 'primary'
      ? {
          background: hover ? 'var(--cyan-100)' : 'var(--cyan-500)',
          color: 'var(--bg-base)',
          boxShadow: hover ? 'var(--cyan-glow-strong)' : 'var(--cyan-glow)',
        }
      : {
          background: hover ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
          color: hover ? 'var(--cyan-100)' : 'var(--cyan-300)',
          boxShadow: 'inset 0 0 0 1px rgba(0, 212, 255, 0.5)',
        };

  const innerArrow = (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        transform: hover ? 'translateX(4px)' : 'translateX(0)',
        transition: 'transform 0.18s ease',
      }}
    >
      ›
    </span>
  );

  const handlers = {
    onMouseEnter: () => {
      setHover(true);
      cursor.onMouseEnter();
    },
    onMouseLeave: () => {
      setHover(false);
      cursor.onMouseLeave();
    },
  };

  if (props.as === 'a') {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        className={props.className}
        style={{ ...baseStyle, ...styleByVariant }}
        {...handlers}
      >
        {props.icon}
        <span>{props.children}</span>
        {innerArrow}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      className={props.className}
      style={{ ...baseStyle, ...styleByVariant }}
      {...handlers}
    >
      {props.icon}
      <span>{props.children}</span>
      {innerArrow}
    </button>
  );
}
