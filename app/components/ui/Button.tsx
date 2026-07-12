'use client';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { lenisScrollTo } from '@/components/layout/SmoothScroll';

type Variant = 'primary' | 'ghost-dark' | 'ghost-light' | 'invert';

export default function Button({
  children,
  href,
  variant = 'primary',
  arrow = false,
  className,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(
    'btn group',
    variant === 'primary' && 'btn-primary',
    variant === 'ghost-dark' && 'btn-ghost-dark',
    variant === 'ghost-light' && 'btn-ghost-light',
    variant === 'invert' && 'btn-invert',
    className
  );

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
      )}
    </>
  );

  if (href?.startsWith('#')) {
    return (
      <a
        href={href}
        className={cls}
        onClick={(e) => { e.preventDefault(); lenisScrollTo(href); onClick?.(); }}
      >
        {inner}
      </a>
    );
  }
  if (href) {
    return <a href={href} className={cls} onClick={onClick}>{inner}</a>;
  }
  return <button type="button" className={cls} onClick={onClick}>{inner}</button>;
}
