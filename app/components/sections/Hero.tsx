'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { HERO, SITE } from '@/lib/constants';
import AsciiWall, { type AsciiWallHandle } from '@/components/ui/AsciiWall';
import TerminalBackdrop from '@/components/ui/TerminalBackdrop';
import Button from '@/components/ui/Button';

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const wall = useRef<AsciiWallHandle>(null);
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

      // Hidden on entry - only the code tunnel shows until the visitor acts.
      gsap.set(lines, { yPercent: 115 });
      gsap.set(fades, { opacity: 0, y: 28 });

      // Reveal plays ONCE the first time the visitor scrolls (see onUpdate below)
      // and never reverses - it's a separate paused timeline, not scrub-linked, so
      // scrolling back up keeps the text in place. Only the dive below reverses.
      const revealTl = gsap.timeline({ paused: true });
      revealTl
        .to(lines, { yPercent: 0, duration: 0.5, ease: 'power4.out', stagger: 0.06 }, 0)
        .to(fades, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06 }, 0.1);
      let revealed = false;
      const hint = el.querySelector<HTMLElement>('[data-hint]');

      // Pin + dive - still fully scrubbed/reversible.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=130%',
          scrub: true,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            // first nudge of scroll → play the reveal once; it then stays put
            if (!revealed && self.progress > 0.02) {
              revealed = true;
              revealTl.play();
              if (hint) gsap.to(hint, { opacity: 0, duration: 0.4, overwrite: true });
            }
            // last 40% of the pin = the forward dive into the next section
            const zoom = self.progress < 0.6 ? 0 : (self.progress - 0.6) / 0.4;
            wall.current?.dive(zoom);
          },
        },
      });

      // Dwell (readable) → zoom-pull: content scales up + fades into the dive.
      tl.to(content.current, { scale: 1.6, opacity: 0, y: -40, ease: 'power2.in', duration: 0.4 }, 0.6);
    }, el);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  // Click anywhere on the hero (while at the top, ignoring the CTA) nudges the
  // scroll forward so the text reveals via the same scrub path.
  const handleReveal = (e: React.MouseEvent) => {
    if (prefersReducedMotion()) return;
    if ((e.target as HTMLElement).closest('a, button')) return;
    if (window.scrollY > window.innerHeight * 0.2) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    lenis?.scrollTo(window.innerHeight * 0.62, { duration: 1.1 });
  };

  return (
    <section
      id="top"
      ref={root}
      onClick={handleReveal}
      className="section-dark relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* immersive background */}
      <div className="absolute inset-0">
        {reduced ? <TerminalBackdrop /> : <AsciiWall ref={wall} interactive className="h-full w-full" />}
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

      {/* scroll affordance - the hero is pinned and only reveals on the first
          nudge, so tell the visitor the page moves; fades once they do */}
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
