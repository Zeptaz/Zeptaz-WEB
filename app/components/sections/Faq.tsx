'use client';
import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { FAQS, SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.style.height = open ? 'auto' : '0px'; return; }
    gsap.to(el, { height: open ? 'auto' : 0, duration: 0.4, ease: 'power3.out' });
  }, [open]);

  return (
    <div className="border-b border-ink-border">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 py-5 text-left" aria-expanded={open}>
        <span className="heading-md text-ink">{q}</span>
        <Plus className={cn('h-5 w-5 flex-shrink-0 text-crimson transition-transform duration-300', open && 'rotate-45')} strokeWidth={1.8} />
      </button>
      <div ref={body} className="h-0 overflow-hidden">
        <p className="max-w-2xl pb-6 text-sm leading-relaxed text-ink-secondary">{a}</p>
      </div>
    </div>
  );
}

export default function Faq({ topic }: { topic?: 'general' | 'pricing' }) {
  const items = topic ? FAQS.filter((f) => f.topic === topic) : FAQS;
  return (
    <section id="faq" data-nav="light" className="section-light section-screen relative overflow-hidden border-t border-ink-border">
      <div className="section-shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Eyebrow tone="light" className="mb-6">FAQ</Eyebrow>
            <Reveal as="h2" className="heading-xl text-ink">Common questions.</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-sm text-base leading-relaxed text-ink-secondary">
              Straight answers on scope, data, and how the work runs. Still unsure? A fit call sorts it fast.
            </Reveal>
            <a href="/contact" className="btn btn-ghost-light mt-7">{SITE.ctaPrimary}</a>
          </div>

          <Reveal stagger={0.06} className="border-t border-ink-border">
            {items.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
