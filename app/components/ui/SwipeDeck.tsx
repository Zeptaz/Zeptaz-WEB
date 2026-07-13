'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/**
 * Horizontally swipeable, scroll-snapped card deck - the mobile counterpart to
 * the desktop centrepieces (engine tunnel, CardSwap stack).
 *
 * Slides are narrower than the track so the next card always peeks: that edge
 * is the only thing telling a visitor more cards exist.
 *
 * `data-lenis-prevent` is load-bearing - without it Lenis (see SmoothScroll)
 * swallows the horizontal touch gesture and the deck feels dead.
 */

interface SwipeDeckProps<T> {
  items: T[];
  getKey: (item: T, i: number) => string;
  renderItem: (item: T, i: number) => ReactNode;
  /** Accessible name for the deck, e.g. "Engine modules". */
  label: string;
  slideLabel?: (item: T, i: number) => string;
  tone?: 'dark' | 'light';
  className?: string;
}

export default function SwipeDeck<T>({
  items,
  getKey,
  renderItem,
  label,
  slideLabel,
  tone = 'dark',
  className,
}: SwipeDeckProps<T>) {
  const track = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => setReduced(prefersReducedMotion()), []);

  // Derive the active slide from scroll position (not click state) so the
  // counter stays truthful mid-swipe.
  const sync = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = track.current;
      if (!el) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < el.children.length; i++) {
        const c = el.children[i] as HTMLElement;
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      setIndex(best);
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = Math.max(0, Math.min(items.length - 1, i));
      const c = el.children[next] as HTMLElement | undefined;
      if (!c) return;
      el.scrollTo({
        left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2,
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [items.length, reduced],
  );

  const light = tone === 'light';

  // Reduced motion: no swiping, just stack the same cards vertically.
  if (reduced) {
    return (
      <div className={cn('flex flex-col gap-4', className)}>
        {items.map((item, i) => (
          <div key={getKey(item, i)}>{renderItem(item, i)}</div>
        ))}
      </div>
    );
  }

  return (
    // min-w-0 so the deck can never be sized by its own slides when it sits in
    // a grid/flex parent - that inverts the constraint and blows out the track.
    <div className={cn('relative min-w-0', className)}>
      <div
        ref={track}
        onScroll={sync}
        // Lenis must keep its hands off this scroller.
        data-lenis-prevent
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(index + 1);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goTo(index - 1);
          }
        }}
        className={cn(
          'flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain scroll-smooth',
          // hide the native scrollbar - the counter and rule below are the affordance
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {items.map((item, i) => (
          <div
            key={getKey(item, i)}
            role="group"
            aria-roledescription="slide"
            aria-label={slideLabel?.(item, i) ?? `${i + 1} of ${items.length}`}
            className="w-[86%] shrink-0 snap-center sm:w-[62%] md:w-[46%]"
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {/* progress: mono counter + segmented rule (not generic dots) */}
      <div className="mt-5 flex items-center gap-4">
        <span className={cn('mono-meta shrink-0 tabular-nums', light ? 'text-ink-muted' : 'text-text-faint')}>
          <span className={light ? 'text-ink' : 'text-text-primary'}>{String(index + 1).padStart(2, '0')}</span>
          {' / '}
          {String(items.length).padStart(2, '0')}
        </span>

        <div aria-hidden className="flex flex-1 gap-1">
          {items.map((item, i) => (
            <span
              key={getKey(item, i)}
              className={cn(
                'h-px flex-1 transition-colors duration-300',
                i === index ? 'bg-crimson' : light ? 'bg-ink-border' : 'bg-border-strong',
              )}
            />
          ))}
        </div>

        <div className="flex shrink-0 gap-2">
          {([['prev', ArrowLeft], ['next', ArrowRight]] as const).map(([dir, Icon]) => {
            const disabled = dir === 'prev' ? index === 0 : index === items.length - 1;
            return (
              <button
                key={dir}
                type="button"
                onClick={() => goTo(dir === 'prev' ? index - 1 : index + 1)}
                disabled={disabled}
                aria-label={dir === 'prev' ? 'Previous card' : 'Next card'}
                className={cn(
                  'flex h-11 w-11 items-center justify-center border transition-colors',
                  light
                    ? 'border-ink-border-strong text-ink hover:border-crimson hover:text-crimson'
                    : 'border-border-strong text-text-secondary hover:border-crimson hover:text-crimson',
                  disabled && 'pointer-events-none opacity-30',
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
