'use client';
import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reducedMotion,
    });

    // Wire Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Replace rAF loop with GSAP ticker
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Let ScrollTrigger know the scroll container is the window
    ScrollTrigger.defaults({ scroller: window });

    // Refresh after fonts settle
    ScrollTrigger.refresh();

    // Handle direct hash navigation (e.g. zeptaz.com/#contact)
    // Lenis overrides native browser hash scrolling on Windows, so we re-apply it.
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        lenis.scrollTo(hash, { immediate: false });
      }, 300);
    }

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return <div style={{ position: 'relative' }}>{children}</div>;
}
