import type { Metadata } from 'next';
import { INTEGRATIONS } from '@/lib/constants';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import CoreOffer from '@/components/sections/CoreOffer';
import ServiceDeep from '@/components/sections/ServiceDeep';

export const metadata: Metadata = {
  title: 'Automation Services - Zeptaz',
  description:
    'Workflow automation systems for recruitment, sales, onboarding, marketing operations, reporting, and documents. Deliverables, example runs, and outcomes for each system.',
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Automation Services"
        title="Systems for the work you already have."
        lead="We connect the tools your team already uses into one reliable workflow across intake, sales, onboarding, marketing operations, reporting, and documents. AI assists inside a controlled workflow, it does not run loose."
      />

      <CoreOffer />
      <ServiceDeep />

      {/* slim connects-with strip - the full marquee lives on the home page */}
      <section data-nav="dark" className="section-dark relative overflow-hidden border-t border-border py-10">
        <div className="section-shell flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-crimson">Connects with</span>
          <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-muted">
            {INTEGRATIONS.join(' · ')}
            <span className="text-text-faint"> · and anything with a connector or API</span>
          </span>
        </div>
      </section>

      <CtaBand title="See your workflow automated." />
    </>
  );
}
