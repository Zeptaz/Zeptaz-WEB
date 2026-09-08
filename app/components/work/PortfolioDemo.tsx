'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { payload } from '@/lib/demo-state';
import { GUIDED_STORIES, type CaseStudy } from '@/lib/work';
import { useDemoSession } from './DemoSessions';
import { s } from './DemoUi';

const Scene = dynamic(() => import('./GuidedScene'), { loading: () => <p role="status">Loading the example…</p> });
const Details = dynamic(() => import('./GuidedScene').then(m => m.SupportingDetails));

export default function PortfolioDemo({ study, fullscreen = false }: { study: CaseStudy; fullscreen?: boolean }) {
  const { state: st, dispatch } = useDemoSession(study.slug);
  const story = GUIDED_STORIES[study.slug];
  const step = study.demoSteps[st.stage];
  const [modal, setModal] = useState<'restart' | 'details' | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const focusNext = useRef(false);
  const live = useRef({ st, dispatch });
  live.current = { st, dispatch };
  const token = { stage: st.stage, generation: st.generation };
  const pause = () => live.current.dispatch({ type: 'pause' });
  useEffect(() => {
    if (st.status !== 'busy') return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        let digest: string | undefined;
        if (st.slug === 'campaign-operations' && st.stage === 3) {
          const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload(st.evidence)));
          digest = Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
        }
        if (!cancelled) live.current.dispatch({ type: 'finish', stage: st.stage, generation: st.generation, digest });
      } catch { if (!cancelled) live.current.dispatch({ type: 'failed', stage: st.stage, generation: st.generation }); }
    }, 900);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [st.status, st.stage, st.generation, st.slug, st.evidence]);
  useEffect(() => {
    if (focusNext.current && ['intro','ready','complete','error'].includes(st.status)) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      focusNext.current = false;
    }
    setCooldown(true);
    const t = setTimeout(() => setCooldown(false), 350);
    return () => clearTimeout(t);
  }, [st.stage, st.status]);
  useEffect(() => {
    const visibility = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause(); });
    if (root.current) observer.observe(root.current);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); pause(); };
  }, []);
  useEffect(() => {
    if (modal) dialog.current?.showModal(); else dialog.current?.close();
  }, [modal]);
  function open(kind: 'restart' | 'details', source: HTMLElement) {
    if (kind === 'details' && st.status !== 'complete') return;
    trigger.current = source; pause(); setModal(kind);
  }
  function next() {
    if (cooldown) return;
    focusNext.current = true;
    if (st.status === 'paused') dispatch({ type: 'resume' });
    else dispatch({ type: st.status === 'intro' ? 'start' : st.status === 'error' ? 'retry' : 'next', ...token });
  }
  function restart() { setModal(null); focusNext.current = true; dispatch({ type: 'restart' }); }
  const intro = st.status === 'intro';
  const done = st.status === 'complete';
  return <div ref={root} className={s.demo} data-theme={study.theme} data-expanded={fullscreen} data-testid="portfolio-demo" data-stage={intro ? 'intro' : st.stage + 1} data-status={st.status}>
    <div className={s.toolbar}><strong>{study.shortTitle}</strong><div className={s.buttonRow}>{!fullscreen && <Link className={s.utility} onClick={pause} href={`/work/${study.slug}/demo`}>Expand view</Link>}<Link className={s.utility} onClick={pause} href="/work">Exit walkthrough</Link>{!intro && !done && <button className={s.utility} onClick={event=>open('restart', event.currentTarget)}>Start over</button>}</div></div>
    <div className={s.guideBody}>
      {!intro && <div className={s.guideProgress}><span>Step {st.stage + 1} of {study.demoSteps.length}</span><progress aria-label="Walkthrough progress" value={st.stage + 1} max={study.demoSteps.length}/></div>}
      <header className={s.guideHeading}><span className={s.overline}>{intro ? story.customer : step.actor}</span><h2 ref={heading} tabIndex={-1}>{intro ? story.intro : step.title}</h2><p>{intro ? story.problem : step.description}</p></header>
      {intro ? <div className={s.guideIntro}><h3>What you’ll see</h3><p>{story.outcome}</p><p>Six short steps. Prepared sample data. One action at a time.</p></div> : <div className={s.guideScene}><Scene state={st}/></div>}
      {done ? <div className={s.guideResult}><h3>What happened</h3><ul>{story.recap.map(line=><li key={line}>{line}</li>)}</ul><Link className={s.action} href={`/contact?project=${study.slug}`}>{study.cta}<ArrowRight size={16}/></Link><div className={s.buttonRow}><button className={s.secondary} onClick={event=>open('details', event.currentTarget)}>See supporting details</button><button className={s.utility} onClick={restart}>Replay walkthrough</button></div></div> : <div className={s.guideAction}>
        <p role={st.status === 'error' ? 'alert' : 'status'} aria-live="polite">{st.status === 'busy' ? 'Preparing the next screen…' : st.status === 'paused' ? 'Your place is saved. Continue when you’re ready.' : st.status === 'error' ? 'This step could not finish. Try again; your progress is saved.' : ''}</p>
        <button data-testid="guided-next" className={s.action} disabled={st.status === 'busy' || cooldown} onClick={next}>{intro ? 'Start walkthrough' : st.status === 'error' ? 'Try again' : st.status === 'paused' ? 'Continue walkthrough' : st.status === 'busy' ? 'Working…' : step.action}<ArrowRight size={18}/></button>
      </div>}
    </div>
    <p className={s.disclosure}>Follow a fictional example. Nothing will be sent, published or changed outside this demo.</p>
    <dialog ref={dialog} className={s.dialog} aria-label={modal === 'restart' ? 'Start over?' : 'Supporting details'} onCancel={()=>setModal(null)} onClose={()=>{setModal(null);trigger.current?.focus();}} data-lenis-prevent><header><h2>{modal === 'restart' ? 'Start over?' : 'Supporting details'}</h2><button className={s.secondary} aria-label="Close details" onClick={()=>setModal(null)}><X size={20}/></button></header><div className={s.dialogBody}>{modal === 'restart' ? <div className={s.stack}><p>This clears your progress and returns to the introduction.</p><button className={s.action} onClick={restart}>Yes, start over</button><button className={s.secondary} onClick={()=>setModal(null)}>Keep my place</button></div> : modal === 'details' && done ? <Details state={st}/> : null}</div></dialog>
  </div>;
}
