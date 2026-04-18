'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import TerminalBackdrop from '@/components/ui/TerminalBackdrop';
import { nivoraFadeUp, nivoraEase } from '@/lib/animations';

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#080808] overflow-hidden">
      <TerminalBackdrop />

      <div className="relative z-10 max-w-md w-full mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: nivoraEase }}
          className="border border-[#1E1E1E] bg-[#0D0D0D] p-10 sm:p-12 overflow-hidden relative"
        >
          {/* Crimson top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(220,20,60,0.10) 0%, transparent 70%)' }}
          />

          {/* Eyebrow */}
          <motion.div
            variants={nivoraFadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="flex items-center justify-center gap-2.5 mb-4"
          >
            <div className="w-6 h-px bg-[#DC143C]" />
            <span
              className="text-[10px] tracking-[0.14em] uppercase text-[#DC143C]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Error 404
            </span>
            <div className="w-6 h-px bg-[#DC143C]" />
          </motion.div>

          {/* Large numeral */}
          <motion.div
            variants={nivoraFadeUp}
            initial="hidden"
            animate="visible"
            custom={0.35}
            className="relative z-10 mb-3"
          >
            <span
              className="text-[96px] sm:text-[112px] font-bold text-white leading-none tracking-[-0.06em] select-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              4<span className="text-[#DC143C]">0</span>4
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={nivoraFadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="text-[22px] font-bold text-white mb-2 leading-tight uppercase tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Page Not Found
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={nivoraFadeUp}
            initial="hidden"
            animate="visible"
            custom={0.65}
            className="text-[14px] text-[#A1A1A1] leading-[1.7] mb-7"
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={nivoraFadeUp}
            initial="hidden"
            animate="visible"
            custom={0.8}
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-[#DC143C] text-white text-[12px] font-medium uppercase tracking-[0.08em] hover:bg-[#FF1F4E] transition-colors duration-200 active:scale-[0.98]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
