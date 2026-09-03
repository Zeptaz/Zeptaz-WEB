import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import WorkCard from '@/components/work/WorkCard';
import SystemTrace from '@/components/work/SystemTrace';
import { CASE_STUDIES } from '@/lib/work';

export const metadata: Metadata = {
  title: 'Selected Work — Zeptaz',
  description: 'Explore four interactive Zeptaz systems spanning enquiry operations, governed campaigns, controlled AI workstations, and media intelligence.',
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Working systems. Shown end to end. — Zeptaz',
    description: 'Interactive demonstrations of reliable, operator-controlled workflow automation.',
    url: '/work',
  },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected systems"
        title={<>Working systems.<br /><span className="text-crimson">Shown end to end.</span></>}
        lead="See how Zeptaz turns intake, decisions, approvals, handoffs, and reporting into reliable operator-controlled workflows."
        index="01 — 04"
        aside={
          <div className="work-hero-aside">
            <span><CheckCircle2 size={14} /> Four guided demonstrations</span>
            <span><CheckCircle2 size={14} /> Synthetic, privacy-safe data</span>
            <span><CheckCircle2 size={14} /> Human checkpoints visible</span>
            <a href="#featured"><ArrowDown size={14} /> Explore the systems</a>
          </div>
        }
      />

      <section id="featured" data-nav="light" className="section-light work-index-section">
        <div className="section-shell">
          <div className="work-section-heading">
            <div><span className="eyebrow text-crimson">Featured work</span><h2 className="heading-xl">Four workflows.<br />Four operational problems.</h2></div>
            <p>Each case study starts with a real workflow pattern and ends with an interactive, resettable demonstration. No invented customer results. No autonomous-AI theatre.</p>
          </div>
          <div className="work-featured-grid">
            {CASE_STUDIES.slice(0, 3).map((study) => <WorkCard key={study.slug} study={study} featured />)}
          </div>
          <div className="work-fourth-card"><WorkCard study={CASE_STUDIES[3]} /></div>
        </div>
      </section>

      <section data-nav="dark" className="section-dark work-engine-section grid-lines">
        <div className="section-shell">
          <div className="work-engine-copy">
            <span className="eyebrow text-crimson">The shared operating model</span>
            <h2 className="heading-xl">AI assists inside the workflow.<br />It does not own the workflow.</h2>
            <p>Different systems, one delivery principle: inputs are checked, automated decisions stay observable, sensitive outputs wait for a person, and every action closes with evidence.</p>
          </div>
          <SystemTrace />
        </div>
      </section>

      <section data-nav="light" className="section-light work-service-map">
        <div className="section-shell">
          <span className="eyebrow text-crimson">Connected to Zeptaz services</span>
          <div className="service-map-grid">
            {CASE_STUDIES.map((study) => (
              <Link key={study.slug} href={`/work/${study.slug}`}>
                <span>{study.number}</span>
                <div><h3>{study.shortTitle}</h3><p>{study.services.join(' · ')}</p></div>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Bring us the workflow"
        title="Have a similar operational problem?"
        lead="Show us where work enters, where it gets stuck, and who needs control. We’ll map the smallest reliable system around it."
        primary={{ label: 'Book a Workflow Fit Call', href: '/contact' }}
        secondary={{ label: 'Explore our process', href: '/process' }}
      />
    </>
  );
}
