'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import LogoMark from '@/components/ui/LogoMark';
import AsciiWall from '@/components/ui/AsciiWall';

const COMPANY = [
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];
const POLICIES = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Data Handling', href: '#' },
];

export default function Footer() {
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { yPercent: 18 }, {
        yPercent: -4, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
    }, el);
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <footer className="section-dark relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-7 text-white" />
              <span className="font-display text-[19px] font-extrabold uppercase tracking-[0.16em] mt-0.5">Zeptaz</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              Reliable AI workflow automation for service businesses. Operator-first, human-approved.
            </p>

            <div className="mt-7">
              <p className="mono-meta text-text-muted">Operator notes - workflow leak lessons, no fluff</p>
              <form className="mt-3 flex max-w-sm items-center border border-border-strong" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="flex-1 bg-transparent px-3.5 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                  aria-label="Email address"
                />
                <button className="flex h-full items-center gap-1.5 bg-crimson px-4 py-3 text-white transition-colors hover:bg-crimson-hover" aria-label="Subscribe">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Nav columns */}
          <FooterCol title="Navigate" links={NAV_LINKS} />
          <FooterCol title="Company" links={COMPANY} />
          <FooterCol title="Policies" links={POLICIES} />
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-meta text-text-muted">© {new Date().getFullYear()} Zeptaz - {SITE.tagline}</p>
          <p className="mono-meta text-text-faint">Built operator-first · Human-approved AI</p>
        </div>
      </div>

      {/* Giant wordmark - ASCII art shows through the letterforms */}
      <div ref={wordmarkRef} aria-hidden className="pointer-events-none relative select-none -mb-[2vw]">
        <AsciiWall className="absolute inset-0 h-full w-full" />
        <svg viewBox="0 0 1200 230" preserveAspectRatio="xMidYMid meet" className="relative block w-full">
          <defs>
            <mask id="zeptaz-knockout">
              {/* white = keep solid footer color · black = punch a hole (reveal ASCII) */}
              <rect width="1200" height="230" fill="#fff" />
              <text
                x="600" y="115" textAnchor="middle" dominantBaseline="central"
                textLength="1170" lengthAdjust="spacingAndGlyphs"
                fill="#000"
                style={{ fontFamily: 'var(--font-display), system-ui, sans-serif', fontWeight: 900, fontSize: '300px', letterSpacing: '-0.02em' }}
              >
                ZEPTAZ
              </text>
            </mask>
          </defs>
          <rect width="1200" height="230" fill="#080808" mask="url(#zeptaz-knockout)" />
        </svg>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="mono-meta mb-4 text-text-muted">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-text-secondary transition-colors hover:text-crimson">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
