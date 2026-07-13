'use client';
import { useRef, useState, useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * White brand splash: solid black "ZEPTAZ". On exit the view dives INTO the
 * center "T" (scale anchored on the T's stem) and cross-fades to the site.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const dismissed = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const reduce = prefersReducedMotion();

    const finish = () => {
      if (dismissed.current) return;
      dismissed.current = true;
      document.body.style.overflow = '';
      setDone(true);
    };

    // The splash scroll-locks the page while it plays. A ~2.7s hold is a long
    // time to hold a phone still, so the dwell is cut short on touch.
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    const tl = gsap.timeline({ onComplete: finish });
    if (reduce) {
      tl.to(root.current, { opacity: 0, duration: 0.4, delay: 0.6, ease: 'power1.out' });
    } else {
      // hold, then fly the "camera" into the T (stem ≈ 58% / 50% of the wordmark)
      tl.to(mark.current, {
        scale: 32,
        duration: coarse ? 0.85 : 1.1,
        ease: 'power2.in',
        transformOrigin: '58% 50%',
        delay: coarse ? 0.75 : 1.6,
      }, 0)
        .to(root.current, { opacity: 0, duration: 0.45, ease: 'power2.in' }, '-=0.4');
    }

    // safety net - never let the splash hang the site
    const safety = window.setTimeout(finish, 6000);

    return () => {
      tl.kill();
      window.clearTimeout(safety);
      document.body.style.overflow = '';
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white">
      <span className="sr-only" role="status">Loading</span>
      <div ref={mark} className="relative aspect-[1200/230] w-[90vw] max-w-[1200px]">
        <svg viewBox="0 0 1200 230" preserveAspectRatio="xMidYMid meet" className="block h-full w-full">
          <text
            x="600" y="115" textAnchor="middle" dominantBaseline="central"
            textLength="1170" lengthAdjust="spacingAndGlyphs"
            fill="#080808"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif', fontWeight: 900, fontSize: '300px', letterSpacing: '-0.02em' }}
          >
            ZEPTAZ
          </text>
        </svg>
      </div>
    </div>
  );
}
