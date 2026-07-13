'use client';
import { cn } from '@/lib/utils';

/* Hero backdrop - reused & refined from V1: dot grid + crimson glow +
   scrolling workflow logs (re-themed to the new positioning). */

const intakeLogs = [
  '[09:12:04] intake.form        → new candidate inquiry #C-2841',
  '[09:12:05] record.ats         ✓ created BH-58120',
  '[09:12:05] field.check        ✓ required fields present',
  '[09:12:06] categorize         → "candidate · permanent"',
  '[09:12:07] owner.assign       → routed to recruiter:dani',
  '[09:12:07] alert.slack        ✓ #intake notified',
  '[09:12:09] draft.ai           ⧖ awaiting human approval',
  '[09:12:11] followup.task      ✓ scheduled +1d',
  '[09:12:14] intake.email       → client job order #J-7740',
  '[09:12:15] record.crm         ✓ updated HS-44021',
  '[09:12:16] owner.assign       → routed to team:accounts',
  '[09:12:18] stale.scan         → 0 inquiries past SLA',
  '[09:12:21] handoff            ✓ placement → onboarding',
  '[09:12:23] report.daily       ✓ snapshot written',
  '[09:12:25] intake.form        → new candidate inquiry #C-2842',
];

const ruleLogs = [
  '$ zeptaz engine --workflow=recruitment-intake',
  '  ✓ connector: bullhorn  [oauth ok]',
  '  ✓ connector: slack     [ok]',
  '  ✓ rules: routing + ownership loaded',
  '  ✓ fields: 7 required mapped',
  '$ zeptaz rules verify',
  '  owner.fallback        = team:desk',
  '  stale.threshold       = 36h',
  '  ai.autosend           = false',
  '  ai.approval.required  = true',
  '$ zeptaz status',
  '  intake   HEALTHY   queue: 0',
  '  drafts   HEALTHY   pending-approval: 2',
  '  followup HEALTHY   due-today: 14',
  '  reports  HEALTHY   last: 4m ago',
];

const statusLogs = [
  '[STATUS] intake:    inquiries/today: 41',
  '[STATUS] ownership:  assigned: 41/41',
  '[STATUS] drafts:     prepared: 18 | approved: 16',
  '[STATUS] followup:   on-time: 96.4%',
  '[STATUS] stale:      flagged: 3 | resolved: 3',
  '[OK]     record:     ats sync 100% consistent',
  '[STATUS] handoff:    placements → onboarding: 2',
  '[WARN]   connector:  hubspot rate-limit → backoff 2s',
  '[STATUS] report:     time-to-record avg: 11s',
  '[STATUS] report:     time-to-owner avg: 38s',
  '[OK]     access:     least-privilege verified',
  '[STATUS] pii:        anonymized test set in use',
  '[STATUS] intake:    inquiries/today: 42',
  '[STATUS] drafts:     prepared: 19 | approved: 17',
  '[OK]     followup:   no missed next-step actions',
];

const netLogs = [
  '> pipe: intake → ats.upsert(record)',
  '> pipe: field-check → flag(missing:phone)',
  '> pipe: categorize → label("client · contract")',
  '> pipe: owner → slack.notify(@recruiter)',
  '> pipe: draft → queue(human-approval)',
  '> sync: bullhorn ↔ zeptaz [1,204 records]',
  '> pipe: followup → task.create(+1d)',
  '> pipe: stale → alert(owner, "no next step")',
  '> webhook recv: form.submit → intake',
  '> pipe: handoff → onboarding.checklist()',
  '> pipe: report → dashboard.refresh()',
  '> heartbeat [12ms] seq:8821',
  '> pipe: record → crm.update(stage)',
  '> guard: ai.autosend=false → draft only',
  '> heartbeat [11ms] seq:8822',
];

function Pane({ lines, duration, className }: { lines: string[]; duration: string; className?: string }) {
  const doubled = [...lines, ...lines];
  return (
    <div className={cn('min-w-0 flex-1 overflow-hidden', className)}>
      <div className="terminal-pane flex flex-col gap-[6px]" style={{ '--scroll-duration': duration } as React.CSSProperties}>
        {doubled.map((line, i) => (
          <div key={i} className="whitespace-nowrap font-mono text-[10px] leading-[1.6] text-emerald-400/90 sm:text-[11px]" style={{ letterSpacing: '0.02em' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TerminalBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* dot grid */}
      <div className="absolute inset-0 dot-grid" />
      {/* crimson radial glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 72% 48% at 50% 100%, rgba(220,20,60,0.12), transparent 64%)' }} />
      {/* Scrolling panes. Mobile shows fewer (a 375px viewport can't hold four
          columns of mono log) but never zero - this is the hero's texture. */}
      <div className="absolute inset-0 flex gap-5 px-5 pt-24 sm:gap-7 sm:px-7" style={{ opacity: 0.12 }}>
        <Pane lines={intakeLogs} duration="30s" />
        <Pane lines={ruleLogs} duration="24s" className="hidden sm:block" />
        <Pane lines={statusLogs} duration="34s" className="hidden lg:block" />
        <Pane lines={netLogs} duration="27s" className="hidden lg:block" />
      </div>
      {/* edge fades */}
      <div className="absolute inset-x-0 top-0 h-28" style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
    </div>
  );
}
