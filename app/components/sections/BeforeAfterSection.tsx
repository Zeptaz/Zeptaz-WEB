'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, Check, ArrowRight } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import { EyebrowTag } from '@/components/ui/SectionHeading';
import { BEFORE_AFTER } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

export default function BeforeAfterSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  useGSAP(() => {
    const heading = headingRef.current;
    const left    = leftRef.current;
    const right   = rightRef.current;
    const cta     = ctaRef.current;
    if (!heading || !left || !right || prefersReducedMotion()) return;

    gsap.from(heading, {
      opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: heading, start: 'top 80%', toggleActions: 'play none none none' },
    });
    gsap.from(left, {
      opacity: 0, x: -40, duration: 0.7, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: left, start: 'top 76%', toggleActions: 'play none none none' },
    });
    gsap.from(right, {
      opacity: 0, x: 40, duration: 0.7, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: right, start: 'top 76%', toggleActions: 'play none none none' },
    });

    const leftRows  = Array.from(left.querySelectorAll('[data-row]'));
    const rightRows = Array.from(right.querySelectorAll('[data-row]'));
    gsap.from([...leftRows, ...rightRows], {
      opacity: 0, y: 14, stagger: 0.06, duration: 0.45, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: left, start: 'top 74%', toggleActions: 'play none none none' },
    });

    if (cta) gsap.from(cta, {
      opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: cta, start: 'top 88%', toggleActions: 'play none none none' },
    });
  });

  return (
    <SectionWrapper id="transformation" className="bg-[#0D0D0D]">
      <div ref={headingRef}>
        <EyebrowTag className="justify-center">Transformation</EyebrowTag>
        <SectionHeading
          title="Before & After Zeptaz"
          subtitle="See how businesses transform when AI agents take over the repetitive work."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Without Zeptaz */}
        <div
          ref={leftRef}
          className="border border-[#1E1E1E] bg-[#080808] p-7 sm:p-9"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-[#3F3F3F]" />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B6B6B]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Without Zeptaz
            </span>
          </div>
          <div className="space-y-4">
            {BEFORE_AFTER.map((item, i) => (
              <div key={i} data-row className="flex items-start gap-3">
                <div className="w-5 h-5 border border-[#2A2A2A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-[#6B6B6B]" />
                </div>
                <p className="text-[14px] text-[#6B6B6B] leading-[1.6]">{item.before}</p>
              </div>
            ))}
          </div>
        </div>

        {/* With Zeptaz */}
        <div
          ref={rightRef}
          className="border border-[rgba(220,20,60,0.3)] bg-[#080808] p-7 sm:p-9 relative overflow-hidden"
        >
          {/* Top crimson accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#DC143C] via-[#FF2D55] to-[#9B1B30]" />
          <div
            className="absolute top-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(220,20,60,0.04) 0%, transparent 100%)' }}
          />

          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="w-2 h-2 bg-[#DC143C] animate-pulse" />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#DC143C]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              With Zeptaz
            </span>
          </div>
          <div className="space-y-4 relative z-10">
            {BEFORE_AFTER.map((item, i) => (
              <div key={i} data-row className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[rgba(220,20,60,0.12)] border border-[rgba(220,20,60,0.3)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#DC143C]" />
                </div>
                <p className="text-[14px] text-[#EFEFEF] leading-[1.6]">{item.after}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div ref={ctaRef} className="flex justify-center mt-10">
        <button
          onClick={scrollToContact}
          className="group flex items-center gap-2 px-8 py-4 bg-[#DC143C] text-white text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-[#FF1F4E] transition-colors duration-200"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Start Your Transformation
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
        </button>
      </div>
    </SectionWrapper>
  );
}
