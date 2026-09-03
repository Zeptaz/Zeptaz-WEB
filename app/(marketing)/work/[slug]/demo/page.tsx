import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PortfolioDemo from '@/components/work/PortfolioDemo';
import { CASE_STUDIES, CASE_STUDY_BY_SLUG, isWorkSlug } from '@/lib/work';

export const metadata: Metadata = {
  title: 'Interactive System Demo — Zeptaz',
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }));
}

export default async function FullscreenDemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isWorkSlug(slug)) notFound();
  const study = CASE_STUDY_BY_SLUG[slug];

  return (
    <section data-nav="dark" className="fullscreen-demo-page section-dark" style={{ '--demo-accent': study.accent } as React.CSSProperties}>
      <div className="fullscreen-demo-head">
        <Link href={`/work/${study.slug}`}><ArrowLeft size={15} /> Back to case study</Link>
        <div><span className="mono-meta">Interactive showcase</span><h1>{study.title}</h1></div>
      </div>
      <PortfolioDemo study={study} fullscreen />
    </section>
  );
}
