'use client';
import { Check } from 'lucide-react';
import { PACKAGES, PACKAGES_NOTE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

export default function Packages() {
  return (
    <section id="packages" data-nav="dark" className="section-dark section-screen relative overflow-hidden border-t border-border">
      <div className="section-shell relative">
        <div className="max-w-3xl">
          <Eyebrow index="07" className="mb-6">Packages</Eyebrow>
          <Reveal as="h2" className="heading-xl text-text-primary">Sized builds, after proof.</Reveal>
          <Reveal as="p" delay={0.05} className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
            Pick the scope, not the loose parts. Every package is the same connected engine - just more modules and reach.
          </Reveal>
        </div>

        <Reveal stagger={0.1} className="mt-[clamp(2.5rem,5vh,4rem)] grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className={cn(
                'flex flex-col p-8 text-text-primary',
                p.featured ? 'bg-bg-elevated' : 'bg-bg-primary'
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-[12px] uppercase tracking-[0.16em] text-text-muted">{p.name}</h3>
                {p.featured && <span className="bg-crimson px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white">Most popular</span>}
              </div>

              <p className="mt-4 text-sm text-text-secondary">{p.tagline}</p>

              <div className="mt-6 flex items-end gap-1">
                <span className="display-stat text-5xl font-bold">{p.price}</span>
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted">{p.priceNote}</div>

              <a
                href="#contact"
                className={cn('btn mt-6 w-full', p.featured ? 'btn-primary' : 'btn-ghost-dark')}
              >
                Get started
              </a>

              <div className="mt-7 mono-meta text-text-muted">{p.timeline}</div>

              <ul className="mt-4 space-y-2.5">
                {p.scope.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px]">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-crimson" strokeWidth={2.5} />
                    <span className="text-text-secondary">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-text-muted">{PACKAGES_NOTE}</p>
      </div>
    </section>
  );
}
