'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { HERO, SITE } from '@/lib/constants';
import AsciiWall from '@/components/ui/AsciiWall';
import TerminalBackdrop from '@/components/ui/TerminalBackdrop';
import Button from '@/components/ui/Button';

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  // Resolved after mount so SSR and the first client paint agree (no hydration
  // mismatch); reduced-motion users then swap to the static CSS backdrop.
  const [reduced, setReduced] = useState(false);
  useEffect(() => { setReduced(prefersReducedMotion()); }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll<HTMLElement>('[data-line] > span');
      const fades = el.querySelectorAll<HTMLElement>('[data-fade]');

      // Headline plays in on load - never held back waiting for a scroll.
      gsap.set(lines, { yPercent: 115 });
      gsap.set(fades, { opacity: 0, y: 28 });
      gsap.timeline({ delay: 0.15 })
        .to(lines, { yPercent: 0, duration: 0.7, ease: 'power4.out', stagger: 0.08 }, 0)
        .to(fades, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.15);
      const hint = el.querySelector<HTMLElement>('[data-hint]');
      let hintGone = false;

      // Pin + hand-off - still fully scrubbed/reversible.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=130%',
          scrub: true,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            // first nudge of scroll → retire the scroll hint
            if (!hintGone && self.progress > 0.02) {
              hintGone = true;
              if (hint) gsap.to(hint, { opacity: 0, duration: 0.4, overwrite: true });
            }
          },
        },
      });

      // Dwell (readable) → zoom-pull: content scales up + fades out. The ASCII
      // wall behind it now holds steady - no zoom.
      tl.to(content.current, { scale: 1.6, opacity: 0, y: -40, ease: 'power2.in', duration: 0.4 }, 0.6);
    }, el);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="section-dark relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* immersive background */}
      <div className="absolute inset-0">
        {reduced ? <TerminalBackdrop /> : <AsciiWall interactive className="h-full w-full" />}
      </div>
      {/* legibility scrim */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(8,8,8,0.6),transparent_75%)]" />

      <div ref={content} className="relative z-10 mx-auto w-full max-w-[900px] px-5 text-center sm:px-8">
        <div data-fade className="eyebrow text-text-muted mb-7 justify-center">{HERO.eyebrow}</div>

        <h1 className="display-hero mx-auto max-w-[16ch] text-text-primary">
          {HERO.headline.map((line, i) => (
            <span key={i} data-line className="block overflow-hidden">
              <span className={`inline-block ${line === HERO.highlight ? 'text-gradient-crimson' : ''}`}>{line}</span>
            </span>
          ))}
        </h1>

        <p data-fade className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
          {HERO.sub}
        </p>

        <div data-fade className="mt-9 flex justify-center">
          <Button href="#contact" variant="primary" arrow>{SITE.ctaPrimary}</Button>
        </div>
      </div>

      {/* scroll affordance - the hero is pinned, so tell the visitor the page
          moves; fades once they do */}
      {!reduced && (
        <div
          data-hint
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted"
        >
          Scroll
          <span className="animate-bounce text-crimson">▼</span>
        </div>
      )}
    </section>
  );
}
