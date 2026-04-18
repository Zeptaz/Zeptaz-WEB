import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string | ReactNode;
  className?: string;
  centered?: boolean;
  tag?: string;
  dark?: boolean; // kept for API compat, dark is now always default
}

export default function SectionHeading({
  title,
  subtitle,
  className,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-16', centered && 'text-center', className)}>
      {/* 1px divider */}
      <div className="h-px bg-[#1E1E1E] mb-6 w-full" />

      {/* Title */}
      <h2
        className={cn(
          'font-black leading-[1.0] tracking-[-0.01em] uppercase text-white',
          'text-[32px] sm:text-[44px] lg:text-[56px]',
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={cn(
            'mt-5 text-[16px] sm:text-[17px] leading-[1.7] text-[#A1A1A1]',
            centered && 'max-w-2xl mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** Standalone eyebrow tag element — use above SectionHeading */
export function EyebrowTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('eyebrow-tag mb-5', className)}>
      {children}
    </p>
  );
}
