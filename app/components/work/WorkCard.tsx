import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/work';

export default function WorkCard({ study, featured = false }: { study: CaseStudy; featured?: boolean }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className={`work-card group ${featured ? 'work-card-featured' : ''}`}
      style={{ '--demo-accent': study.accent } as React.CSSProperties}
    >
      <div className="work-card-top">
        <span className="mono-meta">{study.number} / {study.eyebrow}</span>
        <ArrowUpRight className="work-card-arrow" size={20} />
      </div>
      <div className="work-card-visual" aria-hidden>
        <div className="work-card-window">
          <div className="work-card-window-bar"><i /><i /><i /><span>{study.slug.replaceAll('-', ' / ')}</span></div>
          <div className="work-card-trace">
            {study.workflow.slice(0, featured ? 7 : 5).map((step, index) => (
              <div key={step} className={index < 3 ? 'active' : ''}><span>{String(index + 1).padStart(2, '0')}</span><b>{step}</b></div>
            ))}
          </div>
          <div className="work-card-status"><i /><span>Operator checkpoint visible</span><b>READY</b></div>
        </div>
      </div>
      <div className="work-card-copy">
        <h2>{study.title}</h2>
        <p>{study.description}</p>
        <div className="work-card-tags">{study.services.map((service) => <span key={service}>{service}</span>)}</div>
      </div>
    </Link>
  );
}
