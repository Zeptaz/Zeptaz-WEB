import { VOICE_CONTROL, VOICE_DASHBOARD } from '@/lib/voice';
import { cn } from '@/lib/utils';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

export default function VoiceControl() {
  return (
    <section
      id="control"
      data-nav="light"
      className="section-light relative overflow-hidden border-t border-ink-border py-24"
    >
      <div className="section-shell relative">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* explanation */}
          <div>
            <Eyebrow index="03" tone="light" className="mb-6">Operator Control</Eyebrow>
            <Reveal as="h2" className="heading-xl text-ink">Manage every call from one dashboard.</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-md text-base leading-relaxed text-ink-secondary">
              Monitor activity, review outcomes, and adjust approved workflow settings as your
              business changes.
            </Reveal>

            <Reveal stagger={0.08} className="mt-10 space-y-px bg-ink-border">
              {VOICE_CONTROL.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="flex gap-4 bg-paper py-5">
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center border border-ink-border text-crimson">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{c.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{c.desc}</p>
                    </div>
                  </div>
                );
              })}
            </Reveal>
          </div>

          {/* dashboard preview */}
          <Reveal as="div" delay={0.1} className="border border-ink-border-strong bg-paper-2 shadow-[0_24px_60px_rgba(12,12,12,0.10)]">
            <div className="flex items-center justify-between border-b border-ink-border-strong bg-paper px-4 py-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink">
                Zeptaz<span className="text-crimson">·</span>Voice
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                Operations / Live
              </span>
              <span className="flex h-6 w-6 items-center justify-center border border-ink-border font-mono text-[9px] text-ink-secondary">
                OP
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="mono-meta text-ink-muted">{VOICE_DASHBOARD.context}</p>
                  <h3 className="mt-1 heading-md text-ink">{VOICE_DASHBOARD.title}</h3>
                </div>
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-secondary">
                  <span className="h-1.5 w-1.5 bg-terminal-green" />
                  {VOICE_DASHBOARD.status}
                </span>
              </div>

              {/* stats */}
              <div className="mt-5 grid gap-px bg-ink-border sm:grid-cols-3">
                {VOICE_DASHBOARD.stats.map((s) => (
                  <div key={s.label} className="bg-paper p-4">
                    <p className="mono-meta text-ink-muted">{s.label}</p>
                    <p className="mt-2 font-mono text-3xl font-bold text-ink">{s.value}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted">
                      demo data
                    </p>
                  </div>
                ))}
              </div>

              {/* recent calls */}
              <div className="mt-5 border border-ink-border bg-paper">
                <div className="grid grid-cols-[1.1fr_1.3fr_1fr_0.6fr] gap-3 border-b border-ink-border px-4 py-2.5">
                  {VOICE_DASHBOARD.columns.map((c) => (
                    <span key={c} className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                      {c}
                    </span>
                  ))}
                </div>
                {VOICE_DASHBOARD.rows.map((r) => (
                  <div
                    key={r.caller + r.time}
                    className="grid grid-cols-[1.1fr_1.3fr_1fr_0.6fr] gap-3 border-b border-ink-border px-4 py-3 last:border-b-0"
                  >
                    <span className="truncate text-[13px] text-ink">{r.caller}</span>
                    <span className="truncate text-[13px] text-ink-secondary">{r.workflow}</span>
                    <span className="flex items-center gap-2 truncate font-mono text-[10px] uppercase tracking-[0.1em] text-ink-secondary">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 flex-shrink-0',
                          r.tone === 'green' ? 'bg-terminal-green' : 'bg-crimson',
                        )}
                      />
                      {r.outcome}
                    </span>
                    <span className="font-mono text-[11px] text-ink-muted">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
