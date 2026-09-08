import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PortfolioDemo from '@/components/work/PortfolioDemo';
import { CASE_STUDIES, CASE_STUDY_BY_SLUG, isWorkSlug } from '@/lib/work';
export function generateStaticParams() { return CASE_STUDIES.map(({slug})=>({slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  return {title:`${isWorkSlug(slug)?CASE_STUDY_BY_SLUG[slug].shortTitle:'System'} demo — Zeptaz`,robots:{index:false,follow:true}};
}
export default async function ExpandedDemo({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;if(!isWorkSlug(slug))notFound();const study=CASE_STUDY_BY_SLUG[slug];
  return <section className="expanded-demo"><header className="expanded-demo-head"><Link href={`/work/${slug}#demo`}><ArrowLeft size={16}/>Back to case study</Link><h1>{study.shortTitle}</h1><Link href="/work" aria-label="Zeptaz selected work">ZEPTAZ / WORK</Link></header><PortfolioDemo study={study} fullscreen/></section>;
}
