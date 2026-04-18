'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Crosshair, Database, TrendingUp, Layers,
  GitBranch, LayoutDashboard, type LucideIcon
} from 'lucide-react';
import { ADVANTAGES } from '@/lib/constants';
import { EyebrowTag } from '@/components/ui/SectionHeading';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  Crosshair, Database, TrendingUp, Layers, GitBranch, LayoutDashboard
};

/* ─────────────────────────────────────────
   SVG Illustrations — white line-art style
───────────────────────────────────────── */

function SpecializedIllustration() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[60,100,140,180,220,260,300,340].map(x =>
        [60,100,140,180,220,240].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="white" fillOpacity="0.08" />
        ))
      )}
      <circle cx="200" cy="150" r="110" stroke="white" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="200" cy="150" r="80" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="200" cy="150" r="50" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
      <circle cx="200" cy="150" r="22" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" />
      <circle cx="200" cy="150" r="5" fill="white" fillOpacity="0.7" />
      <line x1="200" y1="40" x2="200" y2="100" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="200" y1="200" x2="200" y2="260" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="90" y1="150" x2="150" y2="150" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
      <line x1="250" y1="150" x2="310" y2="150" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
      {[
        { cx: 200, cy: 42, label: 'SaaS' },
        { cx: 315, cy: 82, label: 'Health' },
        { cx: 315, cy: 218, label: 'Legal' },
        { cx: 200, cy: 258, label: 'Finance' },
        { cx: 85, cy: 218, label: 'Retail' },
        { cx: 85, cy: 82, label: 'Education' },
      ].map(({ cx, cy, label }) => (
        <g key={label}>
          <line x1="200" y1="150" x2={cx} y2={cy} stroke="white" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx={cx} cy={cy} r="14" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="7" fill="white" fillOpacity="0.55" fontFamily="monospace">{label}</text>
        </g>
      ))}
    </svg>
  );
}

function MemoryIllustration() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[80,140,200,260,320].map(x =>
        [70,130,190,250].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="white" fillOpacity="0.07" />
        ))
      )}
      {[60, 120, 180].map((y, i) => (
        <g key={i}>
          <ellipse cx="200" cy={y} rx="60" ry="14" stroke="white" strokeOpacity={0.55 - i * 0.1} strokeWidth="1.2" />
          <line x1="140" y1={y} x2="140" y2={y + 40} stroke="white" strokeOpacity={0.5 - i * 0.1} strokeWidth="1.2" />
          <line x1="260" y1={y} x2="260" y2={y + 40} stroke="white" strokeOpacity={0.5 - i * 0.1} strokeWidth="1.2" />
          <ellipse cx="200" cy={y + 40} rx="60" ry="14" stroke="white" strokeOpacity={0.45 - i * 0.1} strokeWidth="1.2" />
          <line x1="150" y1={y + 18} x2="250" y2={y + 18} stroke="white" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 3" />
          <line x1="150" y1={y + 27} x2="250" y2={y + 27} stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 3" />
        </g>
      ))}
      <path d="M 268 80 C 320 80, 340 150, 340 150 C 340 220, 320 220, 268 220" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="5 4" />
      <polygon points="268,215 260,224 276,224" fill="white" fillOpacity="0.4" />
      <path d="M 132 80 C 80 80, 60 150, 60 150 C 60 220, 80 220, 132 220" stroke="white" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="5 4" />
      <circle cx="200" cy="270" r="8" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" />
      <line x1="200" y1="262" x2="200" y2="234" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <text x="200" y="290" textAnchor="middle" fontSize="8" fill="white" fillOpacity="0.4" fontFamily="monospace">PERSISTENT MEMORY</text>
    </svg>
  );
}

function PredictiveIllustration() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="60" y1="240" x2="360" y2="240" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" />
      <line x1="60" y1="240" x2="60" y2="50" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" />
      {[50,90,130,170,210].map(y => (
        <g key={y}>
          <line x1="55" y1={y} x2="60" y2={y} stroke="white" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="60" y1={y} x2="360" y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="3 4" />
        </g>
      ))}
      <polyline points="60,200 100,185 140,170 170,155 200,140 230,120" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" />
      {[[60,200],[100,185],[140,170],[170,155],[200,140],[230,120]].map(([x,y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#080808" stroke="white" strokeOpacity="0.8" strokeWidth="1.2" />
      ))}
      <polyline points="230,120 265,98 300,80 340,60" stroke="#DC143C" strokeOpacity="0.75" strokeWidth="1.5" strokeDasharray="6 4" />
      <path d="M230,120 L265,88 L300,68 L340,48 L340,72 L300,92 L265,108 Z" fill="#DC143C" fillOpacity="0.08" />
      {[[265,98],[300,80],[340,60]].map(([x,y]) => (
        <circle key={`p-${x}-${y}`} cx={x} cy={y} r="3.5" fill="#080808" stroke="#DC143C" strokeOpacity="0.7" strokeWidth="1.2" />
      ))}
      <line x1="230" y1="50" x2="230" y2="240" stroke="white" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 3" />
      <text x="130" y="258" textAnchor="middle" fontSize="7" fill="white" fillOpacity="0.35" fontFamily="monospace">HISTORICAL</text>
      <text x="295" y="258" textAnchor="middle" fontSize="7" fill="#DC143C" fillOpacity="0.6" fontFamily="monospace">PREDICTED</text>
      <polygon points="340,56 333,64 347,64" fill="#DC143C" fillOpacity="0.6" />
    </svg>
  );
}

