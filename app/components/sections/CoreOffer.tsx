'use client';
import { Check } from 'lucide-react';
import { CORE_OFFER } from '@/lib/constants';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import ParticleSphere from '@/components/illustrations/ParticleSphere';

export default function CoreOffer() {
  return (
    <section id="offer" data-nav="dark" className="section-dark section-screen relative overflow-hidden border-t border-border">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgb(220 20 60 / calc(0.07 * var(--glow-strength))), transparent 60%)' }} />
      <div className="section-shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left copy */}
          <div>
            <Eyebrow className="mb-6">{CORE_OFFER.eyebrow}</Eyebrow>
            <Reveal as="h2" className="heading-xl max-w-[16ch] text-text-primary">{CORE_OFFER.title}</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
              {CORE_OFFER.lead}
            </Reveal>
            <Reveal stagger={0.1} className="mt-8 space-y-3">
              {CORE_OFFER.points.map((p) => (
                <div key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center bg-crimson/15 text-crimson">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-text-secondary">{p}</span>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Right visual */}
          <div className="relative aspect-square w-full">
            <ParticleSphere className="h-full w-full" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">One connected</div>
                <div className="font-display text-2xl font-bold uppercase tracking-tight text-text-primary">system</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
