import { VOICE_STEPS } from '@/lib/voice';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import Drift from '@/components/ui/Drift';

export default function VoiceWorkflow() {
  return (
    <section
      id="workflow"
      data-nav="light"
      className="section-light relative overflow-hidden py-24"
    >
      <Drift className="dot-grid-light opacity-50" />

      <div className="section-shell relative">
        <div className="max-w-2xl">
          <Eyebrow index="01" tone="light" className="mb-6">How It Works</Eyebrow>
          <Reveal as="h2" className="heading-xl text-ink">From call to completed task.</Reveal>
          <Reveal as="p" delay={0.05} className="mt-6 text-base leading-relaxed text-ink-secondary">
            Zeptaz Voice connects one repeatable call type to the approved information and tools
            your team already uses.
          </Reveal>
        </div>

        <Reveal
          stagger={0.08}
          className="mt-12 grid gap-px overflow-hidden border border-ink-border bg-ink-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {VOICE_STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="group relative flex flex-col bg-paper p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center border border-ink-border text-ink transition-colors group-hover:border-crimson group-hover:text-crimson">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-ink-muted">{s.n}</span>
                </div>
                <h3 className="mt-6 heading-md text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{s.desc}</p>
              </div>
            );
          })}
        </Reveal>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          One sequential workflow — incoming call to recorded outcome.
        </p>
      </div>
    </section>
  );
}
