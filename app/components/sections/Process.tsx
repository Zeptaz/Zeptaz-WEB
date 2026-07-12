'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { PROCESS } from '@/lib/constants';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import DecryptedText from '@/components/ui/DecryptedText';

const GATE = PROCESS.findIndex((s) => s.name === 'Access Lock');
const LAST = PROCESS.length - 1;
const STEP_MS = 2800;
const ROW = 64; // px, must match the h-16 rail rows
const centerY = (i: number) => i * ROW + ROW / 2;

export default function Process() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [clockSec, setClockSec] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => setReduced(prefersReducedMotion()), []);

  // Manual selection pauses autoplay.
  const select = useCallback((i: number) => {
    setActive(Math.max(0, Math.min(LAST, i)));
    setPlaying(false);
  }, []);

  // Autoplay: advance through the steps, stop at the last.
  useEffect(() => {
    if (!playing || reduced) return;
    const id = setInterval(() => {
      setActive((a) => {
        if (a >= LAST) { setPlaying(false); return a; }
        return a + 1;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [playing, reduced]);

  // Delivery clock: ticks once we reach the Access Lock gate.
  useEffect(() => {
    if (reduced || active < GATE) { if (active < GATE) setClockSec(0); return; }
    const id = setInterval(() => setClockSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active, reduced]);

  // Play-on-enter (no pin, no scrub) - matches Engine's pattern.
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const st = ScrollTrigger.create({ trigger: el, start: 'top 70%', once: true, onEnter: () => setPlaying(true) });
    return () => st.kill();
  }, [reduced]);

  const togglePlay = () => {
    if (!playing && active >= LAST) { setActive(0); setPlaying(true); return; }
    setPlaying((p) => !p);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select(Math.min(LAST, active + 1)); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select(Math.max(0, active - 1)); }
  };

  const step = PROCESS[active];
  const StepIcon = step.icon;
  const clockRunning = active >= GATE;
  const mm = String(Math.floor(clockSec / 60)).padStart(2, '0');
  const ss = String(clockSec % 60).padStart(2, '0');

  return (
    <section id="process" data-nav="light" ref={root} className="section-light relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-[clamp(3rem,7vh,5.5rem)]">
      <div className="section-shell relative">
        <div className="max-w-3xl">
          <Eyebrow index="06" tone="light" className="mb-4">How It Works</Eyebrow>
          <Reveal as="h2" className="heading-lg text-ink">From fit call to managed plan.</Reveal>
          <Reveal as="p" delay={0.05} className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-secondary">
            A deliberate, low-friction path. The delivery clock only starts at <span className="font-semibold text-ink">Access Lock</span> - once access, test data, routing rules, and owners are confirmed.
          </Reveal>
        </div>

        {/* ── console: stage + rail ─────────────────────────────────────── */}
        <div className="mt-[clamp(1.25rem,3vh,2.25rem)] grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-stretch">
          {/* STAGE */}
          <div className="relative flex min-h-[360px] flex-col border border-ink-border bg-paper-2/40 p-7 sm:p-8">
            <div key={active} className="animate-engine-fade flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] tracking-[0.18em] text-ink-muted">
                  STEP <span className="text-crimson">{step.no}</span> / {String(PROCESS.length).padStart(2, '0')}
                </span>
                <span className="font-mono text-[12px] uppercase tracking-[0.16em]">
                  {clockRunning ? (
                    <span className="inline-flex items-center gap-2 text-crimson">
                      <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-crimson" />
                      Clock · {mm}:{ss}
                    </span>
                  ) : (
                    <span className="text-ink-muted">Clock · not started</span>
                  )}
                </span>
              </div>

              <div className="mt-7 flex items-center gap-5">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center ${active === GATE ? 'bg-crimson text-white' : 'bg-ink text-paper'}`}>
                  <StepIcon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <h3 className="heading-lg text-ink">
                  <DecryptedText key={active} text={step.name} animateOn="view" speed={32} maxIterations={10} />
                </h3>
                {active === GATE && (
                  <span className="bg-crimson/12 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-crimson">Readiness gate</span>
                )}
              </div>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-secondary">{step.desc}</p>

              {/* terminal readout */}
              <div className="mt-auto pt-7">
                <div className="border border-ink-border bg-[#0C0C0C] px-5 py-4 font-mono text-[13px] leading-relaxed text-[#E9E6DF]/90" aria-hidden>
                  {step.logs.map((l, i) => (
                    <div key={`${active}-${i}`} className="process-line" style={{ animationDelay: `${i * 0.1 + 0.1}s` }}>
                      <span className="text-crimson">{l.startsWith('>') ? '' : '· '}</span>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RAIL */}
          <div role="tablist" aria-label="Process steps" tabIndex={0} onKeyDown={onKey} className="relative outline-none">
            {/* connectors: dashed before the gate, solid after; crimson progress fill */}
            <div className="pointer-events-none absolute" style={{ left: 19, top: centerY(0), height: centerY(GATE) - centerY(0), borderLeft: '2px dashed #C4BFB3' }} />
            <div className="pointer-events-none absolute" style={{ left: 19, top: centerY(GATE), height: centerY(LAST) - centerY(GATE), borderLeft: '2px solid #D6D2C8' }} />
            <div className="pointer-events-none absolute transition-[height] duration-500 ease-out" style={{ left: 19, top: centerY(0), height: centerY(active) - centerY(0), borderLeft: '2px solid #DC143C' }} />
            {/* playhead */}
            <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-crimson transition-[top] duration-500 ease-out" style={{ left: 15, top: centerY(active) - 5 }} />

            {PROCESS.map((s, i) => {
              const Icon = s.icon;
              const state = i < active ? 'done' : i === active ? 'active' : 'pending';
              const isGate = i === GATE;
              return (
                <button
                  key={s.no}
                  role="tab"
                  aria-selected={i === active}
                  aria-current={i === active ? 'step' : undefined}
                  onClick={() => select(i)}
                  className="group relative flex h-16 w-full items-center gap-5 text-left"
                >
                  <span
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border transition-colors duration-300 ${
                      state === 'active'
                        ? 'border-crimson bg-crimson text-white'
                        : state === 'done'
                          ? 'border-ink bg-ink text-paper'
                          : `bg-paper text-ink-muted ${isGate ? 'border-crimson/50' : 'border-ink-border'}`
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-mono text-[11px] tracking-[0.16em] text-ink-muted">{s.no}</span>
                    <span className={`truncate text-base transition-colors duration-300 ${state === 'pending' ? 'text-ink-muted group-hover:text-ink-secondary' : 'font-semibold text-ink'}`}>
                      {s.name}
                    </span>
                  </span>
                  <span className="ml-auto pr-1 font-mono text-[15px] text-crimson">
                    {state === 'done' ? '✓' : state === 'active' ? '●' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* controls */}
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button type="button" onClick={togglePlay} className="btn btn-ghost-light" aria-label={playing ? 'Pause walkthrough' : 'Play walkthrough'}>
            {playing ? '❚❚ Pause' : active >= LAST ? '↻ Replay' : '▶ Play'}
          </button>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
            {String(active + 1).padStart(2, '0')} / {String(PROCESS.length).padStart(2, '0')} - click a step or use ← →
          </span>
        </div>
      </div>
    </section>
  );
}
