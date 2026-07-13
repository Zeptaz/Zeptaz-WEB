'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { gsap } from '@/lib/gsap';
import LogoMark from '@/components/ui/LogoMark';
import DecryptedText from '@/components/ui/DecryptedText';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  // On home the navbar stays hidden until the visitor scrolls past the hero;
  // on every other page it's visible immediately.
  const [revealed, setRevealed] = useState(false);
  const [tone, setTone] = useState<'dark' | 'light'>('dark');
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  useEffect(() => {
    setOpen(false);
    const baseline = 28;
    const update = () => {
      setRevealed(!isHome || window.scrollY > 4);
      const els = document.querySelectorAll<HTMLElement>('section[data-nav]');
      let current: 'dark' | 'light' = 'dark';
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= baseline && r.bottom > baseline) {
          current = el.dataset.nav === 'light' ? 'light' : 'dark';
          break;
        }
      }
      setTone(current);
      // Scroll-progress hairline - driven through the ref so the scroll
      // handler doesn't re-render the whole header every frame.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isHome, pathname]);

  // Sliding crimson underline. It rests under the active page's link and
  // follows the pointer between links; `animate: false` snaps it into place
  // (mount, resize) so it never glides in from x=0.
  const placeIndicator = useCallback((target: HTMLElement | null, animate: boolean) => {
    const ind = indicatorRef.current;
    if (!ind) return;
    ind.style.transition = animate ? '' : 'none';
    if (!target) {
      ind.style.opacity = '0';
      return;
    }
    ind.style.opacity = '1';
    ind.style.left = `${target.offsetLeft}px`;
    ind.style.width = `${target.offsetWidth}px`;
  }, []);

  const activeLinkEl = useCallback(
    () => navRef.current?.querySelector<HTMLElement>('[data-active="true"]') ?? null,
    [],
  );

  useEffect(() => {
    placeIndicator(activeLinkEl(), false);
    const onResize = () => placeIndicator(activeLinkEl(), false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [pathname, placeIndicator, activeLinkEl]);

  // Full-screen takeover: fade the surface, then rise each link out of its
  // clip mask; meta row and CTA follow. Closing is a quick fade.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    if (open) {
      const items = el.querySelectorAll('[data-menu-item]');
      const meta = el.querySelectorAll('[data-menu-meta]');
      const tl = gsap.timeline();
      tl.to(el, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
        .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.55, stagger: 0.055, ease: 'power3.out' }, 0.08)
        .fromTo(meta, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, 0.35);
    } else {
      gsap.to(el, { autoAlpha: 0, duration: 0.25, ease: 'power2.inOut' });
    }
  }, [open]);

  // Lock the page behind the open takeover, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const light = tone === 'light' && !open;
  const ink = light ? '#0C0C0C' : '#EFEFEF';

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-[transform,opacity] duration-500',
        // `|| open` - on the home page `revealed` is false at the top of the
        // scroll, which used to hide the header out from under an open menu.
        revealed || open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
      )}
    >
      {/* command rail - full-width hairline bar */}
      <div
        className={cn(
          'relative border-b backdrop-blur-md transition-colors duration-500',
          light ? 'border-ink-border bg-paper/75' : 'border-border bg-bg-primary/75',
        )}
      >
        {/* scroll progress - crimson line along the very top edge */}
        <div ref={progressRef} aria-hidden className="absolute left-0 top-0 z-10 h-[2px] w-full origin-left scale-x-0 bg-crimson" />

        <div className="relative mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-5 sm:px-8">
          {/* Left: logo badge + wordmark (hidden only in the tight md-lg band) */}
          <Link href="/" className="group flex items-center gap-2.5 outline-none" aria-label="Zeptaz home" style={{ color: ink }}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-crimson transition-transform duration-300 group-hover:-translate-x-0.5">
              <LogoMark className="h-9 w-9 text-white" />
            </span>
            <span
              className="inline font-display text-[19px] font-extrabold uppercase leading-none tracking-[0.16em] md:hidden lg:inline"
              style={{ color: ink }}
            >
              Zeptaz
            </span>
          </Link>

          {/* Center: numbered links + sliding underline */}
          <nav
            ref={navRef}
            onMouseLeave={() => placeIndicator(activeLinkEl(), true)}
            className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 items-stretch md:flex"
          >
            {NAV_LINKS.map((l, i) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  data-active={active ? 'true' : undefined}
                  onMouseEnter={(e) => placeIndicator(e.currentTarget, true)}
                  className="group flex items-center gap-1.5 px-3.5"
                >
                  <span
                    className={cn(
                      'hidden font-mono text-[9px] tracking-[0.1em] lg:inline',
                      active ? 'text-crimson' : light ? 'text-ink-muted' : 'text-text-faint',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <DecryptedText
                    text={l.label}
                    animateOn="hover"
                    className="font-mono text-[11px] uppercase tracking-[0.14em]"
                    encryptedClassName="font-mono text-[11px] uppercase tracking-[0.14em] text-crimson"
                    parentClassName={cn(
                      'font-mono text-[11px] uppercase tracking-[0.14em] transition-opacity group-hover:opacity-100',
                      active ? 'opacity-100' : 'opacity-80',
                    )}
                    style={{ color: active ? '#DC143C' : ink }}
                  />
                </Link>
              );
            })}
            {/* the underline sits on the bar's bottom rule */}
            <span
              ref={indicatorRef}
              aria-hidden
              className="absolute bottom-0 h-[2px] bg-crimson opacity-0 transition-[left,width,opacity] duration-300"
              style={{ left: 0, width: 0 }}
            />
          </nav>

          {/* Right: status readout + CTA */}
          <div className="hidden items-center gap-5 md:flex">
            <span
              className={cn(
                'hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] xl:flex',
                light ? 'text-ink-muted' : 'text-text-muted',
              )}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping bg-terminal-green opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 bg-terminal-green" />
              </span>
              sys online
            </span>
            <Link href="/contact" className="btn btn-primary !px-4 !py-2.5 text-[10px]">Book a call</Link>
          </div>

          {/* Mobile toggle - -mr-3 keeps the 44px target flush with the shell edge */}
          <button
            className="-mr-3 flex h-11 w-11 items-center justify-center md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            style={{ color: open ? '#EFEFEF' : ink }}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen takeover - always mounted so it can animate closed;
          `inert` keeps its links out of the tab order while shut. -z-10 paints
          it under the bar, which stays interactive on top. NOTE: the header's
          reveal transform makes it the containing block for fixed children, so
          this must be absolute + 100svh, not `fixed inset-0`. */}
      <div
        ref={overlayRef}
        id="mobile-menu"
        inert={!open}
        className="absolute inset-x-0 top-0 -z-10 flex h-[100svh] flex-col overflow-y-auto bg-bg-primary md:hidden"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div aria-hidden className="dot-grid absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 90% 50% at 50% 110%, rgba(220,20,60,0.10), transparent 65%)' }}
        />

        <nav className="relative flex flex-1 flex-col justify-center px-6 pt-20">
          {NAV_LINKS.map((l, i) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn('flex items-baseline gap-4 border-b border-border/70 py-4', i === 0 && 'border-t')}
              >
                <span className={cn('font-mono text-[11px] tracking-[0.1em]', active ? 'text-crimson' : 'text-text-faint')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="overflow-hidden">
                  <span
                    data-menu-item
                    className={cn(
                      'block font-display text-[clamp(1.9rem,8vw,2.6rem)] font-extrabold uppercase leading-none tracking-[-0.01em]',
                      active ? 'text-crimson' : 'text-text-primary',
                    )}
                  >
                    {l.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="relative px-6 pb-8 pt-6">
          <Link data-menu-meta href="/contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">
            Book a call
          </Link>
          <div data-menu-meta className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
            <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-crimson">{SITE.email}</a>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-terminal-green" />
              sys online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
