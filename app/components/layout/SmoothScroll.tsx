'use client';
import { useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // On client-side route change: jump to the top and recalculate triggers once
  // the new page's DOM has mounted.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      // Blog code blocks scroll horizontally but are rendered from sanitized
      // HTML, so they can't carry a `data-lenis-prevent` attribute of their own.
      prevent: (node) => node.nodeName === 'PRE',
    });

    // expose for in-app anchor scrolling
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.defaults({ scroller: window });

    // Refresh once fonts/layout settle.
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 350);
    window.addEventListener('load', refresh);

    // ── Gentle section snapping ──────────────────────────────────────────
    // Settle on each section as the user scrolls near it. Created after the
    // first ScrollTrigger.refresh so pinned sections' spacers already exist.
    // Pinned/scrubbed sections (#top hero, #problem, #engine) are intentionally
    // NOT snap targets - they own scroll-driven timelines (the hero reveal +
    // zoom-pull, the problem keyword narrative, the engine draw). Snapping to the
    // following section still cleanly "snaps out" of the pin.
    // Snapping is also skipped on touch: combined with 100svh sections it makes
    // a phone's momentum scroll feel like it's being grabbed away.
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    let snap: Snap | undefined;
    const snapTimer = setTimeout(() => {
      if (reducedMotion || coarse) return;
      snap = new Snap(lenis, {
        type: 'proximity',
        // Soft, low-intensity settle (lerp << 1 = smooth, gentle glide).
        lerp: 0.06,
        // Only assist when you're already close to a section top. A small
        // threshold means once you've scrolled past a section even a little,
        // it won't yank you back to it - it just lets you keep going.
        distanceThreshold: '10%',
      });
      document
        .querySelectorAll<HTMLElement>('main > section:not(#top):not(#problem):not(#engine)')
        .forEach((el) => snap!.addElement(el, { align: ['start'] }));
    }, 450);

    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => lenis.scrollTo(hash, { immediate: false, offset: -72 }), 400);
    }

    return () => {
      clearTimeout(t);
      clearTimeout(snapTimer);
      snap?.destroy();
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((s) => s.kill());
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}

/** Smoothly scroll to a hash/element via the shared Lenis instance (fallback to native). */
export function lenisScrollTo(target: string | HTMLElement, offset = -72) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(target, { offset });
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  else target.scrollIntoView({ behavior: 'smooth' });
}
