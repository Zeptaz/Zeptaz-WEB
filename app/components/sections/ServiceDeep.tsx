'use client';
import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { SERVICES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import IsoArt from '@/components/illustrations/IsoArt';
import { lenisScrollTo } from '@/components/layout/SmoothScroll';

/**
 * /services deep-dive: the five systems in full - deliverables, an example
 * run rendered as a terminal trace, and the operational outcome. A sticky
 * mono rail tracks scroll position and jumps between systems.
 */

/** One mono trace line; [human-approve] style markers get the crimson accent. */
function TraceLine({ line }: { line: string }) {
  const m = line.match(/^(.*?)(\[[^\]]+\])?$/);
  return (
    // Wrap on mobile: five nowrap terminals meant five horizontal scrollers on
    // a phone. Only hold the single-line look once there's room for it.
    <div className="break-words font-mono text-[11.5px] leading-6 text-terminal-green/85 sm:text-[12px] lg:whitespace-nowrap lg:leading-7">
      <span className="text-ink-muted/70 select-none">&gt; </span>
      {m?.[1]}
      {m?.[2] && <span className="text-crimson">{m[2]}</span>}
    </div>
  );
}

export default function ServiceDeep() {
  const [active, setActive] = useState(SERVICES[0].slug);
  const chips = useRef<HTMLElement>(null);

  // Keep the active chip in view on the mobile index without scrolling the page.
  useEffect(() => {
    const nav = chips.current;
    const chip = nav?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (!nav || !chip) return;
    nav.scrollTo({
      left: chip.offsetLeft - (nav.clientWidth - chip.offsetWidth) / 2,
      behavior: 'smooth',
    });
  }, [active]);

  // Scroll-spy: highlight the system currently in view on the rail.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    SERVICES.forEach((s) => {
      const el = document.getElementById(s.slug);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    // no overflow-hidden on this section - it would break the sticky rail
    <section data-nav="light" className="section-light relative border-t border-ink-border py-24">
      <div className="section-shell relative">
        <div className="max-w-3xl">
          <Eyebrow tone="light" className="mb-6">The Five Systems</Eyebrow>
          <Reveal as="h2" className="heading-xl text-ink">What each system actually does.</Reveal>
          <Reveal as="p" delay={0.05} className="mt-6 max-w-2xl text-base leading-relaxed text-ink-secondary">
            Every system below is the same engine pointed at a different workflow. For each one: what you walk away with, what a single run looks like, and the operational outcome it exists for.
          </Reveal>
        </div>

        {/* Mobile index. The sticky rail below is lg-only, which left phones with
            no way to see - let alone jump between - the five systems. */}
        <nav
          aria-label="Systems"
          ref={chips}
          data-lenis-prevent
          className="sticky top-16 z-30 -mx-5 mt-10 flex gap-2 overflow-x-auto border-y border-ink-border bg-paper/95 px-5 py-3 backdrop-blur-sm [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {SERVICES.map((s, i) => {
            const on = active === s.slug;
            return (
              <a
                key={s.slug}
                data-chip={s.slug}
                href={`#${s.slug}`}
                onClick={(e) => { e.preventDefault(); lenisScrollTo(`#${s.slug}`, -128); }}
                className={cn(
                  'flex shrink-0 items-center gap-2 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors',
                  on ? 'border-crimson bg-crimson/10 text-crimson' : 'border-ink-border text-ink-muted',
                )}
              >
                <span className={cn('text-[9px]', on ? 'text-crimson' : 'text-ink-muted/70')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.short}
              </a>
            );
          })}
        </nav>

        <div className="mt-14 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
          {/* sticky rail */}
          <nav aria-label="Systems" className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-1 border-l border-ink-border">
              {SERVICES.map((s, i) => {
                const on = active === s.slug;
                return (
                  <a
                    key={s.slug}
                    href={`#${s.slug}`}
                    onClick={(e) => { e.preventDefault(); lenisScrollTo(`#${s.slug}`, -96); }}
                    className={cn(
                      'relative flex items-baseline gap-2.5 py-2 pl-5 transition-colors',
                      on ? 'text-ink' : 'text-ink-muted hover:text-ink-secondary',
                    )}
                  >
                    <span className={cn('absolute left-[-1px] top-0 h-full w-0.5 bg-crimson transition-opacity', on ? 'opacity-100' : 'opacity-0')} />
                    <span className={cn('font-mono text-[10px] tracking-[0.16em]', on ? 'text-crimson' : 'text-ink-muted')}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em]">{s.short}</span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* the five systems */}
          <div className="flex flex-col">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <article
                  key={s.slug}
                  id={s.slug}
                  // extra offset on mobile clears the sticky chip index
                  className={cn('scroll-mt-36 py-14 lg:scroll-mt-24', i > 0 && 'border-t border-ink-border')}
                >
                  <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center border border-ink-border-strong text-crimson">
                          <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.18em] text-ink-muted">
                          {String(i + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="heading-lg mt-5 max-w-[22ch] text-ink">{s.name}</h3>
                      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-secondary">{s.desc}</p>

                      <div className="mono-meta mt-8 text-ink-muted">What you get</div>
                      <ul className="mt-3 space-y-2.5">
                        {s.detail.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-3 text-sm leading-relaxed text-ink-secondary">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-crimson" strokeWidth={2.5} />
                            {d}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-8 max-w-xl border-l-2 border-crimson pl-4 text-sm leading-relaxed text-ink">
                        {s.detail.outcome}
                      </p>
                    </div>

                    {/* right: illustration + one run as a terminal trace */}
                    <div className="flex flex-col gap-5">
                      <div className="flex justify-center border border-ink-border bg-paper-2 p-6">
                        <div className="w-full max-w-[260px]">
                          <IsoArt variant={s.slug} />
                        </div>
                      </div>
                      <div data-lenis-prevent className="overflow-x-auto border border-ink-border bg-[#0A0A0A] p-5">
                        <div className="mono-meta mb-3 flex items-center gap-2 text-text-faint">
                          <span className="h-1.5 w-1.5 bg-terminal-green" /> one run
                        </div>
                        {s.detail.flow.map((line) => (
                          <TraceLine key={line} line={line} />
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
