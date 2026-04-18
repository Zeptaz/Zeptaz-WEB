'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import TerminalBackdrop from '@/components/ui/TerminalBackdrop';
import { STATS } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const backdropRef  = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const h1Ref        = useRef<HTMLHeadingElement>(null);
  const sublineRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const statValueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const scrollToAgents  = () => document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  useGSAP(() => {
    const section  = sectionRef.current;
    const backdrop = backdropRef.current;
    const eyebrow  = eyebrowRef.current;
    const h1       = h1Ref.current;
    const subline  = sublineRef.current;
    const cta      = ctaRef.current;
    const stats    = statsRef.current;
    if (!section || !h1 || !eyebrow || !subline || !cta || !stats) return;

    const reduced = prefersReducedMotion();

    if (reduced) {
      // Snap to final state
      gsap.set([eyebrow, h1, subline, cta, stats], { opacity: 1, y: 0 });
      // Set stat values to final numbers
      STATS.forEach((stat, i) => {
        const el = statValueRefs.current[i];
        if (el) el.textContent = `${stat.value}${stat.suffix}`;
      });
      return;
    }

    // ── 1. Staggered entrance timeline ─────────────────────────────
    gsap.set([eyebrow, h1, subline, cta, stats], { opacity: 0, y: 30 });

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(h1,      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3')
      .to(subline, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to(cta,     { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to(stats,   { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

    // ── 2. Stat count-up on viewport enter ──────────────────────────
    STATS.forEach((stat, i) => {
      const el = statValueRefs.current[i];
      if (!el) return;
      const isDecimal = String(stat.value).includes('.');
      const obj = { val: 0 };
      gsap.to(obj, {
        val: stat.value,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.8 + i * 0.1,
        onUpdate() {
          el.textContent = isDecimal
            ? obj.val.toFixed(1) + stat.suffix
            : Math.round(obj.val) + stat.suffix;
        },
      });
    });

    // ── 3. Backdrop parallax as hero scrolls out ─────────────────────
    if (backdrop) {
      gsap.to(backdrop, {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen min-h-dvh flex flex-col overflow-hidden bg-[#080808]"
      aria-label="Hero section"
    >
      <div ref={backdropRef} className="absolute inset-0">
        <TerminalBackdrop />
      </div>

      {/* Nav spacer */}
      <div className="h-16 flex-shrink-0" />

      {/* Center content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-5 lg:px-8 py-8 lg:py-12 flex flex-col items-center text-center">

          {/* Eyebrow tag */}
          <div ref={eyebrowRef} className="mb-6">
            <span className="eyebrow-tag">
              AI-Powered Digital Workforce
            </span>
          </div>

          {/* Display headline */}
          <h1
            ref={h1Ref}
            className="display-xl text-white max-w-5xl mb-6"
          >
            Your Business Deserves an{' '}
            <span className="text-[#DC143C]">AI Team</span>{' '}
            That Never Sleeps
          </h1>

          {/* Subline */}
          <p
            ref={sublineRef}
            className="text-[16px] sm:text-[18px] text-[#A1A1A1] max-w-[560px] leading-[1.65] mb-8"
          >
            Zeptaz deploys specialized AI agents that automate your workflows,
            qualify leads, predict outcomes, and scale operations — 24/7, without burnout.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <button
              onClick={scrollToAgents}
              className="group flex items-center gap-2 px-7 py-3.5 bg-[#DC143C] text-white text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-[#FF1F4E] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
            </button>
            <button
              onClick={scrollToContact}
              className="text-[13px] text-[#A1A1A1] hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              → Talk to our team
            </button>
          </div>

          {/* Stats strip */}
          <div
            ref={statsRef}
            className="flex items-stretch divide-x divide-[#1E1E1E] border-t border-b border-[#1E1E1E] py-5 w-full max-w-xl"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="text-[26px] font-bold text-white leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span
                    ref={(el) => { statValueRefs.current[i] = el; }}
                  >
                    0{stat.suffix}
                  </span>
                </div>
                <span
                  className="text-[10px] text-[#6B6B6B] font-medium tracking-[0.1em] uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
