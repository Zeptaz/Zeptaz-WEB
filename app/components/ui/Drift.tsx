'use client';
import { useRef, useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/**
 * Absolutely-positioned background texture layer that drifts slightly slower
 * than the section content - a cheap scroll parallax that makes the hard
 * dark/light section cuts feel layered instead of flat. The layer extends
 * past the section's top/bottom edges so the shift never reveals a gap.
 */
export default function Drift({ className, amount = 36 }: { className?: string; amount?: number }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      node,
      { y: -amount },
      {
        y: amount,
        ease: 'none',
        scrollTrigger: {
          trigger: node.parentElement ?? node,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [amount]);

  return (
    <div
      ref={el}
      aria-hidden
      className={cn('pointer-events-none absolute inset-x-0', className)}
      style={{ top: -amount, bottom: -amount }}
    />
  );
}
