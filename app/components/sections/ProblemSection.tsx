'use client';
import { useRef } from 'react';
import { Clock, Zap, EyeOff } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PAIN_POINTS } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.FC<{ className?: string }>> = { Clock, Zap, EyeOff };

export default function ProblemSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const desktopRef    = useRef<HTMLDivElement>(null);
  const progressRef   = useRef<HTMLDivElement>(null);
  const mobileRef     = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const desktop  = desktopRef.current;
    const progress = progressRef.current;
    const mobile   = mobileRef.current;
    const heading  = headingRef.current;
    const cards    = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    const reduced = prefersReducedMotion();

    // ── Mobile: simple fade-up ─────────────────────────────────────
    if (mobile && !reduced) {
      const mobileCards = mobileCardRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.from([heading, ...mobileCards].filter(Boolean), {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: mobile,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (!desktop || !progress || cards.length === 0) return;

    if (reduced) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      gsap.set(progress, { scaleY: 1 });
      return;
    }

    // ── Desktop: sticky scroll ─────────────────────────────────────
    // Progress line grows with scroll
    gsap.fromTo(progress,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: desktop,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      }
    );

    // Cards animate in/out as you scroll through each segment
    const total = cards.length;
    cards.forEach((card, i) => {
      const segSize  = 1 / (total + 1);
      const start    = i * segSize;
      const enterEnd = start + segSize * 0.35;
      const exitStart = start + segSize * 0.65;
      const end      = (i + 1) * segSize;
      const isLast   = i === total - 1;

      // Set initial state
      gsap.set(card, { opacity: 0, y: 60, scale: 0.96 });

      // Entrance
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: desktop,
          start: `${start * 100}% top`,
          end: `${enterEnd * 100}% top`,
          scrub: true,
        },
      });

      // Exit (skip for last card)
      if (!isLast) {
        gsap.to(card, {
          opacity: 0,
          y: -40,
          scale: 0.98,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: desktop,
            start: `${exitStart * 100}% top`,
            end: `${end * 100}% top`,
            scrub: true,
          },
        });
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="problem" className="relative bg-[#080808]">

      {/* ── MOBILE: simple stacked cards ── */}
      <div ref={mobileRef} className="lg:hidden max-w-6xl mx-auto px-5 py-20">
        <div ref={headingRef} className="mb-12">
          <span className="eyebrow-tag mb-5 inline-flex">The Problem</span>
          <p
            className="text-[26px] sm:text-[30px] font-bold text-white leading-[1.2] tracking-[-0.03em] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            While you&apos;re managing manual tasks, your competitors are automating everything.
          </p>
        </div>

        <div className="space-y-4">
          {PAIN_POINTS.map((point, i) => {
            const Icon = iconMap[point.icon];
            return (
              <div key={point.id} ref={(el) => { mobileCardRefs.current[i] = el; }}>
                <ProblemCardBody point={point} icon={Icon} index={i} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP: sticky scroll ── */}
      <div
        ref={desktopRef}
        style={{ height: `${(PAIN_POINTS.length + 1) * 100}vh` }}
        className="relative hidden lg:block"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <div className="max-w-6xl mx-auto w-full px-12">
            <div className="flex gap-20 items-center">

              {/* LEFT: sticky heading */}
              <div className="w-[42%] flex-shrink-0">
                <span className="eyebrow-tag mb-6 inline-flex">The Problem</span>
                <p
                  className="text-[32px] lg:text-[40px] font-extrabold italic text-white leading-[1.1] tracking-[-0.04em] uppercase"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  While you&apos;re managing manual tasks, your competitors are automating everything.
                </p>
              </div>

              {/* RIGHT: scroll-driven cards */}
              <div className="flex-1 relative" style={{ height: '480px' }}>
                {/* Progress line */}
                <div className="absolute -left-4 top-0 bottom-0 w-px bg-[#1E1E1E] overflow-hidden">
                  <div
                    ref={progressRef}
                    className="w-full bg-[#DC143C] origin-top"
                    style={{ height: '100%', transform: 'scaleY(0)' }}
                  />
                </div>

                {PAIN_POINTS.map((point, i) => {
                  const Icon = iconMap[point.icon];
                  return (
                    <div
                      key={point.id}
                      ref={(el) => { cardRefs.current[i] = el; }}
                      className="absolute inset-0 flex items-center"
                      style={{ opacity: 0 }}
                    >
                      <div className="w-full">
                        <ProblemCardBody point={point} icon={Icon} index={i} />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemCardBody({
  point,
  icon: Icon,
  index,
}: {
  point: (typeof PAIN_POINTS)[number];
  icon: React.FC<{ className?: string }> | undefined;
  index: number;
}) {
  return (
    <div className="bordered-card group p-8 relative overflow-hidden hover:bg-[#1A1A1A] transition-colors duration-200">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="text-[11px] font-medium text-[#DC143C] tracking-[0.12em] uppercase"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="w-px h-3 bg-[#2A2A2A]" />
        <div className="w-9 h-9 bg-[rgba(220,20,60,0.08)] border border-[rgba(220,20,60,0.15)] flex items-center justify-center flex-shrink-0">
          {Icon && <Icon className="w-4 h-4 text-[#DC143C]" />}
        </div>
        <h3
          className="text-[15px] font-bold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {point.title}
        </h3>
      </div>

      <div className="flex items-start justify-between gap-8">
        <p className="text-[#A1A1A1] text-[14px] leading-[1.75] flex-1">
          {point.description}
        </p>
        <div className="flex-shrink-0 text-right">
          <div
            className="text-[36px] font-bold text-[#DC143C] leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {point.stat}
          </div>
          <div
            className="text-[10px] text-[#6B6B6B] font-medium uppercase tracking-[0.08em] mt-1.5 max-w-[110px]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {point.statLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
