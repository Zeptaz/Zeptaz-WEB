'use client';
import { useRef, useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/** Count-up number that fires once on scroll-into-view. */
export default function StatCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

    if (prefersReducedMotion()) {
      el.textContent = format(value);
      return;
    }

    const obj = { n: 0 };
    el.textContent = format(0);
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        onUpdate: () => { el.textContent = format(obj.n); },
      });
    }, el);
    return () => ctx.revert();
  }, [value, prefix, suffix, decimals]);

  return <span ref={ref} className={cn('tabular-nums', className)}>{prefix}{value.toFixed(decimals)}{suffix}</span>;
}
