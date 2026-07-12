'use client';
import { useRef, useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { ENGINE_MODULES, type Tier } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import FlagBadge from '@/components/ui/FlagBadge';

/**
 * /engine dependency spine - the module anatomy as a route diagram, not a
 * card grid. One continuous crimson line draws down the page as you scroll;
 * the 11 modules sit on it as stations, alternating sides on desktop, with
 * the full detail copy, tier markers, and a mono "feeds →" pointer that
 * makes the dependency chain literal.
 */

const TIERS: Tier[] = ['starter', 'growth', 'scale'];

function TierMarks({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Included in: ${tiers.join(', ')}`}>
      {TIERS.map((t) => {
        const on = tiers.includes(t);
        return (
          <span
            key={t}
            className={cn(
              'border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]',
              on ? 'border-crimson/40 text-crimson' : 'border-border text-text-faint line-through decoration-text-faint/60',
            )}
          >
            {t}
          </span>
        );
      })}
    </div>
  );
}

export default function ModuleSpine() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  // The crimson line draws downward, scrubbed to scroll.
  useEffect(() => {
    const el = fill.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.transform = 'scaleY(1)';
      return;
    }
    const tween = gsap.fromTo(
      el,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 65%', end: 'bottom 75%', scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section data-nav="dark" className="section-dark relative overflow-hidden border-t border-border py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <Eyebrow className="mb-6">Module Anatomy</Eyebrow>
          <Reveal as="h2" className="heading-xl text-text-primary">Eleven stations, one route.</Reveal>
          <Reveal as="p" delay={0.05} className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
            Work travels this line top to bottom. Each station depends on the one before it - skip one and everything downstream degrades. That’s why you size the build instead of cherry-picking modules.
          </Reveal>
        </div>

        {/* the spine */}
        <div ref={root} className="relative mt-16">
          {/* rail: faint track + crimson draw fill */}
          <div className="absolute bottom-0 top-0 left-4 w-px bg-border lg:left-1/2" aria-hidden>
            <div ref={fill} className="h-full w-px origin-top bg-crimson" style={{ transform: 'scaleY(0)' }} />
          </div>

          <ol className="flex flex-col gap-14">
            {ENGINE_MODULES.map((m, i) => {
              const Icon = m.icon;
              const left = i % 2 === 0; // desktop: alternate sides
              const next = ENGINE_MODULES[i + 1];
              return (
                <li key={m.id} className="relative grid grid-cols-[32px_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)]">
                  {/* station node on the line */}
                  <div className="relative col-start-1 lg:col-start-2 lg:row-start-1">
                    <span
                      aria-hidden
                      className={cn(
                        'absolute top-2 left-4 h-2.5 w-2.5 -translate-x-1/2 rotate-45 lg:left-1/2',
                        m.flag ? 'bg-bg-primary ring-1 ring-crimson' : 'bg-crimson',
                      )}
                    />
                  </div>

                  {/* station content */}
                  <Reveal
                    className={cn(
                      'col-start-2 lg:row-start-1',
                      left ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-3',
                    )}
                  >
                    <div className={cn('flex items-center gap-3', left && 'lg:flex-row-reverse')}>
                      <span className="flex h-9 w-9 items-center justify-center border border-border-strong text-crimson">
                        <Icon className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.18em] text-text-faint">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[17px] font-semibold text-text-primary">{m.name}</h3>
                    <p className={cn('mt-2 max-w-md text-[13.5px] leading-relaxed text-text-muted', left && 'lg:ml-auto')}>
                      {m.detail}
                    </p>
                    <div className={cn('mt-4 flex flex-wrap items-center gap-3', left && 'lg:justify-end')}>
                      <TierMarks tiers={m.tiers} />
                      {m.flag && <FlagBadge flag={m.flag} />}
                    </div>
                    <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint">
                      {next ? (
                        <>feeds <span className="text-crimson">→</span> {next.name}</>
                      ) : (
                        <>route <span className="text-crimson">complete</span> - records reconcile</>
                      )}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
