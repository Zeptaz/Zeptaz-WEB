'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Wrench, FlaskConical, Rocket, LineChart } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import { EyebrowTag } from '@/components/ui/SectionHeading';
import { PHASES } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Search, Wrench, FlaskConical, Rocket, LineChart
};

export default function HowItWorksSection() {
  const headingRef   = useRef<HTMLDivElement>(null);
  const timelineRef  = useRef<HTMLDivElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const heading  = headingRef.current;
    const timeline = timelineRef.current;
    const progress = progressRef.current;
    const cards    = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!heading || !timeline || !progress || cards.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(progress, { scaleY: 1 });
      gsap.set([heading, ...cards], { opacity: 1, x: 0 });
      return;
    }

    // Heading fade-up
    gsap.from(heading, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Progress line grows from 0 → 100% as timeline scrolls
    gsap.fromTo(progress,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 1,
        },
      }
    );

    // Each card slides in from left as the user scrolls down the timeline
    cards.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        x: -40,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      // Watermark step number subtle parallax
      const watermark = card.querySelector('[data-watermark]');
      if (watermark) {
        gsap.to(watermark, {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    });
  });

  return (
    <SectionWrapper id="how-it-works" className="bg-[#080808]">
      <div ref={headingRef}>
        <EyebrowTag className="justify-center">How It Works</EyebrowTag>
        <SectionHeading
          title="From Discovery to Deployment"
          subtitle="A proven 8-week process that transforms your manual workflows into intelligent automation."
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <div ref={timelineRef} className="relative">
          {/* Dashed background connector */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px border-l border-dashed border-[#1E1E1E]" />

          {/* Crimson progress line — grows with scroll */}
          <div
            ref={progressRef}
            className="absolute left-[23px] top-0 w-px bg-[#DC143C] origin-top"
            style={{ height: '100%', transform: 'scaleY(0)', transformOrigin: 'top' }}
          />

          <div className="space-y-3">
            {PHASES.map((phase, i) => {
              const Icon = iconMap[phase.icon];
              return (
                <div
                  key={phase.step}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="relative flex gap-5 border border-[#1E1E1E] bg-[#0D0D0D] p-6 hover:bg-[#141414] hover:border-[#2A2A2A] transition-all duration-200 overflow-hidden"
                >
                  {/* 3px crimson left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#DC143C]" />

                  {/* Icon + step number */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-0.5 relative z-10">
                    <div className="w-[46px] h-[46px] border border-[#1E1E1E] bg-[#141414] flex items-center justify-center">
                      {Icon && <Icon className="w-4 h-4 text-[#DC143C]" />}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className="text-[11px] font-medium text-[#DC143C] tracking-[0.12em] uppercase"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {String(phase.step).padStart(2, '0')}
                      </span>
                      <div className="w-px h-3 bg-[#2A2A2A]" />
                      <h3
                        className="text-[15px] font-bold text-white leading-snug"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {phase.title}
                      </h3>
                      <span
                        className="ml-auto px-2.5 py-0.5 text-[10px] font-medium text-[#DC143C] border border-[rgba(220,20,60,0.25)] uppercase tracking-wide whitespace-nowrap"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        [{phase.timeline}]
                      </span>
                    </div>
                    <p className="text-[#A1A1A1] text-[13px] leading-[1.7]">
                      {phase.description}
                    </p>
                  </div>

                  {/* Watermark step number */}
                  <div
                    data-watermark
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[80px] font-bold leading-none pointer-events-none select-none"
                    style={{ fontFamily: 'var(--font-display)', color: '#1E1E1E' }}
                  >
                    {String(phase.step).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
