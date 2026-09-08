import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/work';
import { Badge, s } from './DemoUi';
export default function WorkCard({ study }: { study: CaseStudy; featured?: boolean }) {
  return <article className="work-card">
    <div className="work-card-top"><span className="mono-meta">{study.number} / {study.eyebrow}</span><span className="mono-meta">Case study</span></div>
    <div className={s.demo + ' work-preview'} data-theme={study.theme} aria-hidden>
      <div className="work-preview-head"><span>{study.shortTitle}</span><i /></div>
      {study.theme === 'lead' && <div className="work-preview-grid"><div><small>WEBSITE ENQUIRY</small><p>What do I need to apply?</p><Badge>2 approved sources</Badge></div><div><small>CUSTOMER ENQUIRY</small><strong>Maya → Priya S.</strong><p>Reply reviewed. Callback at 14:30.</p><Badge tone="good">Next step owned</Badge></div></div>}
      {study.theme === 'campaign' && <div className="work-preview-grid"><div className="work-preview-art"><small>24 OCT / OPEN DAY</small><strong>Your next<br />chapter.</strong></div><div><small>POST REVIEW</small><p>LinkedIn · Instagram · X</p><Badge tone="good">Posts approved</Badge><p>Scheduled · 18 Oct, 09:00</p></div></div>}
      {study.theme === 'workstation' && <div className="work-preview-console"><small>PROJECT ATLAS / PROPOSED FIX</small><p>✓ Check the project &nbsp; ✓ Approve one fix</p><p>— No deployment or external messages</p><div><Badge>Plan → approve → run</Badge><strong>Ready for review</strong></div></div>}
      {study.theme === 'media' && <div className="work-preview-grid"><div><small>5 DISTINCT REPORTS</small><p>Video: starts immediately</p><Badge tone="warn">Official date unconfirmed</Badge></div><div><small>REVIEWED BRIEF</small><p>Effective date unconfirmed.</p><Badge tone="good">Unknown date noted</Badge></div></div>}
    </div>
    <div className="work-card-copy"><span className="work-card-name">{study.shortTitle}</span><h3>{study.title}</h3><p>{study.description}</p><p className="work-question">{study.question}</p><div className="work-card-actions"><Link href={`/work/${study.slug}`}>View case study <ArrowUpRight size={16}/></Link></div></div>
  </article>;
}
