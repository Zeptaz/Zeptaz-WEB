'use client';
import { useRef, useEffect, createElement, ElementType } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type RevealProps = {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  /** delay in seconds */
  delay?: number;
  y?: number;
  /** stagger direct children instead of the element itself */
  stagger?: number;
  start?: string;
  once?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/**
 * Scroll-triggered fade/slide reveal. If `stagger` is set, animates direct
 * children; otherwise animates the element itself. Reduced-motion safe.
 */
export default function Reveal({
  as: Tag = 'div',
  children,
  className,
  delay = 0,
  y = 32,
  stagger,
  start = 'top 85%',
  once = true,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = stagger ? Array.from(el.children) : [el];
    if (targets.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        delay,
        ease: 'power3.out',
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start, toggleActions: once ? 'play none none none' : 'play none none reset' },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y, stagger, start, once]);

  // Use createElement to avoid the polymorphic-`as` JSX `never` inference that
  // React 19 types trigger for a spread `ElementType` tag.
  return createElement(Tag, { ref, className: cn('will-reveal', className), ...rest }, children);
}
