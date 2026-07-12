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

  // animate drawer
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power3.out' });
      const items = el.querySelectorAll('[data-drawer-item]');
      gsap.fromTo(items, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out', delay: 0.08 });
    }
  }, [open]);

  const light = tone === 'light' && !open;
  const ink = light ? '#0C0C0C' : '#EFEFEF';

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-[transform,opacity] duration-500',
        revealed ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 sm:px-8">
        {/* Left: logo badge, wordmark on hover */}
        <Link href="/" className="group flex items-center gap-2.5 outline-none" aria-label="Zeptaz home" style={{ color: ink }}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-crimson transition-transform duration-300 group-hover:-translate-x-0.5">
            <LogoMark className="h-9 w-9 text-white" />
          </span>
          <span
            className="max-w-0 -translate-x-1 overflow-hidden whitespace-nowrap font-display text-[19px] font-extrabold uppercase leading-none tracking-[0.16em] opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:translate-x-0 group-hover:opacity-100"
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

        {/* Mobile toggle */}
        <button
          className="p-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          style={{ color: open ? '#EFEFEF' : ink }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div ref={drawerRef} className={cn('md:hidden overflow-hidden', !open && 'hidden')}>
        <nav className="flex flex-col gap-1 border-t border-border bg-bg-primary px-5 py-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              data-drawer-item
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 py-2.5 text-left font-mono text-[13px] uppercase tracking-[0.1em] text-text-secondary hover:text-white"
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
