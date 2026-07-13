'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
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
  const drawerRef = useRef<HTMLDivElement>(null);

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
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isHome, pathname]);

  // Animate the drawer both ways. (It used to only animate open, then snap shut.)
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power3.out' });
      const items = el.querySelectorAll('[data-drawer-item]');
      gsap.fromTo(items, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out', delay: 0.08 });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.28, ease: 'power3.inOut' });
    }
  }, [open]);

  // Lock the page behind the open drawer, and close on Escape.
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
        // scroll, which used to hide the header out from under an open drawer.
        revealed || open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
      )}
    >
      {/* Backdrop. Also gives the bar itself something opaque to sit on: the
          drawer's white close icon was invisible over a light section. */}
      {open && (
        <div
          className="fixed inset-0 -z-10 bg-bg-primary/95 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className={cn('relative mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8', open && 'bg-bg-primary md:bg-transparent')}>
        {/* Left: logo badge + wordmark (always shown on touch - hover can't reveal it there) */}
        <Link href="/" className="group flex items-center gap-2.5 outline-none" aria-label="Zeptaz home" style={{ color: ink }}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-crimson transition-transform duration-300 group-hover:-translate-x-0.5">
            <LogoMark className="h-9 w-9 text-white" />
          </span>
          <span
            className="max-w-[140px] overflow-hidden whitespace-nowrap font-display text-[19px] font-extrabold uppercase leading-none tracking-[0.16em] opacity-100 transition-all duration-300 md:max-w-0 md:-translate-x-1 md:opacity-0 md:group-hover:max-w-[140px] md:group-hover:translate-x-0 md:group-hover:opacity-100"
            style={{ color: ink }}
          >
            Zeptaz
          </span>
        </Link>

        {/* Center: floating nav pill */}
        <nav
          className={cn(
            'absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 border px-2 py-1.5 backdrop-blur-md md:flex',
            light ? 'border-ink-border-strong bg-paper-2/80' : 'border-border-strong bg-bg-elevated/70',
          )}
        >
          {NAV_LINKS.map((l) => {
            const activeLink = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className="group flex items-center gap-2 px-3.5 py-2">
                <span className={cn('h-2.5 w-2.5 shrink-0 bg-crimson transition-transform duration-200 group-hover:scale-110', activeLink && 'scale-110')} />
                <DecryptedText
                  text={l.label}
                  animateOn="hover"
                  className="font-mono text-[11px] uppercase tracking-[0.14em]"
                  encryptedClassName="font-mono text-[11px] uppercase tracking-[0.14em] text-crimson"
                  parentClassName={cn('font-mono text-[11px] uppercase tracking-[0.14em] transition-opacity group-hover:opacity-100', activeLink ? 'opacity-100' : 'opacity-80')}
                  style={{ color: activeLink ? '#DC143C' : ink }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA */}
        <div className="hidden md:block">
          <Link href="/contact" className="btn btn-primary !px-4 !py-2.5 text-[10px]">Book a call</Link>
        </div>

        {/* Mobile toggle - -mr-3 keeps the 44px target flush with the shell edge */}
        <button
          className="-mr-3 flex h-11 w-11 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          style={{ color: open ? '#EFEFEF' : ink }}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer - always mounted so it can animate closed; `inert` keeps
          its links out of the tab order while shut. */}
      <div ref={drawerRef} id="mobile-drawer" inert={!open} style={{ height: 0 }} className="overflow-hidden md:hidden">
        <nav className="flex flex-col gap-1 border-t border-border bg-bg-primary px-5 py-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              data-drawer-item
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center gap-2.5 py-2.5 text-left font-mono text-[13px] uppercase tracking-[0.1em] text-text-secondary hover:text-white"
            >
              <span className="h-2.5 w-2.5 bg-crimson" />
              {l.label}
            </Link>
          ))}
          <Link data-drawer-item href="/contact" onClick={() => setOpen(false)} className="btn btn-primary mt-3 w-full">
            Book a call
          </Link>
        </nav>
      </div>
    </header>
  );
}
