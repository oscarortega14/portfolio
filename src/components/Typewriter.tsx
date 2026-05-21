import { useEffect, useRef, useState } from 'react';

type TypewriterProps = {
  phrases: string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function Typewriter({
  phrases,
  typeMs = 80,
  deleteMs = 40,
  holdMs = 1700,
  className,
  style,
}: TypewriterProps) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (phrases.length === 0) return;

    const current = phrases[phraseIdx] ?? '';

    if (!deleting && text === current) {
      timerRef.current = window.setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && text === '') {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
    } else if (deleting) {
      timerRef.current = window.setTimeout(() => setText(text.slice(0, -1)), deleteMs);
    } else {
      timerRef.current = window.setTimeout(() => setText(current.slice(0, text.length + 1)), typeMs);
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [text, deleting, phraseIdx, phrases, typeMs, deleteMs, holdMs]);

  return (
    <span className={className} style={style}>
      {text}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '0.55em',
          height: '1em',
          background: 'var(--cyan-500)',
          marginLeft: 4,
          verticalAlign: 'baseline',
          animation: 'tw-blink 0.85s steps(2, end) infinite',
        }}
      />
      <style>{`
        @keyframes tw-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
