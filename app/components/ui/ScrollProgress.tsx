'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Crimson scroll-progress bar pinned to the very top of the viewport.
 * Spring-smoothed so it never feels jerky.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX: smoothProgress }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#DC143C]/60 origin-left z-[60] pointer-events-none"
    />
  );
}
