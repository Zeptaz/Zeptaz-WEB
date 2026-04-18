'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { NAV_LINKS } from '@/lib/constants';
import { useScrollSection } from '@/hooks/useScrollSection';
import { cn } from '@/lib/utils';
import { centerStagger, nivoraStaggerItem } from '@/lib/animations';

const sectionIds = NAV_LINKS.map(l => l.href.slice(1));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSection(sectionIds);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 bg-[#080808] border-b',
          scrolled ? 'border-[#1E1E1E]' : 'border-transparent'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto h-full px-5 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
            aria-label="Zeptaz home"
          >
            <Image
              src="/zeptaz-icon.svg"
              alt="Zeptaz icon"
              width={36}
              height={36}
              className="invert"
            />
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    'px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-150 relative',
                    'hover:text-white',
                    isActive ? 'text-[#DC143C]' : 'text-[#A1A1A1]'
                  )}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3.5 right-3.5 h-[1px] bg-[#DC143C]"
                      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop right: CONTACT US */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollTo('#contact')}
              className="px-4 py-[7px] bg-[#DC143C] text-white hover:bg-[#FF1F4E] transition-colors duration-200 text-[11px] uppercase tracking-[0.1em]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Contact Us
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[#A1A1A1] p-1.5 hover:text-white transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence mode="popLayout">
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.17, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#080808] border-b border-[#1E1E1E]"
          >
            <motion.nav
              className="max-w-6xl mx-auto px-5 py-5 flex flex-col gap-0.5"
              variants={centerStagger}
              initial="hidden"
              animate="visible"
            >
              {NAV_LINKS.map(link => (
                <motion.button
                  key={link.href}
                  variants={nivoraStaggerItem}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    'text-left py-2.5 px-3 text-[13px] uppercase tracking-[0.08em] font-medium transition-colors duration-150',
                    activeSection === link.href.slice(1)
                      ? 'text-[#DC143C]'
                      : 'text-[#A1A1A1] hover:text-white'
                  )}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div variants={nivoraStaggerItem} className="mt-3 pt-3 border-t border-[#1E1E1E] space-y-2">
                <button
                  onClick={() => scrollTo('#contact')}
                  className="w-full py-3 bg-[#DC143C] text-white text-[13px] font-bold uppercase tracking-[0.05em] hover:bg-[#FF1F4E] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Contact Us
                </button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
