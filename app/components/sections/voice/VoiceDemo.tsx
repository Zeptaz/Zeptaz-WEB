'use client';
import { useState } from 'react';
import { Mic, Square, LoaderCircle, PhoneOff } from 'lucide-react';
import { VOICE, VOICE_SCENARIOS, type VoiceScenario } from '@/lib/voice';
import { cn } from '@/lib/utils';
import { useVoiceSession } from '@/hooks/useVoiceSession';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import Drift from '@/components/ui/Drift';
import VoiceVisualizer from './VoiceVisualizer';

export default function VoiceDemo() {
  const [scenario, setScenario] = useState<VoiceScenario>(VOICE_SCENARIOS[0]);
  const { state, status, active, analyser, start, stop } = useVoiceSession();

  const live = state === 'live';
  const busy = state === 'connecting' || state === 'waiting';
  const offline = state === 'unconfigured';

  // Changing the business mid-call ends the current session first - the
  // backend is configured per scenario at connect time.
  const pick = (next: VoiceScenario) => {
    if (next.id === scenario.id) return;
    if (active) stop();
    setScenario(next);
  };

  return (
    <section
      id="demo"
      data-nav="dark"
      className="section-dark relative overflow-hidden border-t border-border py-24"
    >
      <Drift className="dot-grid opacity-40" />

      <div className="section-shell relative">
        <div className="max-w-2xl">
          <Eyebrow index="02" className="mb-6">Voice Scenario Preview</Eyebrow>
          <Reveal as="h2" className="heading-xl text-text-primary">Try it as a customer.</Reveal>
          <Reveal as="p" delay={0.05} className="mt-6 text-base leading-relaxed text-text-secondary">
            Choose a business, tap the microphone, and talk to the agent the way a caller would.
            Speak in Sinhala, Tamil, or English.
          </Reveal>
        </div>

        {/* language support */}
        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-border py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-crimson">
            Language support
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-muted">
            {VOICE.languages.join(' · ')}
          </span>
        </div>

        {/* scenario tabs */}
        <div className="mt-px grid gap-px bg-border sm:grid-cols-3">
          {VOICE_SCENARIOS.map((s) => {
            const on = s.id === scenario.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pick(s)}
                aria-pressed={on}
                className={cn(
                  'group flex items-baseline gap-3 px-5 py-4 text-left transition-colors',
                  on ? 'bg-bg-elevated' : 'bg-bg-primary hover:bg-bg-subtle',
                )}
              >
                <span className={cn('font-mono text-[10px] tracking-[0.18em]', on ? 'text-crimson' : 'text-text-faint')}>
                  {s.n}
                </span>
                <span className={cn('text-sm', on ? 'text-text-primary' : 'text-text-muted group-hover:text-text-secondary')}>
                  {s.tab}
                </span>
              </button>
            );
          })}
        </div>

        {/* selected scenario panel */}
        <div className="border border-border bg-bg-subtle/70">
          {/* panel status bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
              <span
                className={cn(
                  'h-1.5 w-1.5',
                  live ? 'bg-crimson pulse-dot' : busy ? 'bg-terminal-amber' : 'bg-text-faint',
                )}
              />
              Voice preview
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-crimson">
              {scenario.language}
            </span>
          </div>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* who you're calling */}
            <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="mono-meta text-text-faint">You’re calling</p>
              <p className="mt-3 heading-lg text-text-primary">{scenario.business}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                {scenario.type}
              </p>

              <div className="mt-8 border-l-2 border-crimson/50 pl-4">
                <p className="mono-meta text-text-faint">Try this scenario</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{scenario.prompt}</p>
              </div>
            </div>

            {/* the call itself */}
            <div className="flex flex-col items-center justify-center gap-6 p-6 sm:p-8">
              <VoiceVisualizer analyser={analyser} className="h-20 w-full max-w-sm" />

              {offline ? (
                <>
                  <span className="flex h-20 w-20 items-center justify-center border border-border-strong text-text-faint">
                    <PhoneOff className="h-7 w-7" strokeWidth={1.6} />
                  </span>
                  <p className="max-w-xs text-center text-sm leading-relaxed text-text-secondary">
                    {status}
                  </p>
                  <Button href="#apply" variant="ghost-dark" arrow>{VOICE.ctaPrimary}</Button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => (active ? stop() : start(scenario))}
                    aria-pressed={active}
                    aria-label={active ? 'End the voice preview call' : 'Start the voice preview call'}
                    className={cn(
                      'flex h-20 w-20 items-center justify-center border transition-colors duration-300',
                      live
                        ? 'border-crimson bg-crimson text-white hover:bg-crimson-hover'
                        : busy
                          ? 'border-terminal-amber/60 text-terminal-amber'
                          : 'border-border-strong text-text-primary hover:border-crimson hover:text-crimson',
                    )}
                  >
                    {busy ? (
                      <LoaderCircle className="h-6 w-6 animate-spin" strokeWidth={1.8} />
                    ) : live ? (
                      <Square className="h-6 w-6 fill-current" strokeWidth={1.8} />
                    ) : (
                      <Mic className="h-7 w-7" strokeWidth={1.6} />
                    )}
                  </button>

                  <p
                    role="status"
                    aria-live="polite"
                    className={cn(
                      'min-h-[2.5rem] max-w-xs text-center text-sm leading-relaxed',
                      state === 'error' ? 'text-crimson' : 'text-text-secondary',
                    )}
                  >
                    {status}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* footnote */}
          <p className="border-t border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint">
            Demo businesses · Calls are not recorded · Best in Chrome, Edge, or Safari 15+
          </p>
        </div>
      </div>
    </section>
  );
}
