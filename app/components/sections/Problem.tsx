'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { PROBLEM } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Eyebrow from '@/components/ui/Eyebrow';

const PAINS = PROBLEM.pains;
const total = String(PAINS.length).padStart(2, '0');
// leak severity rises across the pains
const SEVERITY = [62, 74, 85, 92];

export default function Problem() {
  const root = useRef<HTMLDivElement>(null);
  const pinWrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'static' | 'pinned'>('static');
  const [active, setActive] = useState<number | null>(0);

  // SSR-safe: pinned hand-off on desktop, static elsewhere.
  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches && !prefersReducedMotion()) setMode('pinned');
  }, []);

  // Coordinated rise - the Problem stage glides up to "receive" the hero's dive.
  useEffect(() => {
    if (mode !== 'pinned') return;
    const pw = pinWrap.current;
    const st = stage.current;
    if (!pw || !st) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        st,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: 'power2.out',
          scrollTrigger: { trigger: pw, start: 'top top', end: '+=70%', scrub: true, pin: pw, anticipatePin: 1, invalidateOnRefresh: true },
        },
      );
    }, root);
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, [mode]);

  const content = (
    <div className="section-shell relative w-full">
      {/* intro */}
      <div className="max-w-3xl">
        <Eyebrow index="01" className="mb-6">{PROBLEM.eyebrow}</Eyebrow>
        <h2 className="heading-xl max-w-[20ch] text-text-primary">{PROBLEM.title}</h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">{PROBLEM.lead}</p>
      </div>

      {/* channels - work enters from everywhere */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">Work enters from</span>
        {PROBLEM.channels.map((c) => (
          <span key={c} className="border border-border bg-bg-subtle/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
            {c}
          </span>
        ))}
      </div>

      {/* pains - expandable bento */}
      <div className="mt-[clamp(2.25rem,4.5vh,3.5rem)] grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {PAINS.map((p, i) => {
          const on = active === i;
          return (
            <button
              key={p.label}
              type="button"
              aria-expanded={on}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive((a) => (a === i ? null : i))}
              className={cn(
                'group flex flex-col bg-bg-primary p-7 text-left transition-colors duration-300',
                on ? 'bg-bg-subtle' : 'hover:bg-bg-subtle/60',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.18em] text-text-faint">{String(i + 1).padStart(2, '0')}</span>
                <span className="bg-crimson/12 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-crimson">{p.stat}</span>
              </div>
              <div className={cn('mt-6 text-[15px] font-semibold transition-colors', on ? 'text-crimson' : 'text-text-primary')}>{p.label}</div>

              {/* expandable region */}
              <div className={cn('grid transition-[grid-template-rows] duration-500 ease-out', on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <div className="overflow-hidden">
                  <p className="mt-2 text-[13px] leading-relaxed text-text-muted">{p.desc}</p>
                  {/* leak meter */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-text-faint">
                      <span>Leak</span>
                      <span className="text-crimson">{SEVERITY[i]}%</span>
                    </div>
                    <div className="h-1 w-full bg-border-strong">
                      <div
                        className="h-full bg-crimson transition-[width] duration-700 ease-out motion-reduce:transition-none"
                        style={{ width: on ? `${SEVERITY[i]}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">
        <span className="text-crimson">{total}</span> compounding leaks - hover a card to inspect
      </p>
    </div>
  );

  if (mode === 'pinned') {
    return (
      <section id="problem" data-nav="dark" ref={root} className="relative z-10 -mt-[100svh] overflow-hidden">
        <div ref={pinWrap} className="relative h-[100svh] overflow-hidden">
          <div ref={stage} className="absolute inset-0 flex flex-col justify-center bg-bg-primary">
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 25%, rgba(220,20,60,0.06), transparent 60%)' }} />
            {content}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="problem" data-nav="dark" ref={root} className="section-dark section-screen relative overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 25%, rgba(220,20,60,0.06), transparent 60%)' }} />
      {content}
    </section>
  );
}
