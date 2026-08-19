import type { Metadata } from 'next';
import Link from 'next/link';
import { INTEGRATIONS } from '@/lib/constants';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import CoreOffer from '@/components/sections/CoreOffer';
import ServiceDeep from '@/components/sections/ServiceDeep';

export const metadata: Metadata = {
  title: 'Automation Services - Zeptaz',
  description:
    'Workflow automation systems for recruitment, sales, onboarding, marketing operations, reporting, and documents - plus Zeptaz Voice, our multilingual AI phone agents. Deliverables, example runs, and outcomes for each system.',
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

      {/* product band - Zeptaz Voice lives on its own page */}
      <section data-nav="dark" className="section-dark relative overflow-hidden border-t border-border py-20">
        <div className="section-shell relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div>
            <Eyebrow className="mb-6">Product · Zeptaz Voice</Eyebrow>
            <Reveal as="h2" className="heading-xl text-text-primary">The phone line, automated too.</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
              Zeptaz Voice is our multilingual AI phone agent. It answers routine calls in Sinhala,
              Tamil, and English, checks approved systems, and hands anything uncertain to your
              team - with every outcome recorded in one dashboard.
            </Reveal>
            <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
              <Link href="/products/voice-agent" className="btn btn-primary">Explore Zeptaz Voice</Link>
              <Link href="/products/voice-agent#demo" className="btn btn-ghost-dark">Try the voice demo</Link>
            </Reveal>
          </div>

          <Reveal stagger={0.07} className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {['3 languages', 'Ask a question', 'Book an appointment', 'Place an order'].map((c) => (
              <div key={c} className="bg-bg-primary px-5 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                <span className="mr-2 text-crimson">▮</span>{c}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

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