function FullStackIllustration() {
  const steps = [
    { y: 52, label: 'INGEST', sub: 'data · scrape · listen' },
    { y: 112, label: 'PROCESS', sub: 'reason · classify · plan' },
    { y: 172, label: 'EXECUTE', sub: 'call · write · send' },
    { y: 232, label: 'DELIVER', sub: 'crm · email · report' },
  ];
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[80,160,240,320].map(x =>
        [60,120,180,240].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="white" fillOpacity="0.07" />
        ))
      )}
      {steps.map(({ y, label, sub }, i) => (
        <g key={label}>
          <rect x="110" y={y} width="180" height="44" rx="2" stroke="white" strokeOpacity={0.5 - i * 0.06} strokeWidth="1.2" />
          <rect x="110" y={y} width="4" height="44" fill="#DC143C" fillOpacity={0.7 - i * 0.1} />
          <text x="124" y={y + 17} fontSize="8" fill="white" fillOpacity="0.4" fontFamily="monospace">0{i + 1}</text>
          <text x="138" y={y + 17} fontSize="10" fill="white" fillOpacity={0.85 - i * 0.08} fontFamily="monospace" fontWeight="600">{label}</text>
          <text x="138" y={y + 33} fontSize="7.5" fill="white" fillOpacity="0.35" fontFamily="monospace">{sub}</text>
          {i < steps.length - 1 && (
            <>
              <line x1="200" y1={y + 44} x2="200" y2={y + 56} stroke="white" strokeOpacity="0.3" strokeWidth="1" />
              <polygon points={`196,${y + 54} 200,${y + 60} 204,${y + 54}`} fill="white" fillOpacity="0.3" />
            </>
          )}
          <line x1="295" y1={y + 10} x2="330" y2={y + 10} stroke="white" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="295" y1={y + 22} x2="345" y2={y + 22} stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="295" y1={y + 34} x2="325" y2={y + 34} stroke="white" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="3 3" />
        </g>
      ))}
    </svg>
  );
}

function OrchestrationIllustration() {
  const outerNodes = [
    { cx: 200, cy: 60, label: 'LLM' },
    { cx: 315, cy: 108, label: 'Search' },
    { cx: 315, cy: 192, label: 'CRM' },
    { cx: 200, cy: 240, label: 'Email' },
    { cx: 85, cy: 192, label: 'Slack' },
    { cx: 85, cy: 108, label: 'API' },
  ];
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[60,120,200,280,340].map(x =>
        [60,110,150,190,240].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="white" fillOpacity="0.07" />
        ))
      )}
      {outerNodes.map(({ cx, cy, label }) => (
        <line key={label} x1="200" y1="150" x2={cx} y2={cy} stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      <circle cx="200" cy="150" r="32" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="200" cy="150" r="22" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      <text x="200" y="146" textAnchor="middle" fontSize="8" fill="white" fillOpacity="0.6" fontFamily="monospace">ZEPTAZ</text>
      <text x="200" y="158" textAnchor="middle" fontSize="7" fill="#DC143C" fillOpacity="0.8" fontFamily="monospace">ROUTER</text>
      {outerNodes.map(({ cx, cy, label }) => (
        <g key={label}>
          <circle cx={cx} cy={cy} r="20" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" />
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="7.5" fill="white" fillOpacity="0.6" fontFamily="monospace">{label}</text>
        </g>
      ))}
      <circle cx="258" cy="108" r="4" fill="#DC143C" fillOpacity="0.7" />
      <circle cx="258" cy="108" r="8" stroke="#DC143C" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  );
}

function DashboardIllustration() {
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="40" y="30" width="320" height="240" rx="4" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" />
      <rect x="40" y="30" width="320" height="28" rx="4" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="58" cy="44" r="4" stroke="white" strokeOpacity="0.45" strokeWidth="1" />
      <circle cx="72" cy="44" r="4" stroke="white" strokeOpacity="0.45" strokeWidth="1" />
      <circle cx="86" cy="44" r="4" stroke="white" strokeOpacity="0.45" strokeWidth="1" />
      <rect x="110" y="38" width="170" height="12" rx="2" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      <rect x="40" y="58" width="72" height="212" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
      {[80,100,120,140,160,180,200].map(y => (
        <g key={y}>
          <rect x="52" y={y} width="12" height="8" rx="1" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
          <rect x="68" y={y + 1} width="32" height="6" rx="1" fill="white" fillOpacity="0.07" />
        </g>
      ))}
      <rect x="40" y="77" width="72" height="14" fill="#DC143C" fillOpacity="0.12" />
      <rect x="40" y="77" width="3" height="14" fill="#DC143C" fillOpacity="0.7" />
      {[118, 210, 302].map((x) => (
        <g key={x}>
          <rect x={x} y="68" width="80" height="44" rx="2" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
          <rect x={x + 8} y="76" width="40" height="6" rx="1" fill="white" fillOpacity="0.1" />
          <rect x={x + 8} y="88" width="28" height="10" rx="1" fill="white" fillOpacity="0.2" />
          <line x1={x + 8} y1="103" x2={x + 72} y2="103" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
        </g>
      ))}
      <rect x="118" y="125" width="170" height="110" rx="2" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      {[0,1,2,3,4,5,6].map(i => {
        const heights = [55, 35, 65, 45, 70, 40, 60];
        const h = heights[i];
        const x = 130 + i * 22;
        return (
          <g key={i}>
            <rect x={x} y={232 - h} width="14" height={h} rx="1" fill="white" fillOpacity={i === 4 ? 0.45 : 0.15} stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
          </g>
        );
      })}
      <rect x="302" y="125" width="80" height="110" rx="2" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      <polyline points="314,200 326,185 338,190 350,170 362,155 374,145" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" />
      <polyline points="314,200 326,185 338,190 350,170 362,155 374,145 374,235 314,235" fill="white" fillOpacity="0.05" />
    </svg>
  );
}

