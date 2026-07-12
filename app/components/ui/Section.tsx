import { cn } from '@/lib/utils';

/**
 * Section surface wrapper. Sets light/dark theme + a data-nav attribute the
 * Navbar reads (via ScrollTrigger) to invert its colors over light sections.
 */
export default function Section({
  id,
  tone = 'dark',
  className,
  containerClassName,
  children,
  full = false,
}: {
  id?: string;
  tone?: 'dark' | 'light';
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <section
      id={id}
      data-nav={tone}
      className={cn('relative overflow-hidden', tone === 'dark' ? 'section-dark' : 'section-light', className)}
    >
      {full ? children : (
        <div className={cn('relative mx-auto w-full max-w-[1240px] px-5 sm:px-8', containerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}
