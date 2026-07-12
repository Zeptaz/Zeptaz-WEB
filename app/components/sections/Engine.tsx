'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { ENGINE_MODULES } from '@/lib/constants';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import FlagBadge from '@/components/ui/FlagBadge';
import AsciiWall, { type AsciiWallHandle } from '@/components/ui/AsciiWall';

// 3D tunnel is desktop-only and client-only - keep the three.js stack out of
// the initial bundle and off mobile.
const EngineTunnel = dynamic(() => import('@/components/ui/EngineTunnel'), { ssr: false });

// Keep in sync with ADVANCE in EngineTunnel.tsx (auto-advance seconds per module).
const ADVANCE_MS = 2700;

export default function Engine() {
  const root = useRef<HTMLElement>(null);
  const wall = useRef<AsciiWallHandle>(null);
  const startedRef = useRef({ value: false });
  const [started, setStarted] = useState(false);
  const [focus, setFocus] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => setReduced(prefersReducedMotion()), []);

  // Play-on-enter: flip the tunnel's intro flag when the section scrolls in.
  // (No pin, no scrub - the fly-through is auto-driven.)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      startedRef.current.value = true;
      setStarted(true);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        startedRef.current.value = true;
        setStarted(true);
      },
    });
    return () => st.kill();
  }, []);

  // Every module change pulses the ASCII backdrop - the wall "recomputes"
  // in step with the tunnel.
  const handleFocus = useCallback((i: number) => {
    setFocus(i);
    wall.current?.pulse();
  }, []);

  // Auto-advance progress cue on the readout card (Differentiators pattern:
  // reset to 0, then fill over one ADVANCE interval).
  const [fill, setFill] = useState(false);
  const autoplaying = started && !paused && !reduced;
  useEffect(() => {
    setFill(false);
    if (!autoplaying) return;
    const t = setTimeout(() => setFill(true), 30);
    return () => clearTimeout(t);
  }, [focus, autoplaying]);

  const active = ENGINE_MODULES[focus] ?? ENGINE_MODULES[0];
  const ActiveIcon = active.icon;

  return (
    <section
      id="engine"
      data-nav="dark"
      ref={root}
      className="section-dark section-screen relative overflow-hidden border-t border-border"
    >
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(220,20,60,0.07), transparent 60%)' }}
      />

      <div className="section-shell relative grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {/* ── left: copy + module readout + rail ───────────────────────── */}
        <div className="flex flex-col">
          <Eyebrow index="03" className="mb-5">The Engine</Eyebrow>
          <Reveal as="h2" className="heading-lg max-w-[20ch] text-text-primary">
            One connected engine - dependency-locked, not a menu.
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">
            Each module builds on the accuracy of the one before it. You size the build - Starter, Growth, or Scale - but you don’t gut load-bearing steps that hold the system together.
          </Reveal>

          {/* focused-module readout (desktop) */}
          <div className="relative mt-7 hidden border border-border bg-bg-subtle/70 p-4 backdrop-blur-sm lg:block">
            <div key={focus} className="animate-engine-fade">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-border-strong text-crimson">
                  <ActiveIcon className="h-4 w-4" strokeWidth={1.6} />
                </span>
                <span className="font-mono text-[11px] tracking-[0.16em] text-text-faint">
                  {String(focus + 1).padStart(2, '0')} / {String(ENGINE_MODULES.length).padStart(2, '0')}
                </span>
              </div>
              <div className="mt-3 text-[15px] font-semibold text-text-primary">{active.name}</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-text-muted">{active.desc}</p>
              {active.flag && (
                <div className="mt-2.5">
                  <FlagBadge flag={active.flag} />
                </div>
              )}
            </div>
            {/* auto-advance progress cue */}
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-0.5 bg-crimson"
              style={{
                width: fill ? '100%' : '0%',
                transition: fill ? `width ${ADVANCE_MS}ms linear` : 'none',
              }}
            />
          </div>

          {/* rail - all 11 steps (desktop) */}
          <div
            className="mt-5 hidden grid-cols-2 gap-x-5 gap-y-1.5 lg:grid"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {ENGINE_MODULES.map((m, i) => {
              const on = i === focus;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleFocus(i)}
                  aria-current={on ? 'true' : undefined}
                  className="group flex items-baseline gap-2 text-left transition-colors"
                >
                  <span className={`font-mono text-[10px] tracking-[0.14em] ${on ? 'text-crimson' : 'text-text-faint'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[12px] transition-colors ${
                      on ? 'text-text-primary' : 'text-text-muted group-hover:text-text-secondary'
                    }`}
                  >
                    {m.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── right: 3D tunnel (desktop) / readable list (mobile) ───────── */}
        {/* Both layouts are CSS-gated so the desktop column reserves its space
            immediately (no post-hydration pop-in); only the heavy canvas
            itself waits for the JS media query. */}
        <div className="relative">
          <div className="relative hidden h-[64vh] min-h-[420px] w-full overflow-hidden border border-border/60 lg:block">
            {/* ASCII wall backdrop - the tunnel flies through it */}
            <AsciiWall ref={wall} className="absolute inset-0 h-full w-full opacity-55" />
            <div className="absolute inset-0 bg-bg-primary/30" />
            {/* 3D tunnel (transparent canvas sits over the wall) */}
            <div className="absolute inset-0">
              {isDesktop && (
                <EngineTunnel
                  modules={ENGINE_MODULES}
                  started={startedRef.current}
                  focus={focus}
                  onFocus={handleFocus}
                  paused={paused}
                  reduced={reduced}
                />
              )}
            </div>
          </div>

          <ul className="flex flex-col gap-3 lg:hidden">
            {ENGINE_MODULES.map((m, i) => {
              const Icon = m.icon;
              return (
                <li
                  key={m.id}
                  className="relative border border-border bg-bg-subtle/80 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center border border-border-strong text-text-secondary">
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.16em] text-text-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="mt-3 text-[13px] font-semibold text-text-primary">{m.name}</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-text-muted">{m.desc}</p>
                  {m.flag && (
                    <div className="mt-2.5">
                      <FlagBadge flag={m.flag} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="section-shell relative mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
        <span className="text-crimson">Anti-cherry-picking</span> - clients choose package size, not which load-bearing modules to remove.
      </p>
    </section>
  );
}
