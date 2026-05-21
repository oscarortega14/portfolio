type TagProps = {
  children: React.ReactNode;
  size?: 'sm' | 'md';
};

export default function Tag({ children, size = 'md' }: TagProps) {
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';
  return (
    <span
      className={`inline-block rounded-full font-mono uppercase tracking-wider ${padding}`}
      style={{
        background: 'rgba(0, 212, 255, 0.08)',
        border: '1px solid rgba(0, 212, 255, 0.35)',
        color: 'var(--cyan-300)',
      }}
    >
      {children}
    </span>
  );
}
