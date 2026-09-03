'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  CirclePause,
  CirclePlay,
  Clock3,
  ExternalLink,
  FileCheck2,
  FileText,
  GitBranch,
  LockKeyhole,
  MessageSquareText,
  Network,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import type { CaseStudy } from '@/lib/work';
import { clampDemoStep } from '@/lib/work';
import { cn } from '@/lib/utils';

type DemoProps = {
  study: CaseStudy;
  fullscreen?: boolean;
};

const statusRows = [
  ['Schema validation', 'passed'],
  ['Duplicate check', 'clear'],
  ['Intent category', 'programme enquiry'],
  ['Fallback owner', 'Priya S.'],
];

function MiniPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'info' }) {
  return <span className={`demo-pill demo-pill-${tone}`}>{children}</span>;
}

function Panel({ title, meta, children, className }: { title: string; meta?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('demo-panel', className)}>
      <div className="demo-panel-head">
        <span>{title}</span>
        {meta && <span className="demo-muted">{meta}</span>}
      </div>
      {children}
    </section>
  );
}

function LeadScene({ step }: { step: number }) {
  const [name, setName] = useState('Maya Perera');
  const sourcesVisible = step >= 1;
  const routed = step >= 3;
  const approved = step >= 5;

  return (
    <div className="demo-scene demo-lead">
      <div className="demo-scene-bar">
        <span className="demo-app-name"><MessageSquareText size={15} /> Enquiry desk</span>
        <MiniPill tone={approved ? 'good' : 'info'}>{approved ? 'response approved' : 'guided scenario'}</MiniPill>
      </div>
      <div className="demo-two-col">
        <Panel title="Customer conversation" meta="Synthetic visitor">
          <div className="chat-thread">
            <div className="chat-bubble chat-user">What documents do I need, and when is the next intake?</div>
            <div className="chat-bubble chat-ai">
              <span className="chat-agent"><Bot size={14} /> Assistant</span>
              You will need your academic transcripts, identification, and English-language evidence. The next listed intake is September.
              {sourcesVisible && (
                <div className="source-cards">
                  <button type="button"><FileCheck2 size={13} /> Admissions documents <span>approved</span></button>
                  <button type="button"><FileCheck2 size={13} /> Programme intakes <span>approved</span></button>
                </div>
              )}
            </div>
          </div>
          {step >= 2 && (
            <div className="demo-form-card">
              <label>Name<input value={name} onChange={(event) => setName(event.target.value)} /></label>
              <label>Interest<input value="Software degree · September" readOnly /></label>
              <label className="demo-check"><input type="checkbox" checked readOnly /> I agree to be contacted about this enquiry.</label>
            </div>
          )}
        </Panel>
        <Panel title={routed ? 'Operator record' : 'Workflow intake'} meta={routed ? 'LEAD-2048' : 'Waiting for consent'}>
          {routed ? (
            <>
              <div className="lead-summary">
                <div className="avatar">MP</div>
                <div><strong>{name || 'Maya Perera'}</strong><span>Programme enquiry · web assistant</span></div>
                <MiniPill tone={approved ? 'good' : 'warn'}>{approved ? 'follow-up set' : 'review due'}</MiniPill>
              </div>
              <div className="demo-kv-list">
                {statusRows.map(([label, value], index) => (
                  <div key={label} className={step >= 3 + Math.min(index, 1) ? 'is-live' : ''}><span>{label}</span><strong>{value}</strong></div>
                ))}
              </div>
              {step >= 4 && (
                <div className="draft-box">
                  <span className="draft-label"><Sparkles size={13} /> AI-assisted draft · human review required</span>
                  <p>Hi Maya, thanks for your enquiry. I can help confirm the required documents and arrange a call about the September intake.</p>
                  <div className="demo-actions"><button type="button" className={approved ? 'approved' : ''}><Check size={14} /> {approved ? 'Approved by Priya' : 'Approve draft'}</button><button type="button">Edit</button></div>
                </div>
              )}
              {step >= 6 && <div className="success-strip"><Clock3 size={15} /> Callback scheduled today at 14:30 · audit event recorded</div>}
            </>
          ) : (
            <div className="empty-flow"><Network size={32} /><strong>Structured intake begins after consent</strong><span>No contact record is created from a conversation alone.</span></div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function CampaignScene({ step }: { step: number }) {
  const [copy, setCopy] = useState('Explore your next path at our October Open Day.');
  const [hash, setHash] = useState('calculating…');

  useEffect(() => {
    let cancelled = false;
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(copy)).then((result) => {
      if (!cancelled) setHash(Array.from(new Uint8Array(result)).slice(0, 8).map((byte) => byte.toString(16).padStart(2, '0')).join(''));
    });
    return () => { cancelled = true; };
  }, [copy]);

  return (
    <div className="demo-scene demo-campaign">
      <div className="demo-scene-bar">
        <span className="demo-app-name"><ShieldCheck size={15} /> Campaign control</span>
        <MiniPill tone={step >= 5 ? 'good' : step === 1 ? 'bad' : 'warn'}>{step >= 5 ? 'approved' : step === 1 ? 'claim blocked' : 'review workspace'}</MiniPill>
      </div>
      <div className="campaign-grid">
        <Panel title="October Open Day" meta="Campaign · CMP-104">
          <div className="campaign-brief">
            <div><span>Objective</span><strong>Event awareness</strong></div>
            <div><span>Owner</span><strong>Alex Morgan</strong></div>
            <div><span>Channels</span><strong>LinkedIn · Instagram · X</strong></div>
            <div><span>Readiness</span><strong>{step === 1 ? '1 blocker' : step >= 5 ? 'Approved' : 'In review'}</strong></div>
          </div>
          <div className={cn('claim-card', step === 1 && 'claim-blocked', step >= 2 && 'claim-resolved')}>
            {step === 1 ? <AlertTriangle size={17} /> : <CheckCircle2 size={17} />}
            <div><span>Claim check</span><strong>{step === 1 ? '“Applications close 30 September”' : '“Speak with the team about current application dates”'}</strong><small>{step === 1 ? 'No approved source supports this date.' : 'Wording is supported by the event brief.'}</small></div>
          </div>
        </Panel>
        <Panel title={step >= 3 ? 'Creative studio' : 'Evidence'} meta={step >= 3 ? '3 channel variants' : '2 approved sources'}>
          {step >= 3 ? (
            <>
              <div className="creative-preview">
                <span>OPEN DAY / OCTOBER</span>
                <strong>Build your<br />next chapter.</strong>
                <small>Explore programmes · Meet the team</small>
              </div>
              <label className="copy-editor">Final copy<textarea value={copy} onChange={(event) => setCopy(event.target.value)} /></label>
              {step >= 4 && <div className="hash-line"><LockKeyhole size={14} /><span>Approval fingerprint</span><code>{hash}</code></div>}
              {step >= 5 && <div className="success-strip"><UserCheck size={15} /> Exact version approved by Alex Morgan</div>}
              {step >= 6 && <div className="workflow-job"><span className="pulse-node" /><div><strong>Waiting until publish window</strong><small>Durable job · 18 Oct, 09:00</small></div><MiniPill tone="info">scheduled</MiniPill></div>}
            </>
          ) : (
            <div className="evidence-list">
              <div><FileText size={16} /><span><strong>Event brief v3</strong><small>Approved by campaign owner</small></span><MiniPill tone="good">active</MiniPill></div>
              <div><FileText size={16} /><span><strong>Programme overview</strong><small>Reviewed 04 October</small></span><MiniPill tone="good">active</MiniPill></div>
            </div>
          )}
        </Panel>
      </div>
      {step >= 7 && <div className="result-band"><strong>Synthetic signal report</strong><span>Content reactions grouped for human interpretation · no causal claims</span><div className="spark-bars"><i /><i /><i /><i /><i /></div></div>}
    </div>
  );
}

function WorkstationScene({ step }: { step: number }) {
  const [writeAllowed, setWriteAllowed] = useState(true);
  const [externalAllowed, setExternalAllowed] = useState(false);
  const [stopped, setStopped] = useState(false);

  useEffect(() => setStopped(false), [step]);

  return (
    <div className="demo-scene demo-workstation">
      <div className="demo-scene-bar">
        <span className="demo-app-name"><Sparkles size={15} /> Operator workstation</span>
        <MiniPill tone={stopped ? 'bad' : step >= 6 ? 'good' : 'info'}>{stopped ? 'stopped safely' : step >= 6 ? 'evidence ready' : 'local session'}</MiniPill>
      </div>
      <div className="workstation-layout">
        <div className="orb-column">
          <div className={cn('demo-orb', step >= 1 && 'is-active', stopped && 'is-stopped')}><span /><i /><b /></div>
          <span className="orb-caption">{stopped ? 'Execution stopped' : step === 0 ? 'Awaiting command' : step < 5 ? 'Planning safely' : 'Supervising session'}</span>
        </div>
        <div className="workstation-main">
          <div className="command-line"><span>&gt;</span><strong>Resume Project Atlas and tell me what needs attention.</strong></div>
          {step >= 1 && (
            <div className="context-grid">
              <div><GitBranch size={15} /><span>Git activity</span><strong>4 changes</strong></div>
              <div><CheckCircle2 size={15} /><span>Tests</span><strong>42 passing</strong></div>
              <div><Clock3 size={15} /><span>Open tasks</span><strong>3 due</strong></div>
              <div><FileText size={15} /><span>Project notes</span><strong>2 recent</strong></div>
            </div>
          )}
          {step >= 2 && step < 5 && (
            <Panel title="Proposed actions" meta="Review before execution">
              <div className="action-plan">
                <div><span>01</span><strong>Run the focused test suite</strong><MiniPill tone="good">read</MiniPill></div>
                <div><span>02</span><strong>Prepare the bounded validation fix</strong><MiniPill tone="warn">write</MiniPill></div>
                <div><span>03</span><strong>Draft a review summary</strong><MiniPill tone="info">local</MiniPill></div>
              </div>
              {step >= 3 && (
                <div className="permission-grid">
                  <label><input type="checkbox" checked readOnly /> Repository read</label>
                  <label><input type="checkbox" checked={writeAllowed} onChange={(event) => setWriteAllowed(event.target.checked)} /> Repository write</label>
                  <label><input type="checkbox" checked={externalAllowed} onChange={(event) => setExternalAllowed(event.target.checked)} /> External messages</label>
                  <label><input type="checkbox" checked={false} readOnly /> Desktop control</label>
                </div>
              )}
              {step >= 4 && <div className="success-strip"><ShieldCheck size={15} /> Approved with least privilege · external access denied</div>}
            </Panel>
          )}
          {step >= 5 && (
            <Panel title={stopped ? 'Session interrupted' : step >= 6 ? 'Review-ready result' : 'Supervised coding session'} meta={stopped ? 'No further tools may run' : 'SESSION-7A2'}>
              {step === 5 && !stopped ? (
                <>
                  <div className="terminal-lines"><span><b>09:41:02</b> context locked · project-atlas</span><span><b>09:41:04</b> focused tests · 42 passed</span><span><b>09:41:07</b> validation fix prepared</span><span><b>09:41:09</b> review summary generated</span></div>
                  <button type="button" className="stop-button" onClick={() => setStopped(true)}><X size={14} /> Emergency stop</button>
                </>
              ) : (
                <div className="result-summary"><div><CheckCircle2 size={18} /><span><strong>{stopped ? 'Stopped without additional changes' : '42 focused tests passed'}</strong><small>Evidence recorded in the session log</small></span></div><div><FileCheck2 size={18} /><span><strong>{stopped ? 'Partial work preserved for review' : '2 files prepared for review'}</strong><small>No external actions were permitted</small></span></div><div><Clock3 size={18} /><span><strong>Follow-up task saved</strong><small>Review validation edge cases tomorrow</small></span></div></div>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

const sourceItems = [
  ['Harbour Ledger', 'Web', 'Policy takes effect after a transition period', 'verified'],
  ['Transit Brief', 'Web', 'Industry groups request clarification', 'verified'],
  ['Coastline News', 'Video', 'Presenter states an immediate effective date', 'conflict'],
  ['Freight Monitor', 'Web', 'Guidance expected before enforcement', 'verified'],
];

function MediaScene({ step }: { step: number }) {
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState('Six sources report a new regional logistics policy. The effective date remains unconfirmed because one video report conflicts with the published guidance.');
  const approved = step >= 5;
  const filtered = sourceItems.filter((item) => item.join(' ').toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="demo-scene demo-media">
      <div className="demo-scene-bar">
        <span className="demo-app-name"><Search size={15} /> Intelligence desk</span>
        <MiniPill tone={approved ? 'good' : step >= 3 ? 'warn' : 'info'}>{approved ? 'analyst approved' : step >= 3 ? 'conflict review' : 'monitoring'}</MiniPill>
      </div>
      <div className="media-stats">
        <div><span>Sources</span><strong>8</strong><small>6 web · 2 video</small></div>
        <div><span>Items</span><strong>{step >= 1 ? '8' : '0'}</strong><small>{step >= 1 ? 'processed' : 'ready to fetch'}</small></div>
        <div><span>Duplicates</span><strong>{step >= 2 ? '3' : '—'}</strong><small>grouped safely</small></div>
        <div><span>Open conflicts</span><strong>{step >= 3 ? '1' : '0'}</strong><small>analyst required</small></div>
      </div>
      <div className="media-grid">
        <Panel title={step < 2 ? 'Processing queue' : 'Regional logistics policy'} meta={step < 2 ? 'Prepared refresh' : 'Topic · 5 unique items'}>
          {step < 2 ? (
            <div className="processing-list">{['Website fetch', 'Video metadata', 'Schema validation', 'Duplicate detection', 'Topic assignment'].map((item, index) => <div key={item} className={step >= 1 && index < 4 ? 'done' : ''}><span>{index + 1}</span><strong>{item}</strong><small>{step >= 1 && index < 4 ? 'complete' : 'queued'}</small></div>)}</div>
          ) : (
            <>
              <label className="table-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter evidence" /></label>
              <div className="evidence-table">{filtered.map(([source, type, claim, status]) => <div key={source}><span><strong>{source}</strong><small>{type}</small></span><p>{claim}</p><MiniPill tone={status === 'conflict' ? 'bad' : 'good'}>{status}</MiniPill></div>)}</div>
            </>
          )}
        </Panel>
        <Panel title={step >= 4 ? 'Analyst brief' : 'System health'} meta={step >= 4 ? 'Evidence-linked draft' : 'All services observable'}>
          {step >= 4 ? (
            <>
              <label className="copy-editor">Summary<textarea value={summary} onChange={(event) => setSummary(event.target.value)} /></label>
              <div className="uncertainty-note"><AlertTriangle size={15} /><span><strong>Known uncertainty</strong>Effective date requires primary-source confirmation.</span></div>
              {approved && <div className="success-strip"><UserCheck size={15} /> Brief reviewed and approved by Sam K.</div>}
              {step >= 6 && <button type="button" className="report-button"><FileText size={15} /> Open report preview</button>}
            </>
          ) : (
            <div className="health-list"><div><span className="health-dot good" /><strong>Website parsers</strong><small>6 / 6 healthy</small></div><div><span className="health-dot good" /><strong>Video metadata</strong><small>2 / 2 healthy</small></div><div><span className="health-dot warn" /><strong>Model endpoint</strong><small>rules fallback ready</small></div><div><span className="health-dot good" /><strong>Report worker</strong><small>idle</small></div></div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function DemoScene({ study, step }: { study: CaseStudy; step: number }) {
  if (study.slug === 'lead-operations') return <LeadScene step={step} />;
  if (study.slug === 'campaign-operations') return <CampaignScene step={step} />;
  if (study.slug === 'operator-workstation') return <WorkstationScene step={step} />;
  return <MediaScene step={step} />;
}

export default function PortfolioDemo({ study, fullscreen = false }: DemoProps) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const total = study.demoSteps.length;
  const current = study.demoSteps[step];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step >= total - 1) {
        setPlaying(false);
        return;
      }
      setStep((value) => clampDemoStep(value + 1, total));
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [playing, step, total]);

  const progress = useMemo(() => `${((step + 1) / total) * 100}%`, [step, total]);

  function restart() {
    setPlaying(false);
    setStep(0);
  }

  return (
    <div className={cn('portfolio-demo', fullscreen && 'portfolio-demo-full')} style={{ '--demo-accent': study.accent } as React.CSSProperties}>
      <div className="demo-toolbar">
        <div className="demo-window-dots" aria-hidden><i /><i /><i /></div>
        <div className="demo-toolbar-title"><span>Interactive showcase</span><strong>{study.shortTitle}</strong></div>
        <div className="demo-toolbar-actions">
          <MiniPill>synthetic data</MiniPill>
          {!fullscreen && <Link href={`/work/${study.slug}/demo`} aria-label="Open fullscreen demo"><ExternalLink size={15} /></Link>}
        </div>
      </div>
      <div className="demo-progress" aria-hidden><span style={{ width: progress }} /></div>
      <div className="demo-content">
        <aside className="demo-step-rail" aria-label="Demo steps">
          {study.demoSteps.map((item, index) => (
            <button type="button" key={item.label} onClick={() => { setPlaying(false); setStep(index); }} className={cn(index === step && 'is-active', index < step && 'is-complete')} aria-current={index === step ? 'step' : undefined}>
              <span>{index < step ? <Check size={12} /> : String(index + 1).padStart(2, '0')}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </aside>
        <div className="demo-stage"><DemoScene study={study} step={step} /></div>
      </div>
      <div className="demo-narration" aria-live="polite">
        <div><span className="mono-meta">Step {String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span><strong>{current.title}</strong><p>{current.description}</p></div>
        <code>{current.event}</code>
      </div>
      <div className="demo-controls">
        <button type="button" onClick={restart}><RefreshCcw size={14} /> Restart</button>
        <div>
          <button type="button" onClick={() => { setPlaying(false); setStep((value) => clampDemoStep(value - 1, total)); }} disabled={step === 0} aria-label="Previous step"><ArrowLeft size={15} /></button>
          <button type="button" className="demo-play" onClick={() => setPlaying((value) => !value)}>{playing ? <CirclePause size={16} /> : <CirclePlay size={16} />}{playing ? 'Pause guided demo' : 'Play guided demo'}</button>
          <button type="button" onClick={() => { setPlaying(false); setStep((value) => clampDemoStep(value + 1, total)); }} disabled={step === total - 1} aria-label="Next step"><ArrowRight size={15} /></button>
        </div>
        <span>{step + 1} / {total}</span>
      </div>
    </div>
  );
}
