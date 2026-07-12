import type { Metadata } from 'next';
import { PROCESS } from '@/lib/constants';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import Process from '@/components/sections/Process';
import AccessLedger from '@/components/sections/AccessLedger';

export const metadata: Metadata = {
  title: 'How It Works - Zeptaz',
  description:
    'The full path from Workflow Fit Call to Managed Plan: what we need from you, what we deliver, and how long each step takes. The delivery clock only starts at Access Lock.',
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        tone="light"
        eyebrow="How It Works"
        title="From fit call to managed plan."
        lead="A deliberate, low-friction path. The delivery clock only starts at Access Lock, once access, test data, routing rules, and owners are confirmed."
      />

      <Process />

      {/* step ledger - the fine print of every step */}
      <section data-nav="light" className="section-light relative overflow-hidden border-t border-ink-border py-24">
        <div className="section-shell">
          <div className="max-w-3xl">
            <Eyebrow tone="light" className="mb-6">The Fine Print</Eyebrow>
            <Reveal as="h2" className="heading-xl text-ink">What each step actually asks of you.</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-2xl text-base leading-relaxed text-ink-secondary">
              No mystery phases. For every step: what we need from your side, what lands on ours, and how long it takes.
            </Reveal>
          </div>

          <div className="mt-12 border-t border-ink-border">
            {PROCESS.map((step) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.no} className="grid gap-6 border-b border-ink-border py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center border border-ink-border-strong text-crimson">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.18em] text-ink-muted">{step.no}</span>
                    </div>
                    <h3 className="heading-md mt-4 text-ink">{step.name}</h3>
                    <div className="mt-3 font-mono text-[10px] leading-5 text-ink-muted/80">
                      {step.logs.join('  ·  ')}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <div className="mono-meta text-crimson">You bring</div>
                      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.expects.fromYou}</p>
                    </div>
                    <div>
                      <div className="mono-meta text-crimson">We deliver</div>
                      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.expects.weDeliver}</p>
                    </div>
                    <div>
                      <div className="mono-meta text-crimson">Duration</div>
                      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.expects.duration}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <AccessLedger />
      <CtaBand title="Start with a fit call." />
    </>
  );
}
