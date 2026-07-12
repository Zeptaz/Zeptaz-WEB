'use client';
import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { prefersReducedMotion } from '@/lib/gsap';

/** Imperative handle: Hero drives the zoom "pass-through" from its ScrollTrigger. */
export type AsciiWallHandle = {
  /** dive amount 0 (resting) → 1 (zoomed through the wall into the next section) */
  dive: (p: number) => void;
  /** one-shot brightness surge (Engine pulses the backdrop on module change) */
  pulse: () => void;
};

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#=/%~^()<>|;*+[]{}.:';
const randChar = () => CHARS[(Math.random() * CHARS.length) | 0];

type CellKind = 0 | 1 | 2; // 0 dim · 1 bright · 2 crimson
function rollKind(vivid: boolean): CellKind {
  const r = Math.random();
  if (vivid) {
    if (r < 0.12) return 2;  // more crimson
    if (r < 0.5) return 1;   // many bright
    return 0;
  }
  if (r < 0.025) return 2;   // ~2.5% crimson
  if (r < 0.085) return 1;   // ~6% bright
  return 0;                  // dim
}

const AsciiWall = forwardRef<
  AsciiWallHandle,
  { className?: string; tone?: 'dark' | 'light'; vivid?: boolean; interactive?: boolean }
>(function AsciiWall({ className, tone = 'dark', vivid = false, interactive = false }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const diveRef = useRef(0);
  const pulseRef = useRef(0);

  useImperativeHandle(ref, () => ({
    dive: (p: number) => { diveRef.current = Math.max(0, Math.min(1, p)); },
    pulse: () => { pulseRef.current = 1; },
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const baseRGB = tone === 'light' ? '12,12,12' : '255,255,255';
    // brighter characters + stronger crimson when `vivid` (used by the loader)
    const A = vivid
      ? { dim: 0.3, dimW: 0.25, bright: 0.7, brightW: 0.3, crim: 0.8, crimW: 0.2 }
      : { dim: 0.07, dimW: 0.1, bright: 0.32, brightW: 0.5, crim: 0.45, crimW: 0.4 };

    let w = 0, h = 0, cell = 18, cols = 0, rows = 0;
    let chars: string[] = [];   // cols*rows
    let kinds: CellKind[] = [];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cell = w < 640 ? 13 : 18;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      const n = cols * rows;
      chars = new Array(n);
      kinds = new Array(n);
      for (let i = 0; i < n; i++) { chars[i] = randChar(); kinds[i] = rollKind(vivid); }
    };
    build();

    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce && !raf) raf = requestAnimationFrame(draw);
    }, { threshold: 0 });
    io.observe(canvas);

    // Pointer-reactive glow (mouse only; skipped for reduced motion / touch).
    const wantPointer = interactive && !reduce && window.matchMedia('(pointer: fine)').matches;
    const client = { x: 0, y: 0, over: false };
    const glow = { x: 0, y: 0, s: 0 }; // smoothed position + strength
    const onMove = (e: PointerEvent) => {
      client.x = e.clientX; client.y = e.clientY;
      const rect = canvas.getBoundingClientRect();
      client.over =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
    };
    const onLeave = () => { client.over = false; };
    if (wantPointer) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    let diveSmooth = 0;
    let pulseSmooth = 0;
    let t = 0;

    const paint = () => {
      const fontPx = Math.round(cell * 0.82);
      ctx.font = `500 ${fontPx}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';

      // zoom: grow characters from the centre + fade as we dive through
      const scale = 1 + diveSmooth * 2.6;
      const alpha = 1 - diveSmooth;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(scale, scale);
      ctx.translate(-w / 2, -h / 2);
      ctx.globalAlpha = alpha;

      // glow radius in grid space (squared, so no sqrt per cell)
      const R = cell * 9;
      const R2 = R * R;
      const gs = glow.s;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          // soft diagonal brightness wave drifting across the grid
          const wave = 0.5 + 0.5 * Math.sin((c + r) * 0.35 - t * 0.9);
          const k = kinds[i];
          // pointer glow: cells near the cursor brighten and fall off smoothly
          let g = 0;
          if (gs > 0.01) {
            const dx = c * cell - glow.x;
            const dy = r * cell - glow.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2) {
              const f = 1 - d2 / R2;
              g = gs * f * f;
            }
          }
          const boost = pulseSmooth * (k === 2 ? 0.4 : k === 1 ? 0.3 : 0.1) + g * (k === 0 ? 0.45 : 0.35);
          let col: string;
          if (k === 2) {
            col = `rgba(220,20,60,${Math.min(1, A.crim + wave * A.crimW + boost).toFixed(3)})`;
          } else if (k === 1) {
            col = `rgba(${baseRGB},${Math.min(1, A.bright + wave * A.brightW + boost).toFixed(3)})`;
          } else {
            col = `rgba(${baseRGB},${Math.min(1, A.dim + wave * A.dimW + boost).toFixed(3)})`;
          }
          ctx.fillStyle = col;
          ctx.fillText(chars[i], c * cell, r * cell);
        }
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      raf = visible && !reduce ? requestAnimationFrame(draw) : 0;
      t += 0.016;
      diveSmooth += (diveRef.current - diveSmooth) * 0.07;

      // pulse: instant attack (from pulse()), smooth decay
      pulseSmooth = Math.max(pulseSmooth, pulseRef.current);
      pulseRef.current = 0;
      pulseSmooth *= 0.93;
      if (pulseSmooth < 0.01) pulseSmooth = 0;

      // pointer glow follows the cursor with a soft trail
      if (wantPointer) {
        const rect = canvas.getBoundingClientRect();
        const lx = client.x - rect.left;
        const ly = client.y - rect.top;
        glow.x += (lx - glow.x) * 0.18;
        glow.y += (ly - glow.y) * 0.18;
        glow.s += ((client.over ? 1 : 0) - glow.s) * 0.08;
      }

      // gentle churn - flip a small number of random cells each frame
      // (the pulse briefly makes the wall "recompute" with extra flips)
      const n = cols * rows;
      const flips = Math.max(1, Math.round(n * 0.003 * (1 + pulseSmooth * 5)));
      for (let f = 0; f < flips; f++) {
        const i = (Math.random() * n) | 0;
        chars[i] = randChar();
        if (Math.random() < 0.15) kinds[i] = rollKind(vivid);
      }

      paint();
    };

    if (reduce) {
      paint(); // single static frame
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (wantPointer) {
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
      }
    };
  }, [tone, vivid, interactive]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
});

export default AsciiWall;
