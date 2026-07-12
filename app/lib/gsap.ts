'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once, client-side.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Shared brand easing curve (matches V1 nivora ease). */
export const EASE = 'power3.out';
export const EASE_BRAND = 'cubic-bezier(0.25,0.46,0.45,0.94)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger };
