import { ENGINE_MODULES, type Tier } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

/**
 * /pricing build manifest - the 11-modules × 3-tiers comparison rendered as a
 * terminal manifest instead of a SaaS pricing table. Same engine, more
 * stations switched on per tier.
 */

const TIERS: { id: Tier; label: string }[] = [
  { id: 'starter', label: 'STARTER' },
  { id: 'growth', label: 'GROWTH' },
  { id: 'scale', label: 'SCALE' },
];

export default function TierManifest() {
  return (
    <section data-nav="dark" className="section-dark relative overflow-hidden border-t border-border py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <Eyebrow className="mb-6">Build Manifest</Eyebrow>
          <Reveal as="h2" className="heading-xl text-text-primary">Exactly which modules each build ships.</Reveal>
          <Reveal as="p" delay={0.05} className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
            Every tier runs the same connected route - bigger builds switch on more stations. Nothing here is a bolt-on; the order is the dependency chain.
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <div className="overflow-x-auto border border-border bg-[#050505]">
            <div className="min-w-[640px] p-6 sm:p-8">
              {/* prompt line */}
              <div className="font-mono text-[12px] text-text-muted">
                <span className="text-crimson">$</span> zeptaz build <span className="text-terminal-green">--manifest</span>
              </div>

              {/* column headers */}
              <div className="mt-6 grid grid-cols-[minmax(0,1fr)_repeat(3,88px)] items-baseline gap-x-2 border-b border-border pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">module</span>
                {TIERS.map((t) => (
                  <span key={t.id} className="text-center font-mono text-[10px] tracking-[0.18em] text-text-secondary">
                    {t.label}
                  </span>
                ))}
              </div>

              {/* manifest lines */}
              <Reveal stagger={0.04}>
                {ENGINE_MODULES.map((m, i) => (
                  <div
                    key={m.id}
                    className="grid grid-cols-[minmax(0,1fr)_repeat(3,88px)] items-center gap-x-2 border-b border-border/50 py-2.5"
                  >
                    <div className="flex min-w-0 items-baseline gap-3 font-mono text-[12px]">
                      <span className="text-text-faint">{String(i + 1).padStart(2, '0')}</span>
                      <span className="truncate text-text-secondary">{m.id.replace(/-/g, '_')}</span>
                      <span className="hidden truncate text-[11px] text-text-faint sm:inline">— {m.name}</span>
                      {m.flag === 'human' && <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-crimson">[human]</span>}
                      {m.flag === 'alert' && <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-terminal-amber">[alert]</span>}
                    </div>
                    {TIERS.map((t) => {
                      const on = m.tiers.includes(t.id);
                      return (
                        <span
                          key={t.id}
                          aria-label={on ? `Included in ${t.label}` : `Not in ${t.label}`}
                          className={cn('text-center font-mono text-[13px]', on ? 'text-crimson' : 'text-text-faint/60')}
                        >
                          {on ? '■' : '·'}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </Reveal>

              {/* footer */}
              <div className="mt-5 font-mono text-[11px] text-text-muted">
                <span className="text-terminal-green">ok</span> · tiers set <span className="text-crimson">reach, not composition</span> - load-bearing stations can’t be removed
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
