'use client';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { prefersReducedMotion } from '@/lib/gsap';

/* Adapted from ReactBits "Decrypted Text" - the shuffle/scramble-on-hover effect.
   Trimmed to drop the motion/react dependency (plain <span>) and respect reduced motion. */

interface DecryptedTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
}

export default function DecryptedText({
  text,
  speed = 45,
  maxIterations = 12,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#=/%<>{}*+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  ...props
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const reduce = typeof window !== 'undefined' && prefersReducedMotion();

  const availableChars = useMemo<string[]>(
    () =>
      useOriginalCharsOnly
        ? Array.from(new Set(text.split(''))).filter((c) => c !== ' ')
        : characters.split(''),
    [useOriginalCharsOnly, text, characters],
  );

  const shuffleText = useCallback(
    (original: string, revealed: Set<number>) =>
      original
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (revealed.has(i)) return original[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join(''),
    [availableChars],
  );

  useEffect(() => {
    if (reduce) { setDisplayText(text); return; }
    let interval: ReturnType<typeof setInterval>;
    let iteration = 0;

    const getNextIndex = (revealed: Set<number>): number => {
      const len = text.length;
      switch (revealDirection) {
        case 'end': return len - 1 - revealed.size;
        case 'center': {
          const middle = Math.floor(len / 2);
          const offset = Math.floor(revealed.size / 2);
          const next = revealed.size % 2 === 0 ? middle + offset : middle - offset - 1;
          if (next >= 0 && next < len && !revealed.has(next)) return next;
          for (let i = 0; i < len; i++) if (!revealed.has(i)) return i;
          return 0;
        }
        default: return revealed.size;
      }
    };

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices((prev) => {
          if (sequential) {
            if (prev.size < text.length) {
              const next = new Set(prev);
              next.add(getNextIndex(prev));
              setDisplayText(shuffleText(text, next));
              return next;
            }
            clearInterval(interval);
            setIsScrambling(false);
            return prev;
          }
          setDisplayText(shuffleText(text, prev));
          iteration++;
          if (iteration >= maxIterations) {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
          }
          return prev;
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
    }

    return () => clearInterval(interval);
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, shuffleText, reduce]);

  useEffect(() => {
    if (animateOn !== 'view' || reduce) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting && !hasAnimated) { setIsHovering(true); setHasAnimated(true); }
      }),
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animateOn, hasAnimated, reduce]);

  const hoverProps =
    animateOn === 'hover' && !reduce
      ? { onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false) }
      : {};

  return (
    <span ref={containerRef} className={`inline-block whitespace-pre-wrap ${parentClassName}`} {...hoverProps} {...props}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, i) => {
          const revealed = revealedIndices.has(i) || !isScrambling || reduce;
          return (
            <span key={i} className={revealed ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
