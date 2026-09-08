import { ImageResponse } from 'next/og';
import { CASE_STUDY_BY_SLUG, isWorkSlug } from '@/lib/work';

export const alt = 'Zeptaz Work — practical systems, interactive demonstrations';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isWorkSlug(slug)) return new Response('Not found', { status: 404 });
  const study = CASE_STUDY_BY_SLUG[slug];
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: 64, background: '#090909', color: '#f2f0eb', borderBottom: '16px solid #e20b3c' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, letterSpacing: 3 }}><span>ZEPTAZ / WORK</span><span style={{ color: '#ff5276' }}>CASE {study.number} / 04</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}><div style={{ fontSize: 60, lineHeight: 1.06, fontWeight: 700 }}>{study.shortTitle}</div><div style={{ fontSize: 30, color: '#c6c4c0', lineHeight: 1.4 }}>{study.question}</div></div>
      <div style={{ display: 'flex', fontSize: 22 }}>Explore the workflow · Interactive prototype · Fictional data</div>
    </div>, size,
  );
}
