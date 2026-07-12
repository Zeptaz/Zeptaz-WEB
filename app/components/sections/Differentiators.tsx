'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { DIFFERENTIATORS } from '@/lib/constants';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import Drift from '@/components/ui/Drift';

const ITEMS = DIFFERENTIATORS;
const N = ITEMS.length;
const INTERVAL = 3200;

export default function Differentiators() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [fill, setFill] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => setReduced(prefersReducedMotion()), []);

  const autoplaying = playing && !paused && isDesktop && !reduced;

  const select = (i: number) => { setActive(((i % N) + N) % N); setPlaying(false); };

  // Play-on-enter.
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const st = ScrollTrigger.create({ trigger: el, start: 'top 70%', once: true, onEnter: () => setPlaying(true) });
    return () => st.kill();
  }, [reduced]);

  // Auto-cycle.
  useEffect(() => {
    if (!autoplaying) return;
    const id = setInterval(() => setActive((a) => (a + 1) % N), INTERVAL);
    return () => clearInterval(id);
  }, [autoplaying]);

  // Restart the progress bar each step.
  useEffect(() => {
    setFill(false);
    if (!autoplaying) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setFill(true)));
    return () => cancelAnimationFrame(id);
  }, [active, autoplaying]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select(active + 1); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select(active - 1); }
  };

  const d = ITEMS[active];
  const ActiveIcon = d.icon;

  return (
    <section id="different" data-nav="light" ref={root} className="section-light section-screen relative overflow-hidden">
      <Drift className="grid-lines-light opacity-40" />
      <div className="section-shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:items-start">
          {/* statement + stage */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Eyebrow index="04" tone="light" className="mb-6">Why Zeptaz</Eyebrow>
            <Reveal as="h2" className="heading-xl text-ink">
              Not another AI <span className="text-crimson">hype</span> shop.
            </Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-md text-base leading-relaxed text-ink-secondary">
              Most AI vendors sell magic, autonomy, and guaranteed numbers. We sell reliable systems with clear boundaries - operator-first, specific, and skeptical.
            </Reveal>
            <Reveal as="div" delay={0.1} className="mt-8 border-l-2 border-crimson pl-4">
              <p className="font-mono text-[12px] leading-relaxed text-ink-secondary">
                “Position AI as an assistant inside a controlled workflow - not as magic.”
              </p>
            </Reveal>

            {/* desktop stage - the active differentiator's reality */}
            <div className="mt-10 hidden border-t border-ink-border pt-8 lg:block">
              <div key={active} className="animate-engine-fade">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted line-through decoration-ink-muted/50">{d.not}</div>
                <div className="mt-4 flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-crimson text-crimson">
                    <ActiveIcon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="heading-md text-ink">{d.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">{d.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* rail */}
          <div
            role="tablist"
            aria-label="Why Zeptaz"
            tabIndex={0}
            onKeyDown={onKey}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="border-t border-ink-border outline-none"
          >
            {ITEMS.map((it, i) => {
              const on = active === i;
              const Icon = it.icon;
              return (
                <button
                  key={it.no}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-current={on ? 'true' : undefined}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => select(i)}
                  className={cn(
                    'group relative block w-full border-b border-ink-border px-4 py-5 text-left transition-colors duration-300',
                    on ? 'bg-paper-2' : 'hover:bg-paper-2/50',
                  )}
                >
                  {/* active left marker */}
                  <span className={cn('absolute left-0 top-0 h-full w-0.5 bg-crimson transition-opacity', on ? 'opacity-100' : 'opacity-0')} />

                  <div className="flex items-center gap-3">
                    <span className={cn('font-mono text-[11px] tracking-[0.18em]', on ? 'text-crimson' : 'text-ink-muted')}>{it.no}</span>
                    <span className={cn('font-mono text-[12px] uppercase tracking-[0.1em] line-through decoration-ink-muted/50 transition-colors', on ? 'text-ink' : 'text-ink-muted')}>{it.not}</span>
                  </div>

                  {/* mobile inline reality */}
                  <div className={cn('grid transition-[grid-template-rows] duration-500 ease-out lg:hidden', on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                    <div className="overflow-hidden">
                      <div className="mt-3 flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-crimson text-crimson">
                          <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                        </span>
                        <div>
                          <h3 className="heading-md text-ink">{it.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{it.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* desktop autoplay progress bar */}
                  {on && (
                    <span
                      className="absolute bottom-0 left-0 hidden h-0.5 bg-crimson lg:block"
                      style={{ width: fill ? '100%' : '0%', transition: autoplaying ? `width ${INTERVAL}ms linear` : 'none' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
