import { motion } from 'framer-motion';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

type AppearingTextProps = {
  text: string;
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  staggerMs?: number;
  once?: boolean;
};

export default function AppearingText({
  text,
  as = 'p',
  className,
  style,
  delay = 0,
  staggerMs = 60,
  once = true,
}: AppearingTextProps) {
  const words = text.split(/\s+/);
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      transition={{ staggerChildren: staggerMs / 1000, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          style={{ display: 'inline-block', marginRight: '0.32em' }}
          variants={{
            hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
          }}
          transition={{ duration: 0.5, ease: [0.6, 0, 0.1, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
