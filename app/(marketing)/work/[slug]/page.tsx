import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Layers3, UserRound } from 'lucide-react';
import PortfolioDemo from '@/components/work/PortfolioDemo';
import CtaBand from '@/components/ui/CtaBand';
import { CASE_STUDIES, CASE_STUDY_BY_SLUG, isWorkSlug } from '@/lib/work';

export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isWorkSlug(slug)) return {};
  const study = CASE_STUDY_BY_SLUG[slug];
  return {
    title: `${study.shortTitle} — Zeptaz Work`,
    description: study.description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { title: study.title, description: study.description, url: `/work/${study.slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isWorkSlug(slug)) notFound();
  const study = CASE_STUDY_BY_SLUG[slug];
  const index = CASE_STUDIES.findIndex((item) => item.slug === study.slug);
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];

  return (
    <>
      <article style={{ '--demo-accent': study.accent } as React.CSSProperties}>
        <header data-nav="dark" className="case-hero section-dark grid-lines">
          <div className="section-shell">
            <Link href="/work" className="case-back"><ArrowLeft size={14} /> All work</Link>
            <div className="case-hero-grid">
              <div>
                <span className="eyebrow text-crimson">{study.eyebrow}</span>
                <h1 className="display-hero">{study.title}</h1>
              </div>
              <div className="case-hero-side">
                <span className="mono-meta">Case file {study.number} / 04</span>
                <p>{study.description}</p>
                <a href="#demo" className="btn btn-primary">Run the demonstration</a>
              </div>
            </div>
            <div className="case-workflow" aria-label="Workflow overview">
              {study.workflow.map((item, step) => <div key={item}><span>{String(step + 1).padStart(2, '0')}</span><strong>{item}</strong>{step < study.workflow.length - 1 && <i />}</div>)}
            </div>
          </div>
        </header>

        <section data-nav="light" className="section-light case-context-section">
          <div className="section-shell case-context-grid">
            <div className="case-context-intro"><span className="eyebrow text-crimson">The operational problem</span><h2 className="heading-xl">Built around the work,<br />not the model.</h2></div>
            <div className="case-context-cards">
              <div><span><UserRound size={16} /> For</span><p>{study.audience}</p></div>
              <div><span><Layers3 size={16} /> Problem</span><p>{study.problem}</p></div>
              <div><span><Check size={16} /> System</span><p>{study.solution}</p></div>
            </div>
          </div>
        </section>

        <section id="demo" data-nav="dark" className="section-dark case-demo-section">
          <div className="section-shell">
            <div className="case-section-heading">
              <div><span className="eyebrow text-crimson">Interactive walkthrough</span><h2 className="heading-xl">{study.demoTitle}</h2></div>
              <p>{study.demoDescription} Use the guided mode or inspect each checkpoint manually.</p>
            </div>
            <PortfolioDemo study={study} />
          </div>
        </section>

        <section data-nav="light" className="section-light case-features-section">
          <div className="section-shell">
            <div className="case-section-heading case-section-heading-dark">
              <div><span className="eyebrow text-crimson">Inside the system</span><h2 className="heading-xl">Controls that make the workflow useful.</h2></div>
              <p>{study.value}</p>
            </div>
            <div className="case-feature-grid">
              {study.features.map((feature, featureIndex) => (
                <div key={feature.title}><span>{String(featureIndex + 1).padStart(2, '0')}</span><h3>{feature.title}</h3><p>{feature.description}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section data-nav="dark" className="section-dark case-tech-section grid-lines">
          <div className="section-shell case-tech-grid">
            <div><span className="eyebrow text-crimson">Technology exposure</span><h2 className="heading-lg">A connected stack shaped around the workflow.</h2></div>
            <div className="case-tech-list">
              <div><span className="mono-meta">Core technology</span><div>{study.technology.map((item) => <span key={item}>{item}</span>)}</div></div>
              <div><span className="mono-meta">Integration architecture</span><div>{study.integrations.map((item) => <span key={item}>{item}</span>)}</div></div>
              <aside><strong>Implementation note</strong><p>{study.implementationNote}</p></aside>
            </div>
          </div>
        </section>

        <section data-nav="light" className="section-light next-case-section">
          <div className="section-shell">
            <span className="mono-meta">Next case file</span>
            <Link href={`/work/${next.slug}`}><span>{next.number}</span><strong>{next.title}</strong><ArrowRight size={28} /></Link>
          </div>
        </section>
      </article>
      <CtaBand title={study.cta} lead="Bring us the current workflow, the tools involved, and the point where work gets stuck. We’ll map the smallest reliable system around it." />
    </>
  );
}
