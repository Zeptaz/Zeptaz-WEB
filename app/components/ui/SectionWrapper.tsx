import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: ReactNode;
  innerClassName?: string;
  /** Renders a 1px #E8E8E8 line at the bottom of the section */
  divider?: boolean;
}

export default function SectionWrapper({
  id,
  className,
  children,
  innerClassName,
  divider = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn('py-[112px] relative overflow-hidden', className)}
    >
      <div className={cn('max-w-6xl mx-auto px-5 lg:px-12', innerClassName)}>
        {children}
      </div>
      {divider && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
      )}
    </section>
  );
}
