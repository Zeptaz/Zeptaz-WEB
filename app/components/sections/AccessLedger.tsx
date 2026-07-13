import { TRUST } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

/**
 * /process trust & security as an access ledger - an audit log instead of a
 * feature grid. The point lands through the verdicts: the requests a careless
 * vendor would make are the ones this system DENIES by design.
 */

const ENTRIES: { request: string; verdict: 'DENIED' | 'GRANTED'; title: string; desc: string }[] = [
  { request: 'request: full CRM/ATS export', verdict: 'DENIED', title: TRUST.items[0].title, desc: TRUST.items[0].desc },
  { request: 'request: raw password share', verdict: 'DENIED', title: TRUST.items[1].title, desc: TRUST.items[1].desc },
  { request: 'request: live PII for build', verdict: 'DENIED', title: TRUST.items[2].title, desc: TRUST.items[2].desc },
  { request: 'request: ai.send(unreviewed)', verdict: 'DENIED', title: TRUST.items[3].title, desc: TRUST.items[3].desc },
  { request: 'request: scoped workflow access [approved-by: you]', verdict: 'GRANTED', title: 'The only access we take', desc: 'Exactly the scope confirmed at Access Lock - reviewed with you, revocable by you.' },
];

export default function AccessLedger() {
  return (
    <section data-nav="dark" className="section-dark relative overflow-hidden border-t border-border py-24">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgb(220 20 60 / calc(0.06 * var(--glow-strength))), transparent 60%)' }}
      />
      <div className="section-shell relative">
        <div className="max-w-3xl">
          <Eyebrow className="mb-6">{TRUST.eyebrow}</Eyebrow>
          <Reveal as="h2" className="heading-xl text-text-primary">{TRUST.title}</Reveal>
          <Reveal as="p" delay={0.05} className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
            {TRUST.lead} The fastest way to show it is our own access log - note what gets denied.
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <div className="border border-border bg-[#050505]">
            <div className="p-5 sm:p-8">
              <div className="font-mono text-[12px] text-text-muted">
                <span className="text-crimson">$</span> zeptaz access <span className="text-terminal-green">--audit</span>
              </div>

              <Reveal stagger={0.07} className="mt-6">
                {ENTRIES.map((e) => (
                  <div key={e.request} className="border-b border-border/50 py-4 last:border-b-0">
                    {/* The request/verdict line is one row only once there's width
                        for it - below sm the verdict drops under the request
                        rather than forcing the whole ledger to scroll sideways. */}
                    <div className="flex flex-col gap-2 font-mono text-[12px] sm:flex-row sm:items-baseline sm:gap-3">
                      <div className="flex min-w-0 items-baseline gap-3">
                        <span className="select-none text-text-faint">&gt;</span>
                        <span className="break-words text-text-secondary">{e.request}</span>
                      </div>
                      <span className="mx-1 hidden flex-1 border-b border-dotted border-border sm:block" aria-hidden />
                      <span
                        className={cn(
                          'ml-6 w-fit shrink-0 px-1.5 py-0.5 text-[10px] tracking-[0.14em] sm:ml-0',
                          e.verdict === 'DENIED' ? 'bg-crimson/12 text-crimson' : 'bg-terminal-green/10 text-terminal-green',
                        )}
                      >
                        {e.verdict}
                      </span>
                    </div>
                    <div className="mt-2.5 pl-6">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-faint">{e.title}</span>
                      <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-text-muted">{e.desc}</p>
                    </div>
                  </div>
                ))}
              </Reveal>

              <div className="mt-5 font-mono text-[11px] leading-relaxed text-text-muted">
                <span className="text-terminal-green">ok</span> · least-privilege by default - the system can’t leak what it never had
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
