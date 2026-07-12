import type { Metadata } from 'next';
import { PACKAGES_NOTE, ENGAGEMENT } from '@/lib/constants';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import Packages from '@/components/sections/Packages';
import TierManifest from '@/components/sections/TierManifest';
import Faq from '@/components/sections/Faq';

export const metadata: Metadata = {
  title: 'Pricing - Zeptaz',
  description:
    'Starter, Growth, and Scale builds with a full module-by-module manifest, engagement terms, and pricing FAQ. Timelines begin only after Access Lock is complete.',
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Sized builds, priced after proof."
        lead="Pick the scope, not the loose parts. Every package is the same connected engine, just more modules and reach. Final pricing follows the founding diagnostic."
      />

      <Packages />
      <TierManifest />

      {/* how engagements run */}
      <section data-nav="light" className="section-light relative overflow-hidden border-t border-ink-border py-24">
        <div className="section-shell">
          <div className="max-w-3xl">
            <Eyebrow tone="light" className="mb-6">{ENGAGEMENT.eyebrow}</Eyebrow>
            <Reveal as="h2" className="heading-xl text-ink">{ENGAGEMENT.title}</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-2xl text-base leading-relaxed text-ink-secondary">
              {ENGAGEMENT.lead}
            </Reveal>
          </div>
          <Reveal stagger={0.06} className="mt-12 border-t border-ink-border">
            {ENGAGEMENT.terms.map((t) => (
              <div key={t.term} className="grid gap-2 border-b border-ink-border py-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-crimson">{t.term}</div>
                <p className="max-w-2xl text-sm leading-relaxed text-ink-secondary">{t.def}</p>
              </div>
            ))}
          </Reveal>
          <p className="mt-10 max-w-3xl border-l-2 border-crimson pl-5 text-sm leading-relaxed text-ink-secondary">
            {PACKAGES_NOTE}
          </p>
        </div>
      </section>

      <Faq topic="pricing" />
      <CtaBand title="Get a build scope and price." />
    </>
  );
}
