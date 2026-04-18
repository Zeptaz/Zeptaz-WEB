'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  UserPlus, Headphones, Target, Mail, Share2,
  TrendingUp, Brain, PenTool, Users, DollarSign,
  ArrowRight
} from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { EyebrowTag } from '@/components/ui/SectionHeading';
import SectionHeading from '@/components/ui/SectionHeading';
import { AGENTS } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  UserPlus, Headphones, Target, Mail, Share2,
  TrendingUp, Brain, PenTool, Users, DollarSign,
};

export default function AgentsSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  useGSAP(() => {
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!heading || !grid) return;

    if (prefersReducedMotion()) {
      gsap.set([heading, ...Array.from(grid.querySelectorAll('[data-agent-card]'))], { opacity: 1, y: 0, scale: 1 });
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

    // Staggered grid cards
    const cards = Array.from(grid.querySelectorAll('[data-agent-card]'));
    gsap.from(cards, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      stagger: 0.055,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
  });

  return (
    <SectionWrapper id="agents" className="bg-[#0D0D0D]">
      <div ref={headingRef}>
        <EyebrowTag className="justify-center">AI Agents</EyebrowTag>
        <SectionHeading
          title="Meet Your AI Workforce"
          subtitle="10 specialized agents, each purpose-built for a critical business function."
        />
      </div>

      {/* 2×5 bordered grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-5 border border-[#1E1E1E]"
      >
        {AGENTS.map((agent, i) => {
          const Icon = iconMap[agent.icon];
          const col = i % 5;
          const row = Math.floor(i / 5);
          const isLastCol = col === 4;
          const isLastRow = row === 1;
          return (
            <div
              key={agent.id}
              data-agent-card
              className={`group flex flex-col gap-3 p-5 bg-[#0D0D0D] hover:bg-[#141414] transition-colors duration-200 ${!isLastCol ? 'border-r border-[#1E1E1E]' : ''} ${!isLastRow ? 'border-b border-[#1E1E1E]' : ''}`}
            >
              <div className="w-8 h-8 bg-[rgba(220,20,60,0.08)] border border-[rgba(220,20,60,0.15)] flex items-center justify-center flex-shrink-0">
                {Icon && <Icon className="w-4 h-4 text-[#DC143C]" />}
              </div>

              <h3
                className="text-[13px] font-bold text-white leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {agent.name}
              </h3>

              <p className="text-[12px] text-[#6B6B6B] leading-[1.6] flex-1">
                {agent.description}
              </p>

              <button
                onClick={scrollToContact}
                className="flex items-center gap-1 text-[10px] text-[#DC143C] uppercase tracking-[0.1em] hover:gap-2 transition-all duration-150 mt-auto"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Explore <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
