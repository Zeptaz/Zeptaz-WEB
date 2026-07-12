'use client';
import { TRUST } from '@/lib/constants';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

export default function TrustSecurity() {
  return (
    <section id="trust" data-nav="dark" className="section-dark section-screen relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="section-shell relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start lg:gap-12">
          <div>
            <Eyebrow index="08" className="mb-6">{TRUST.eyebrow}</Eyebrow>
            <Reveal as="h2" className="heading-lg max-w-[14ch] text-text-primary">{TRUST.title}</Reveal>
            <Reveal as="p" delay={0.05} className="mt-5 max-w-md text-sm leading-relaxed text-text-secondary">{TRUST.lead}</Reveal>
          </div>

          <Reveal stagger={0.08} className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {TRUST.items.map((it) => {
              const Icon = it.icon;
              return (
                <div key={it.title} className="bg-bg-primary p-7">
                  <span className="flex h-10 w-10 items-center justify-center border border-border-strong text-crimson">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-text-primary">{it.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-muted">{it.desc}</p>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
