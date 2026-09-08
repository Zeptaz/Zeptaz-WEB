'use client';
import { useEffect, useState } from 'react';
import { Mic, Square, LoaderCircle, PhoneOff } from 'lucide-react';
import {
  VOICE,
  VOICE_LANGUAGE_OPTIONS,
  VOICE_SCENARIOS,
  type VoiceLanguageCode,
  type VoiceScenario,
} from '@/lib/voice';
import { cn } from '@/lib/utils';
import { useVoiceSession } from '@/hooks/useVoiceSession';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import Drift from '@/components/ui/Drift';
import VoiceVisualizer from './VoiceVisualizer';

export default function VoiceDemo() {
  const [scenario, setScenario] = useState<VoiceScenario>(VOICE_SCENARIOS[0]);
  const [language, setLanguage] = useState<VoiceLanguageCode>('auto');
  const [saveHistory, setSaveHistory] = useState(false);
  const [noticeVersion, setNoticeVersion] = useState('');
  const [scenarios, setScenarios] = useState(VOICE_SCENARIOS);
  const [businessLanguages, setBusinessLanguages] = useState<Record<string, string[]>>({});
  const { state, status, active, analyser, start, stop } = useVoiceSession();
  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_VOICE_API_URL ?? '').replace(/\/+$/, '');
    if (!base) return;
    const controller = new AbortController();
    fetch(`${base}/api/demo/scenarios`, { credentials: 'omit', cache: 'no-store', signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('unavailable'); return response.json(); })
      .then(data => {
        if (data.history_available === true && typeof data.privacy_notice_version === 'string') setNoticeVersion(data.privacy_notice_version);
        if (Array.isArray(data.scenarios)) setScenarios(VOICE_SCENARIOS.map(original => {
          const published = data.scenarios.find((item: { id?: string }) => item.id === original.id);
          return published && typeof published.business === 'string' && typeof published.prompt === 'string'
            ? { ...original, business: published.business, prompt: published.prompt } : original;
        }));
        if (Array.isArray(data.scenarios)) setBusinessLanguages(Object.fromEntries(data.scenarios
          .filter((item: { id?: string; supported_languages?: unknown }) => typeof item.id === 'string' && Array.isArray(item.supported_languages))
          .map((item: { id: string; supported_languages: string[] }) => [item.id, item.supported_languages])));
      }).catch(() => { /* Original scenarios remain usable; history stays off. */ });
    return () => controller.abort();
  }, []);

  const live = state === 'live';
  const busy = state === 'connecting' || state === 'waiting';
  const offline = state === 'unconfigured';
  const selectedLanguage = VOICE_LANGUAGE_OPTIONS.find((option) => option.value === language)
    ?? VOICE_LANGUAGE_OPTIONS[0];

  // Changing the business mid-call ends the current session first - the
  // backend is configured per scenario at connect time.
  const pick = (next: VoiceScenario) => {
    if (next.id === scenario.id) return;
    if (active) stop();
    setScenario(next);
    setLanguage('auto');
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
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-border py-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-crimson">
              Language support
            </span>
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-muted">
              {VOICE.languages.join(' · ')}
            </span>
          </div>
          <label className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
              Call language
            </span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as VoiceLanguageCode)}
              disabled={active}
              aria-label="Voice preview language"
              className="min-w-40 border border-border-strong bg-bg-primary px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-text-primary focus:border-crimson focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {VOICE_LANGUAGE_OPTIONS.filter(option => option.value === 'auto' || !businessLanguages[scenario.id] || businessLanguages[scenario.id].includes(option.value)).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        {/* scenario tabs */}
        <div className="mt-px grid gap-px bg-border sm:grid-cols-3">
          {scenarios.map((s) => {
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
              {selectedLanguage.label}
            </span>
          </div>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* who you're calling */}
            <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="mono-meta text-text-faint">You’re calling</p>
              <p className="mt-3 heading-lg text-text-primary">{scenarios.find(item => item.id === scenario.id)?.business ?? scenario.business}</p>
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
                    onClick={() => (active ? stop() : start(scenario, language, { save: saveHistory && Boolean(noticeVersion), noticeVersion }))}
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
          {noticeVersion && <label className="flex items-start justify-center gap-3 border-t border-border px-5 py-4 text-sm text-text-secondary">
            <input type="checkbox" checked={saveHistory} disabled={active} onChange={event => setSaveHistory(event.target.checked)} className="mt-1 accent-[#DC143C]" />
            <span>Allow Zeptaz to save this demo call’s transcript and demo action details for up to 30 days for review. Optional.</span>
          </label>}
          <p className="border-t border-border px-5 py-3 text-center text-xs leading-relaxed text-text-secondary">
            Demo businesses · Audio is processed live by Google Gemini; Zeptaz does not save an audio recording.
            {noticeVersion ? ' If you choose to save the call, its transcript and demo action details are deleted after 30 days. Otherwise, call content is deleted when the session ends.' : ' Call content is deleted when the session ends.'}
            {' '}Non-content usage metrics may be retained. Please use sample information only. Google’s processing is subject to its own terms.
          </p>
        </div>
      </div>
    </section>
  );
}
