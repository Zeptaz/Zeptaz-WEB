import { cn } from '@/lib/utils';

/** Mono eyebrow label: ▮ INDEX · LABEL - Armory-style section tag. */
export default function Eyebrow({
  children,
  index,
  className,
  tone = 'dark',
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <span
      className={cn(
        'eyebrow',
        tone === 'dark' ? 'text-text-muted' : 'text-ink-muted',
        className
      )}
    >
      {index && <span className="text-crimson">{index}</span>}
      <span>{children}</span>
    </span>
  );
}
