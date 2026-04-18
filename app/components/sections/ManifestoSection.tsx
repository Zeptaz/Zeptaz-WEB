'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

const rawWords =
  "We don't just deploy software — we build intelligent workforces rooted in precision, automation, and a relentless commitment to outcomes that move your business forward."
    .split(' ');

const accentWords = new Set([
  'intelligent',
  'workforces',
  'precision,',
  'automation,',
  'commitment',
  'outcomes',
  'forward.',
]);

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!section || words.length === 0) return;

    if (prefersReducedMotion()) {
      // Skip to final state immediately
      gsap.set(words, (i: number) => ({
        color: accentWords.has(rawWords[i]) ? '#DC143C' : '#EFEFEF',
      }));
      gsap.set(eyebrow, { opacity: 1 });
      return;
    }

    // Start all words dimmed
    gsap.set(words, { color: '#2A2A2A' });
    gsap.set(eyebrow, { opacity: 0, y: 20 });

    // Eyebrow fade in (not pinned, plays before pin kicks in)
    gsap.to(eyebrow, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });

    // Pin the section and scrub word colors
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=150%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        pinSpacing: true,
      },
    });

    // Stagger words lighting up through the scrub
    words.forEach((word, i) => {
      const isAccent = accentWords.has(rawWords[i]);
      tl.to(
        word,
        {
          color: isAccent ? '#DC143C' : '#EFEFEF',
          duration: 0.3,
          ease: 'none',
        },
        i * (1 / words.length)
      );
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#080808] border-y border-[#1E1E1E] py-[160px] overflow-hidden"
    >
      {/* Crimson ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(220,20,60,0.05) 0%, transparent 65%)' }}
      />

      <div className="mx-auto max-w-6xl px-5 lg:px-8 relative z-10">
        <span ref={eyebrowRef} className="eyebrow-tag mb-8 inline-flex">
          Our Manifesto
        </span>

        <div className="flex flex-wrap">
          {rawWords.map((word, i) => (
            <span
              key={i}
              ref={(el) => { wordRefs.current[i] = el; }}
              className="inline-block mr-[0.25em] text-[clamp(28px,5vw,72px)] font-extrabold uppercase tracking-[-0.04em] leading-[1.05]"
              style={{ fontFamily: 'var(--font-display)', color: '#2A2A2A' }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
