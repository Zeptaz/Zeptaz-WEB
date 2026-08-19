'use client';
import { useEffect, useRef, useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { VOICE, VOICE_CALL } from '@/lib/voice';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import Drift from '@/components/ui/Drift';

const BARS = 28;

/** Ticking mm:ss counter. Starts only after mount so SSR and client agree. */
function CallTimer() {
  const [seconds, setSeconds] = useState(42);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setSeconds((s) => (s + 1) % 3600), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return <span suppressHydrationWarning>{mm}:{ss}</span>;
}

/** Idle call-activity waveform - decorative, not tied to any audio. */
function CallWave() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to('[data-bar]', {
        scaleY: () => 0.25 + Math.random() * 0.75,
        duration: 0.45,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
        stagger: { each: 0.035, from: 'center' },
        transformOrigin: 'center',
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrap} aria-hidden className="flex h-12 items-center gap-[3px]">
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          key={i}
          data-bar
          className="flex-1 bg-crimson/60"
          style={{ height: `${20 + ((i * 37) % 60)}%` }}
        />
      ))}
    </div>
  );
}

export default function VoiceHero() {
  return (
    <section
      id="overview"
      data-nav="dark"
      className="section-dark relative flex min-h-[92vh] items-center overflow-hidden pb-20 pt-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 20%, rgb(220 20 60 / calc(0.08 * var(--glow-strength))), transparent 60%)' }}
      />
      <Drift className="grid-lines opacity-30" />

      <div className="section-shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* pitch */}
          <div>
            <Eyebrow className="mb-6">{VOICE.eyebrow}</Eyebrow>
            <Reveal as="h1" className="display-hero max-w-[15ch] text-text-primary" y={40}>
              AI phone agents that get{' '}
              <span className="text-gradient-crimson">routine calls handled.</span>
            </Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
              {VOICE.lead}
            </Reveal>

            <Reveal delay={0.1} className="mt-9 flex flex-wrap gap-3">
              <Button href="#apply" variant="primary" arrow>{VOICE.ctaPrimary}</Button>
              <Button href="#demo" variant="ghost-dark">{VOICE.ctaSecondary}</Button>
            </Reveal>

            <Reveal stagger={0.06} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-5">
              {VOICE.capabilities.map((c) => (
                <span key={c} className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                  <span className="mr-2 text-crimson">▮</span>{c}
                </span>
              ))}
            </Reveal>
          </div>

          {/* simulated live call */}
          <Reveal as="div" delay={0.12} className="border border-border bg-bg-subtle/80 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-primary">
                <span className="h-1.5 w-1.5 bg-crimson pulse-dot" />
                {VOICE_CALL.status}
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-text-muted">
                <CallTimer />
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {/* caller */}
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-border-strong font-mono text-sm text-text-primary">
                  {VOICE_CALL.caller.initials}
                </span>
                <div className="min-w-0">
                  <p className="mono-meta text-text-faint">{VOICE_CALL.caller.context}</p>
                  <p className="mt-1 truncate text-sm text-text-primary">{VOICE_CALL.caller.name}</p>
                </div>
                <span className="ml-auto flex-shrink-0 bg-crimson/12 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-crimson">
                  {VOICE_CALL.caller.language}
                </span>
              </div>

              <div className="mt-5"><CallWave /></div>

              {/* transcript */}
              <div className="mt-5 border border-border bg-bg-primary p-4">
                <p className="mono-meta text-text-faint">{VOICE_CALL.transcript.speaker}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-primary">
                  “{VOICE_CALL.transcript.line}”
                </p>
              </div>

              {/* checked action */}
              <div className="mt-3 border border-terminal-green/25 bg-terminal-green/[0.06] p-4">
                <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-terminal-green">
                  <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
                  {VOICE_CALL.action.label}
                </p>
                <p className="mt-2 text-sm text-text-primary">{VOICE_CALL.action.result}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-terminal-amber">
                  {VOICE_CALL.action.status}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border px-5 py-3">
              {VOICE_CALL.indicators.map((i) => (
                <span key={i} className="font-mono text-[9px] uppercase tracking-[0.14em] text-text-faint">
                  {i}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-14 hidden lg:block">
          <a
            href="#workflow"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-faint transition-colors hover:text-crimson"
          >
            ↓ Scroll to trace the workflow
          </a>
        </Reveal>
      </div>
    </section>
  );
}
