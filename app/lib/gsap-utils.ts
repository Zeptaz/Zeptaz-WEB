import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface FadeUpOpts {
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  once?: boolean;
}

export function createScrollFadeUp(
  element: Element | null,
  trigger: Element | string | null,
  opts: FadeUpOpts = {}
) {
  if (!element || !trigger) return null;

  const {
    y = 40,
    duration = 0.7,
    delay = 0,
    ease = 'power2.out',
    start = 'top 85%',
    end = 'bottom 20%',
    scrub = false,
    once = true,
  } = opts;

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
      end,
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

  const {
    y = 40,
    scale = 0.96,
    duration = 0.6,
    stagger = 0.08,
    ease = 'power2.out',
    start = 'top 80%',
  } = opts;

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
    scrollTrigger: {
      trigger: trigger as Element,
      start,
      toggleActions: 'play none none none',
    },
  });
}

interface ParallaxOpts {
  speed?: number;
  start?: string;
  end?: string;
}

export function createParallax(
  element: Element | null,
  trigger: Element | string | null,
  opts: ParallaxOpts = {}
) {
  if (!element || !trigger || prefersReducedMotion()) return null;

  const { speed = 0.4, start = 'top top', end = 'bottom top' } = opts;

  return gsap.to(element, {
    yPercent: -30 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger as Element,
      start,
      end,
      scrub: true,
    },
  });
}

export function splitTextIntoSpans(
  container: Element | null,
  splitBy: 'word' | 'char' = 'word'
): HTMLSpanElement[] {
  if (!container) return [];

  // Collect all text content preserving structure
  const text = container.textContent ?? '';
  const units = splitBy === 'char' ? text.split('') : text.split(' ');
  const spans: HTMLSpanElement[] = [];

  // Preserve any existing child elements (like crimson <span>s)
  // by walking child nodes
  const childNodes = Array.from(container.childNodes);
  container.innerHTML = '';

  childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const content = node.textContent ?? '';
      const tokens = splitBy === 'char' ? content.split('') : content.split(' ');
      tokens.forEach((token, i) => {
        if (!token && splitBy === 'word') return;
        const span = document.createElement('span');
        span.textContent = splitBy === 'word' ? token : token;
        span.style.display = 'inline-block';
        if (splitBy === 'word' && i < tokens.length - 1) span.style.marginRight = '0.25em';
        container.appendChild(span);
        spans.push(span);
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Keep element nodes (colored spans etc.) and split their text
      const el = node as Element;
      const inner = el.textContent ?? '';
      const tokens = splitBy === 'char' ? inner.split('') : inner.split(' ');
      tokens.forEach((token, i) => {
        if (!token && splitBy === 'word') return;
        const span = document.createElement('span');
        span.textContent = token;
        span.style.display = 'inline-block';
        span.style.color = (el as HTMLElement).style.color || 'inherit';
        span.className = el.className;
        if (splitBy === 'word' && i < tokens.length - 1) span.style.marginRight = '0.25em';
        container.appendChild(span);
        spans.push(span);
      });
    }
  });

  return spans;
}