const ILLUSTRATIONS: Record<string, React.FC> = {
  specialized:   SpecializedIllustration,
  memory:        MemoryIllustration,
  predictive:    PredictiveIllustration,
  fullstack:     FullStackIllustration,
  orchestration: OrchestrationIllustration,
  nocode:        DashboardIllustration,
};

export default function AdvantagesSection() {
  const outerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    const heading = headingRef.current;
    if (!outer || !track || !heading) return;

    // Mobile: just fade in heading, no horizontal scroll
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    if (!prefersReducedMotion()) {
      if (isDesktop) {
        // ── Desktop: horizontal scroll ─────────────────────────────────
        const totalWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        const scrollDistance = totalWidth - viewportWidth + 80;

        gsap.to(track, {
          x: () => -scrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: outer,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.from(heading, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: outer,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        });
      } else {
        // ── Mobile: stacked with simple fade ─────────────────────────
        gsap.from(heading, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: outer,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        const cards = track.querySelectorAll('[data-card]');
        gsap.from(Array.from(cards), {
          opacity: 0,
          y: 50,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: track,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }
    }
  }, { scope: outerRef });

  return (
    <section ref={outerRef} id="advantages" className="relative bg-[#080808] overflow-hidden">
      {/* Section heading — sits above the horizontal track */}
      <div ref={headingRef} className="max-w-6xl mx-auto px-5 lg:px-8 pt-24 pb-10">
        <EyebrowTag>Why Us</EyebrowTag>
        <h2
          className="font-extrabold italic leading-[1.0] tracking-[-0.04em] uppercase text-white text-[32px] sm:text-[42px] lg:text-[54px] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Why Zeptaz
        </h2>
        <p className="text-[16px] sm:text-[17px] leading-[1.7] text-[#A1A1A1] max-w-2xl">
          What makes our AI workforce fundamentally different from any automation tool you've tried.
        </p>
        {/* Scroll hint — desktop only */}
        <p className="hidden md:flex items-center gap-2 mt-5 text-[10px] text-[#3F3F3F] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)' }}>
          <span>Scroll to explore</span>
          <span>→</span>
        </p>
      </div>

      {/* Horizontal scrolling track */}
      <div
        ref={trackRef}
        className="flex md:flex-nowrap flex-wrap gap-0 md:gap-0 border-t border-[#1E1E1E] pb-20 md:pb-0"
      >
        {ADVANTAGES.map((adv, i) => {
          const Icon = iconMap[adv.icon] ?? TrendingUp;
          const Illustration = ILLUSTRATIONS[adv.id];

          return (
            <div
              key={adv.id}
              data-card
              className="group flex flex-col w-full md:w-[420px] md:flex-shrink-0 p-7 bg-[#080808] hover:bg-[#0D0D0D] transition-colors duration-200 relative overflow-hidden border-b border-r border-[#1E1E1E]"
            >
              {/* Counter */}
              <span
                className="text-[10px] font-medium text-[#DC143C] tracking-[0.12em] uppercase mb-4"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {String(i + 1).padStart(2, '0')}/{String(ADVANTAGES.length).padStart(2, '0')}
              </span>

              {/* Icon tile */}
              <div className="w-12 h-12 bg-[rgba(220,20,60,0.08)] border border-[rgba(220,20,60,0.2)] flex items-center justify-center mb-5 flex-shrink-0">
                <Icon className="w-5 h-5 text-[#DC143C]" />
              </div>

              {/* Title */}
              <h3
                className="text-[18px] font-bold text-white mb-3 leading-tight uppercase tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {adv.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] text-[#A1A1A1] leading-[1.7] mb-6 flex-1 max-w-[340px]">
                {adv.description}
              </p>

              {/* SVG illustration */}
              {Illustration && (
                <div className="h-[160px] opacity-60 group-hover:opacity-80 transition-opacity duration-300 mt-auto">
                  <Illustration />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
