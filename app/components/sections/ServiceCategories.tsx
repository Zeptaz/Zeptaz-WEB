'use client';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES, type Service } from '@/lib/constants';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import IsoArt from '@/components/illustrations/IsoArt';
import CardSwap, { Card } from '@/components/ui/CardSwap';
import Drift from '@/components/ui/Drift';

/* Shared service content - used inside the 3D swap (desktop) and the stacked
   fallback (mobile) so the illustrations + copy live in one place. */
function ServiceCard({ s, i }: { s: Service; i: number }) {
  const Icon = s.icon;
  return (
    <div className="group/iso flex h-full flex-col">
      <div className="mb-5 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center border border-ink-border text-ink">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] text-ink-muted">0{i + 1}</span>
      </div>

      {/* Iso illustration */}
      <div className="relative -mx-2 mb-4 h-36 [&_.iso-float]:transition-transform [&_.iso-float]:duration-500 group-hover/iso:[&_.iso-float]:-translate-y-1.5 [&_.iso-accent]:transition-opacity [&_.iso-accent]:duration-300 group-hover/iso:[&_.iso-accent]:opacity-100">
        <IsoArt variant={s.slug} />
      </div>

      <h3 className="heading-md text-ink">{s.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{s.desc}</p>

      <ul className="mt-5 space-y-1.5">
        {s.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 font-mono text-[11px] text-ink-muted">
            <span className="text-crimson">›</span>{b}
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="mt-auto inline-flex items-center gap-1 pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:text-crimson"
      >
        Explore <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

/* "Not sure where to start?" CTA - kept alongside the cards. */
function StartCta() {
  return (
    <div className="flex flex-col justify-between bg-ink p-7 text-paper">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-3">Not sure where to start?</p>
        <p className="mt-4 heading-md text-paper">We map your flow first, then recommend a build.</p>
      </div>
      <a href="#contact" className="btn btn-primary mt-6 self-start">Book a Workflow Fit Call</a>
    </div>
  );
}

export default function ServiceCategories() {
  return (
    <section id="services" data-nav="light" className="section-light section-screen relative overflow-hidden">
      <Drift className="dot-grid-light opacity-50" />
      <div className="section-shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - heading, intro, CTA */}
          <div>
            <Eyebrow index="02" tone="light" className="mb-6">Service Categories</Eyebrow>
            <Reveal as="h2" className="heading-xl text-ink">Five workflows under one umbrella.</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-xl text-base leading-relaxed text-ink-secondary">
              We group the business under one connected system - no giant menu of disconnected tools. Each category is a reusable workflow, sized to your stack.
            </Reveal>
            <Reveal delay={0.1} className="mt-9 max-w-md">
              <StartCta />
            </Reveal>
          </div>

          {/* Right - 3D card swap (desktop) */}
          <div className="relative hidden min-h-[720px] overflow-visible lg:block">
            <CardSwap
              width={480}
              height={600}
              cardDistance={52}
              verticalDistance={50}
              delay={3500}
              skewAmount={4}
              pauseOnHover
              easing="elastic"
            >
              {SERVICES.map((s, i) => (
                <Card
                  key={s.slug}
                  customClass="bg-paper border border-ink-border shadow-[0_24px_60px_rgba(12,12,12,0.16)] p-7 overflow-hidden"
                >
                  <ServiceCard s={s} i={i} />
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>

        {/* Mobile / tablet fallback - readable stacked grid + CTA */}
        <Reveal stagger={0.09} className="mt-10 grid gap-px overflow-hidden border border-ink-border bg-ink-border sm:grid-cols-2 lg:hidden">
          {SERVICES.map((s, i) => (
            <div key={s.slug} className="bg-paper p-7">
              <ServiceCard s={s} i={i} />
            </div>
          ))}
          <StartCta />
        </Reveal>
      </div>
    </section>
  );
}
