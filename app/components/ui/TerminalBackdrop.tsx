'use client';

const agentLogs = [
  '[12:04:21] AGENT.support     → handling ticket #4821',
  '[12:04:22] AGENT.leadgen     ✓ qualified lead #9314',
  '[12:04:23] AGENT.predict     → forecast updated',
  '[12:04:24] AGENT.outreach    ✓ email sequence triggered',
  '[12:04:25] AGENT.social      → post scheduled #7102',
  '[12:04:26] AGENT.sales       ✓ pipeline updated',
  '[12:04:27] AGENT.hr          → candidate screened',
  '[12:04:28] AGENT.finance     ✓ report generated',
  '[12:04:29] AGENT.support     → escalating ticket #4822',
  '[12:04:30] AGENT.leadgen     → scoring 847 prospects',
  '[12:04:31] AGENT.predict     ✓ model retrained',
  '[12:04:32] AGENT.outreach    → A/B test variant selected',
  '[12:04:33] AGENT.social      ✓ engagement report ready',
  '[12:04:34] AGENT.sales       → deal stage advanced',
  '[12:04:35] AGENT.finance     → invoice reconciled',
];

const deployLogs = [
  '$ zeptaz deploy --agent=leadgen --region=ap-south',
  '  ✓ container built  [2.1s]',
  '  ✓ healthcheck pass [latency: 8ms]',
  '  ✓ routing updated',
  '$ zeptaz deploy --agent=support --replicas=3',
  '  ✓ rolling update complete',
  '$ zeptaz status --all',
  '  leadgen   RUNNING  3/3 replicas',
  '  support   RUNNING  3/3 replicas',
  '  sales     RUNNING  2/2 replicas',
  '  predict   RUNNING  1/1 replicas',
  '$ zeptaz logs --agent=outreach --tail=20',
  '  [OK] smtp relay connected',
  '  [OK] template rendered: welcome_v3',
  '$ zeptaz scale --agent=hr --replicas=2',
];

const statusLogs = [
  '[STATUS] sales:     pipeline synced  | 214 contacts',
  '[STATUS] leadgen:   847 leads scored | 99.2% accuracy',
  '[STATUS] support:   q_depth: 12      | avg_ttfr: 1.4s',
  '[STATUS] predict:   model v4.2 live  | drift: 0.002',
  '[STATUS] outreach:  seq_open: 68.4%  | 3,201 sent',
  '[STATUS] social:    reach: 24.8k     | eng: 5.3%',
  '[STATUS] finance:   rec_match: 100%  | lag: 0s',
  '[STATUS] hr:        pipeline: 8 open | screening: 3',
  '[WARN]   leadgen:   rate limit → backing off 2s',
  '[STATUS] sales:     3 deals closed   | rev: $14,200',
  '[STATUS] predict:   confidence: 0.94 | p95: 12ms',
  '[OK]     support:   ticket #4821 resolved in 43s',
  '[STATUS] outreach:  bounce_rate: 0.8%',
  '[STATUS] social:    trending topic detected',
  '[OK]     finance:   month-end close complete',
];

const networkLogs = [
  '> ws://agents.zeptaz.io connected [latency: 12ms]',
  '> pipe: leadgen → crm.upsert(contact)',
  '> pipe: support → slack.notify(#team)',
  '> sync: hubspot ↔ zeptaz [2,047 records]',
  '> webhook recv: stripe/payment.succeeded',
  '> pipe: finance → quickbooks.reconcile()',
  '> ws heartbeat [14ms] [seq: 1,042]',
  '> pipe: hr → greenhouse.update(candidate)',
  '> sync: google_sheets ↔ outreach [ok]',
  '> webhook recv: github/push → ci.trigger',
  '> pipe: predict → dashboard.refresh()',
  '> ws heartbeat [11ms] [seq: 1,043]',
  '> cache invalidated: lead_scores [ttl: 300s]',
  '> pipe: social → analytics.ingest()',
  '> rate_limit: 0/1000 reqs remaining → cooldown',
];

function TerminalPane({
  lines,
  duration,
}: {
  lines: string[];
  duration: string;
}) {
  // Duplicate lines for seamless loop
  const doubled = [...lines, ...lines];
  return (
    <div className="flex-1 overflow-hidden min-w-0">
      <div
        className="terminal-pane flex flex-col gap-[6px]"
        style={{ '--scroll-duration': duration } as React.CSSProperties}
      >
        {doubled.map((line, i) => (
          <div
            key={i}
            className="whitespace-nowrap text-[11px] leading-[1.6] text-emerald-400"
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TerminalBackdrop() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Dot grid layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Bottom crimson radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 45% at 50% 100%, rgba(220,20,60,0.08), transparent 65%)',
        }}
      />

      {/* Animated terminal panes — visible on lg+ only */}
      <div
        className="absolute inset-0 hidden lg:flex gap-6 px-6 pt-20"
        style={{ opacity: 0.13 }}
      >
        <TerminalPane lines={agentLogs} duration="28s" />
        <TerminalPane lines={deployLogs} duration="22s" />
        <TerminalPane lines={statusLogs} duration="32s" />
        <TerminalPane lines={networkLogs} duration="25s" />
      </div>

      {/* Top edge fade mask */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #080808 0%, transparent 100%)' }}
      />
      {/* Bottom edge fade mask */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #080808 0%, transparent 100%)' }}
      />
    </div>
  );
}
