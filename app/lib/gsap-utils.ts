'use client';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

export { prefersReducedMotion };

interface FadeUpOpts {
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
  scrub?: boolean | number;
  once?: boolean;
}

export function createScrollFadeUp(
  element: Element | null,
  trigger: Element | string | null,
  opts: FadeUpOpts = {}
) {
  if (!element || !trigger) return null;
  const { y = 40, duration = 0.8, delay = 0, ease = 'power3.out', start = 'top 85%', scrub = false, once = true } = opts;

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 });
    return null;
  }
  gsap.set(element, { opacity: 0, y });
  return gsap.to(element, {
    opacity: 1,
    y: 0,
    duration: scrub ? 1 : duration,
    delay,
    ease,
    scrollTrigger: {
      trigger: trigger as Element,
      start,
      scrub: scrub || false,
      toggleActions: once ? 'play none none none' : 'play none none reset',
    },
  });
}

interface StaggerOpts {
  y?: number;
  scale?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
}

export function createStaggerReveal(
  elements: Element[] | NodeListOf<Element>,
  trigger: Element | string | null,
  opts: StaggerOpts = {}
) {
  if (!elements || !trigger) return null;
  const els = Array.from(elements);
  if (els.length === 0) return null;
  const { y = 38, scale = 1, duration = 0.7, stagger = 0.08, ease = 'power3.out', start = 'top 82%' } = opts;

  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, y: 0, scale: 1 });
    return null;
  }
  gsap.set(els, { opacity: 0, y, scale });
  return gsap.to(els, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration,
    ease,
    stagger,
    scrollTrigger: { trigger: trigger as Element, start, toggleActions: 'play none none none' },
  });
}

interface ParallaxOpts {
  yPercent?: number;
  start?: string;
  end?: string;
}

export function createParallax(element: Element | null, trigger: Element | string | null, opts: ParallaxOpts = {}) {
  if (!element || !trigger || prefersReducedMotion()) return null;
  const { yPercent = -18, start = 'top bottom', end = 'bottom top' } = opts;
  return gsap.to(element, {
    yPercent,
    ease: 'none',
    scrollTrigger: { trigger: trigger as Element, start, end, scrub: true },
  });
}

/**
 * Draw an SVG <path> (or any stroked element) as the user scrolls through a trigger.
 * Uses stroke-dasharray/offset - no premium DrawSVGPlugin needed.
 */
export function createScrollDraw(
  path: SVGPathElement | SVGGeometryElement | null,
  trigger: Element | string | null,
  opts: { start?: string; end?: string; scrub?: boolean | number } = {}
) {
  if (!path || !trigger) return null;
  const len = path.getTotalLength();
  const { start = 'top 75%', end = 'bottom 60%', scrub = 1 } = opts;

  if (prefersReducedMotion()) {
    gsap.set(path, { strokeDasharray: 'none', strokeDashoffset: 0 });
    return null;
  }
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  return gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: { trigger: trigger as Element, start, end, scrub },
  });
}

/** Split a text node container into word/char spans (preserves colored child spans). */
export function splitText(container: Element | null, by: 'word' | 'char' = 'word'): HTMLSpanElement[] {
  if (!container) return [];
  const spans: HTMLSpanElement[] = [];
  const childNodes = Array.from(container.childNodes);
  container.innerHTML = '';

  const pushTokens = (text: string, color?: string, className?: string) => {
    const tokens = by === 'char' ? text.split('') : text.split(' ');
    tokens.forEach((token, i) => {
      if (!token && by === 'word') return;
      const outer = document.createElement('span');
      outer.style.display = 'inline-block';
      outer.style.overflow = 'hidden';
      outer.style.verticalAlign = 'top';
      const inner = document.createElement('span');
      inner.textContent = token === '' ? ' ' : token;
      inner.style.display = 'inline-block';
      if (color) inner.style.color = color;
      if (className) inner.className = className;
      outer.appendChild(inner);
      container.appendChild(outer);
      if (by === 'word' && i < tokens.length - 1) {
        container.appendChild(document.createTextNode(' '));
      }
      spans.push(inner);
    });
  };

  childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      pushTokens(node.textContent ?? '');
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      pushTokens(el.textContent ?? '', el.style.color || undefined, el.className || undefined);
    }
  });
  return spans;
}

export { gsap, ScrollTrigger };
