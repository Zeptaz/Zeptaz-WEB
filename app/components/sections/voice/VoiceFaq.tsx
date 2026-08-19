'use client';
import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { VOICE, VOICE_FAQS } from '@/lib/voice';
import { cn } from '@/lib/utils';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

/* Dark-toned twin of components/sections/Faq.tsx - same accordion behaviour,
   fed from the voice product's own question set. */
function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.style.height = open ? 'auto' : '0px'; return; }
    gsap.to(el, { height: open ? 'auto' : 0, duration: 0.4, ease: 'power3.out' });
  }, [open]);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="heading-md text-text-primary">{q}</span>
        <Plus
          className={cn('h-5 w-5 flex-shrink-0 text-crimson transition-transform duration-300', open && 'rotate-45')}
          strokeWidth={1.8}
        />
      </button>
      <div ref={body} className={cn('overflow-hidden', !defaultOpen && 'h-0')}>
        <p className="max-w-2xl pb-6 text-sm leading-relaxed text-text-secondary">{a}</p>
      </div>
    </div>
  );
}

export default function VoiceFaq() {
  return (
    <section
      id="faq"
      data-nav="dark"
      className="section-dark relative overflow-hidden border-t border-border py-24"
    >
      <div className="section-shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Eyebrow index="04" className="mb-6">Common Questions</Eyebrow>
            <Reveal as="h2" className="heading-xl text-text-primary">What your team needs to know.</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-sm text-base leading-relaxed text-text-secondary">
              Practical answers before connecting Zeptaz Voice to your operation.
            </Reveal>
            <Reveal delay={0.1} className="mt-7">
              <Button href="#apply" variant="ghost-dark" arrow>{VOICE.ctaPrimary}</Button>
            </Reveal>
          </div>

          <Reveal stagger={0.06} className="border-t border-border">
            {VOICE_FAQS.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
