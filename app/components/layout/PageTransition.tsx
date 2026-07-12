'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import AsciiCurtain, { type AsciiCurtainHandle } from '@/components/ui/AsciiCurtain';

/**
 * ASCII curtain between routes - the signature wall as connective tissue.
 *
 * Intercepts clicks on internal links (document capture phase, so it works
 * for every <Link>/<a> without touching them) and plays one continuous
 * downward pass: a ragged curtain of ASCII characters sweeps down and covers
 * the page (progress 0→1), the route swaps underneath, then the curtain's
 * tail follows and clears from the top, revealing the new page (1→2).
 *
 * Reduced motion: no interception at all - navigation stays instant.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<AsciiCurtainHandle>(null);
  const proxy = useRef({ p: 0 });
  const [active, setActive] = useState(false);
  const pending = useRef(false);
  const failSafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = () => curtain.current?.setProgress(proxy.current.p);

  // Cover (curtain sweeps down) → push.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (pending.current) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (prefersReducedMotion()) return;
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // same page (incl. #hash scrolls) - let Link / lenis handle it
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      pending.current = true;
      proxy.current.p = 0;
      setActive(true);

      gsap.killTweensOf(proxy.current);
      gsap.to(proxy.current, {
        p: 1,
        duration: 0.5,
        ease: 'power2.in',
        onUpdate: apply,
        onComplete: () => {
          // Screen is fully covered. Un-pin everything (reverts GSAP
          // pin-spacers) before React unmounts pinned sections - otherwise
          // the unmount throws removeChild NotFoundError.
          ScrollTrigger.getAll().forEach((s) => s.kill());
          router.push(url.pathname + url.search + url.hash);
          // if the route never resolves, clear the curtain anyway
          failSafe.current = setTimeout(() => reveal(), 3000);
        },
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // New route rendered → the curtain's tail clears downward off the new page.
  useEffect(() => {
    if (!pending.current) return;
    const t = setTimeout(() => {
      // honor a #hash target on the new page (e.g. /#engine) under the cover
      const hash = window.location.hash;
      if (hash && document.querySelector(hash)) {
        (window as unknown as { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis
          ?.scrollTo(hash, { offset: -72, immediate: true });
      }
      reveal();
    }, 140); // let the new page paint + scroll reset
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function reveal() {
    if (!pending.current) return;
    if (failSafe.current) { clearTimeout(failSafe.current); failSafe.current = null; }
    gsap.killTweensOf(proxy.current);
    proxy.current.p = Math.max(proxy.current.p, 1);
    gsap.to(proxy.current, {
      p: 2,
      duration: 0.55,
      ease: 'power2.out',
      onUpdate: apply,
      onComplete: () => {
        pending.current = false;
        setActive(false);
      },
    });
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{ visibility: active ? 'visible' : 'hidden' }}
    >
      {/* mounted only while wiping so its animation loop never runs idle */}
      {active && <AsciiCurtain ref={curtain} className="h-full w-full" />}
    </div>
  );
}
