import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import CtaBand from '@/components/ui/CtaBand';
import WorkCard from '@/components/work/WorkCard';
import SystemTrace from '@/components/work/SystemTrace';
import { CASE_STUDIES } from '@/lib/work';
export const metadata: Metadata = {
  title: 'Selected Work — Zeptaz',
  description: 'Explore four interactive systems for enquiries, campaign review, supervised AI work and evidence-based reporting.',
  alternates: { canonical: '/work' },
  openGraph: { title: 'See our work in action — Zeptaz', description: 'Four interactive workflow demonstrations with fictional data.', url: '/work' },
};
export default function WorkPage() {
  return <>
    <section className="section-dark work-hero" data-nav="dark"><div className="section-shell"><span className="eyebrow text-crimson">Selected work / 01 — 04</span><div className="work-hero-grid"><h1>See our work<br /><span>in action.</span></h1><div><p>Explore four systems for handling enquiries, reviewing campaigns, supervising AI work, and turning sources into useful reports.</p><div className="work-hero-actions"><a className="btn btn-primary" href="#featured">Explore the case studies <ArrowDown size={16}/></a><Link href="/contact">Book a workflow fit call <ArrowRight size={16}/></Link></div><small>Four practical examples · Guided demos inside · No sign-up</small></div></div></div></section>
    <section id="featured" className="section-light work-index-section" data-nav="light"><div className="section-shell"><div className="work-section-heading"><div><span className="eyebrow text-crimson">Four practical systems</span><h2 className="heading-xl">Choose a case study<br />to explore.</h2></div><p>Understand the problem and solution first, then follow the guided demo inside each case study.</p></div><div className="work-featured-grid">{CASE_STUDIES.map(study => <WorkCard key={study.slug} study={study}/>)}</div></div></section>
    <section className="section-dark work-engine-section" data-nav="dark"><div className="section-shell"><div className="work-section-heading"><div><span className="eyebrow text-crimson">The shared operating model</span><h2 className="heading-xl">A clear handoff<br />at every step.</h2></div><p>See what the system checks, what it prepares, and where a person approves the next action.</p></div><SystemTrace/></div></section>
    <section className="section-light work-service-map" data-nav="light"><div className="section-shell"><span className="eyebrow text-crimson">Connected to your operations</span><div className="service-map-grid">{CASE_STUDIES.map(study => <article key={study.slug}><h3>{study.shortTitle}</h3>{study.serviceLinks.map(link => <Link key={link.href} href={link.href}>{link.label}<ArrowRight size={16}/></Link>)}</article>)}</div></div></section>
    <CtaBand eyebrow="Bring us the workflow" title="Where does work get stuck in your team?" lead="Show us the tools, the handoffs, and who needs control. We’ll map the smallest reliable system around them." secondary={{ label:'Explore our process',href:'/process' }}/>
  </>;
}
