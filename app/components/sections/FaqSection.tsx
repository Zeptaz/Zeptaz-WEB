'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
import { FAQS } from '@/lib/constants';
import { prefersReducedMotion } from '@/lib/gsap-utils';

gsap.registerPlugin(ScrollTrigger);

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

  useGSAP(() => {
    const left      = leftRef.current;
    const accordion = accordionRef.current;
    if (!left || !accordion || prefersReducedMotion()) return;

    gsap.from(left, { opacity: 0, x: -30, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: left, start: 'top 80%', toggleActions: 'play none none none' } });

    const rows = Array.from(accordion.querySelectorAll('[data-faq-row]'));
    gsap.from(rows, { opacity: 0, y: 20, stagger: 0.07, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: accordion, start: 'top 80%', toggleActions: 'play none none none' } });
  });

  return (
    <section id="faq" className="bg-[#080808] py-[112px]">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* LEFT: sticky label */}
          <div ref={leftRef} className="lg:w-[36%] flex-shrink-0 lg:sticky lg:top-28">
            <div className="h-px bg-[#1E1E1E] mb-6 w-full" />
            <span className="eyebrow-tag mb-5 inline-flex">FAQ</span>
            <h2
              className="text-[32px] lg:text-[44px] font-extrabold italic text-white leading-[1.0] tracking-[-0.04em] uppercase mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Common
              <br />Questions
            </h2>
            <p className="text-[15px] text-[#A1A1A1] leading-[1.7] max-w-[280px]">
              Everything you need to know before deploying your AI team.
            </p>
          </div>

          {/* RIGHT: accordion — keep AnimatePresence for open/close */}
          <div ref={accordionRef} className="flex-1">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                data-faq-row
                className="border-b border-[#1E1E1E] last:border-b-0"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-start justify-between gap-4 py-6 text-left group"
                  aria-expanded={openIndex === i}
                >
                  <span
                    className="text-[15px] sm:text-[16px] font-bold text-white leading-snug group-hover:text-[#DC143C] transition-colors duration-200"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex-shrink-0 mt-0.5 w-6 h-6 border border-[#2A2A2A] text-[#6B6B6B] flex items-center justify-center group-hover:border-[#DC143C] group-hover:text-[#DC143C] transition-colors duration-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-[14px] sm:text-[15px] text-[#A1A1A1] leading-[1.75] max-w-[580px]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
