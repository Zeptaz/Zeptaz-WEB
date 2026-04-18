'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { nivoraFadeUp } from '@/lib/animations';

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 bg-[#040404] border-t border-[#1E1E1E] overflow-hidden">

      {/* Large watermark logo */}
      <div className="relative w-full overflow-hidden border-b border-[#1E1E1E] py-10 flex items-center justify-center">
        <Image
          src="/zeptaz-logo.png"
          alt="Zeptaz"
          width={900}
          height={160}
          className="w-[min(820px,90vw)] opacity-[0.55] invert mix-blend-screen select-none pointer-events-none"
          draggable={false}
          priority={false}
        />
      </div>

      <div className="max-w-6xl mx-auto px-5 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <motion.div
            className="md:col-span-2"
            variants={nivoraFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            custom={0}
          >
            <span
              className="text-[18px] font-bold text-[#EFEFEF] tracking-tight block mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >

            </span>
            <p className="text-[#6B6B6B] text-[13px] leading-[1.75] max-w-xs mb-5">
              Building the AI-powered workforce of the future. Specialized agents for every industry, powered by swarm intelligence.
            </p>
            <a
              href="mailto:zecreteye@gmail.com"
              className="text-[13px] text-[#A1A1A1] hover:text-[#DC143C] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              zecreteye@gmail.com
            </a>
          </motion.div>

          {/* Navigate */}
          <motion.div
            variants={nivoraFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            custom={0.1}
          >
            <h4
              className="text-[11px] font-medium text-[#6B6B6B] mb-5 uppercase tracking-[0.14em]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Navigate
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-[13px] text-[#A1A1A1] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div
            variants={nivoraFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            custom={0.2}
          >
            <h4
              className="text-[11px] font-medium text-[#6B6B6B] mb-5 uppercase tracking-[0.14em]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:zecreteye@gmail.com"
                  className="text-[13px] text-[#A1A1A1] hover:text-[#DC143C] transition-colors duration-200"
                >
                  Email Us
                </a>
              </li>
              <li>
                <a
                  href="tel:+94782647341"
                  className="text-[13px] text-[#A1A1A1] hover:text-[#DC143C] transition-colors duration-200"
                >
                  +94 78 264 7341
                </a>
              </li>
              <li>
                <span className="text-[13px] text-[#6B6B6B]">Colombo, Sri Lanka</span>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Bottom bar */}
        <motion.div
          variants={nivoraFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          custom={0.3}
          className="pt-8 border-t border-[#1E1E1E] flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p
            className="text-[11px] text-[#6B6B6B]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            &copy; 2026 Zeptaz. All rights reserved.
          </p>
          {/* <p
            className="text-[11px] text-[#6B6B6B] flex items-center gap-1.5"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Built in Sri Lanka
            <span className="text-[#DC143C]">&#10084;</span>
          </p> */}
        </motion.div>
      </div>
    </footer>
  );
}
