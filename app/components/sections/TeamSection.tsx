'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import { EyebrowTag } from '@/components/ui/SectionHeading';
import TeamShowcase from '@/components/ui/TeamShowcase';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

export default function TeamSection() {
  const headingRef  = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const heading  = headingRef.current;
    const showcase = showcaseRef.current;
    if (!heading || !showcase || prefersReducedMotion()) return;

    gsap.from(heading,  { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: heading, start: 'top 80%', toggleActions: 'play none none none' } });
    gsap.from(showcase, { opacity: 0, y: 40, duration: 0.7, ease: 'power2.out', delay: 0.15, scrollTrigger: { trigger: showcase, start: 'top 80%', toggleActions: 'play none none none' } });
  });

  return (
    <SectionWrapper id="team" className="bg-[#080808]">
      <div ref={headingRef}>
        <EyebrowTag>Team</EyebrowTag>
        <SectionHeading
          title="The Minds Behind Zeptaz"
          subtitle="A founding team combining technical depth, operational expertise, and business strategy."
          centered={false}
        />
      </div>

      <div ref={showcaseRef}>
        <TeamShowcase />
      </div>
    </SectionWrapper>
  );
}
