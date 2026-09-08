import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PortfolioDemo from '@/components/work/PortfolioDemo';
import CtaBand from '@/components/ui/CtaBand';
import { CASE_STUDIES, CASE_STUDY_BY_SLUG, isWorkSlug } from '@/lib/work';
export function generateStaticParams() { return CASE_STUDIES.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isWorkSlug(slug)) return {};
  const study = CASE_STUDY_BY_SLUG[slug];
  return { title: `${study.shortTitle} — Zeptaz Work`, description: study.description, alternates: { canonical: `/work/${slug}` }, openGraph: { title:study.title, description:study.description,url:`/work/${slug}` }, twitter: { card: 'summary_large_image', title: study.title, description: study.description } };
}
export default async function CaseStudyPage({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  if (!isWorkSlug(slug)) notFound();
  const study = CASE_STUDY_BY_SLUG[slug];
  const next = CASE_STUDIES[(CASE_STUDIES.findIndex(x=>x.slug===slug)+1)%4];
  return <><article>
    <header className="section-dark case-hero" data-nav="dark"><div className="section-shell"><Link className="case-back" href="/work"><ArrowLeft size={16}/> All work</Link><div className="case-hero-grid"><div><span className="eyebrow text-crimson">{study.shortTitle}</span><h1>{study.title}</h1></div><div className="case-hero-side"><p>{study.description}</p><a className="btn btn-primary" href="#demo">Try the demo <ArrowRight size={16}/></a><span className="mono-meta">Case {study.number} / 04 · fictional scenario</span></div></div></div></header>
    <section className="section-light case-context-section" data-nav="light"><div className="section-shell"><span className="eyebrow text-crimson">Where the work gets stuck</span><div className="case-context-cards"><div><h2>Who it helps</h2><p>{study.audience}</p></div><div><h2>The problem</h2><p>{study.problem}</p></div><div><h2>What Zeptaz built</h2><p>{study.solution}</p></div></div></div></section>
    <section id="demo" className="section-dark case-demo-section" data-nav="dark"><div className="section-shell"><div className="case-section-heading"><div><span className="eyebrow text-crimson">Try it yourself</span><h2 className="heading-lg">{study.question}</h2></div><p>Follow one example in six short steps. Each screen shows what happens next; supporting details are available at the end.</p></div><PortfolioDemo study={study}/></div></section>
    <section className="section-light case-features-section" data-nav="light"><div className="section-shell"><span className="eyebrow text-crimson">Inside the system</span><h2 className="heading-lg">What keeps this workflow on track.</h2><div className="case-feature-grid">{study.features.map((f,i)=><article key={f.title}><span className="mono-meta">{String(i+1).padStart(2,'0')}</span><h3>{f.title}</h3><p>{f.description}</p></article>)}</div></div></section>
    <section className="section-dark case-tech-section" data-nav="dark"><div className="section-shell"><details className="case-tech-details"><summary>Under the hood <span>Underlying project stack and demo scope</span></summary><div className="case-tech-grid"><div><h3>Underlying project stack</h3><div className="case-tech-tags">{study.technology.map(t=><span key={t}>{t}</span>)}</div><h3>Integration architecture</h3><p>These connections belong to the underlying project architecture. Their effects are simulated here.</p><div className="case-tech-tags">{study.integrations.map(t=><span key={t}>{t}</span>)}</div></div><aside><h3>What this demo runs</h3><p>A fixed browser-local walkthrough with prepared data, explicit approvals and read-only supporting details. No production services are connected.</p><p>{study.implementationNote}</p>{study.serviceLinks.map(l=><Link key={l.href} href={l.href}>{l.label} <ArrowRight size={16}/></Link>)}</aside></div></details></div></section>
    <section className="section-light next-case-section" data-nav="light"><div className="section-shell"><span className="mono-meta">Explore another workflow</span><Link href={`/work/${next.slug}`}><h2>{next.shortTitle}</h2><ArrowRight size={28}/></Link></div></section>
  </article><CtaBand title={study.cta} lead="Bring us your current tools and the point where work gets stuck. We’ll map a practical first step." primary={{label:study.cta,href:`/contact?project=${study.slug}`}}/></>;
}
