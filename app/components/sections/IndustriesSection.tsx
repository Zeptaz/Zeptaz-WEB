'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Code, ShoppingCart, Building2, Heart, TrendingUp,
  GraduationCap, Scale, UtensilsCrossed, HardHat,
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import { EyebrowTag } from '@/components/ui/SectionHeading';
import { INDUSTRIES } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Code, ShoppingCart, Building2, Heart, TrendingUp,
  GraduationCap, Scale, UtensilsCrossed, HardHat,
};

export default function IndustriesSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const heading = headingRef.current;
    const grid    = gridRef.current;
    if (!heading || !grid || prefersReducedMotion()) return;

    gsap.from(heading, {
      opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: heading, start: 'top 82%', toggleActions: 'play none none none' },
    });

    const cards = Array.from(grid.querySelectorAll('[data-industry-card]'));
    gsap.from(cards, {
      opacity: 0, y: 28, stagger: 0.06, duration: 0.55, ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: grid, start: 'top 78%', toggleActions: 'play none none none' },
    });
  });

  return (
    <SectionWrapper id="industries" className="bg-[#0D0D0D]">
      <div ref={headingRef}>
        <EyebrowTag className="justify-center">Industries</EyebrowTag>
        <SectionHeading
          title="Built for Every Industry"
          subtitle="Purpose-trained agents that understand your sector's workflows, language, and compliance needs."
        />
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {INDUSTRIES.map((industry) => {
          const Icon = iconMap[industry.icon];
          return (
            <div
              key={industry.id}
              data-industry-card
              className="group flex flex-col gap-4 p-6 border border-[#1E1E1E] bg-[#080808] hover:border-[rgba(220,20,60,0.3)] hover:bg-[rgba(220,20,60,0.015)] transition-all duration-200 cursor-default"
            >
              <div className="w-10 h-10 bg-[rgba(220,20,60,0.08)] border border-[rgba(220,20,60,0.15)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(220,20,60,0.14)] transition-colors duration-200">
                {Icon && <Icon className="w-5 h-5 text-[#DC143C]" />}
              </div>
              <div>
                <h3
                  className="text-[16px] font-bold text-white mb-1.5 leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {industry.name}
                </h3>
                <p
                  className="text-[12px] text-[#6B6B6B] leading-[1.6]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {industry.useCase}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
