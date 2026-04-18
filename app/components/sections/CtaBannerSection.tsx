'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

export default function CtaBannerSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToTransformation = () => document.getElementById('transformation')?.scrollIntoView({ behavior: 'smooth' });

  useGSAP(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const glow    = glowRef.current;
    if (!section || !content) return;

    if (prefersReducedMotion()) {
      gsap.set(content, { opacity: 1, scale: 1 });
      return;
    }

    // Scale-up reveal with scrub
    gsap.fromTo(content,
      { opacity: 0, scale: 0.88 },
      {
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 30%',
          scrub: 0.6,
        },
      }
    );

    // Glow parallax
    if (glow) {
      gsap.to(glow, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0D0D0D] border-y border-[#1E1E1E] overflow-hidden"
    >
      {/* Crimson ambient glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(220,20,60,0.06), transparent 65%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-5 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
        <div ref={contentRef} className="max-w-3xl">
          <span className="eyebrow-tag justify-center mb-8 inline-flex">Start in 30 Days</span>

          <h2
            className="text-[40px] sm:text-[56px] lg:text-[68px] font-black text-white leading-[0.97] tracking-[-0.01em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Stop managing tasks.{' '}
            <span className="text-[#DC143C]">Start scaling outcomes.</span>
          </h2>

          <p className="text-[#A1A1A1] text-[17px] leading-[1.7] max-w-lg mx-auto mb-10">
            Your first AI agent can be live within 30 days. We handle the
            configuration, training, and deployment — you handle the growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={scrollToContact}
              className="group flex items-center gap-2 px-7 py-3.5 bg-[#DC143C] text-white text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-[#FF1F4E] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Book a Discovery Call
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
            </button>
            <button
              onClick={scrollToTransformation}
              className="flex items-center gap-2 px-7 py-3.5 border border-[#2A2A2A] text-[#EFEFEF] text-[13px] font-bold uppercase tracking-[0.06em] hover:border-[#DC143C] hover:text-[#DC143C] transition-all duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              See the Results
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
