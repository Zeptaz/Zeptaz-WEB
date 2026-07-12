'use client';
import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

/**
 * Route-transition curtain: a wall of ASCII characters that sweeps down over
 * the page. Unlike AsciiWall it paints its own opaque background per covered
 * cell, so everything above the ragged edge stays transparent to the live
 * page - no opacity fades, one continuous directional pass.
 *
 * Driven imperatively via setProgress(p), p ∈ [0..2]:
 *   0 → 1  head edge sweeps down (characters materialize, page gets covered)
 *   1 → 2  tail edge follows (characters clear from the top, new page shows)
 */
export type AsciiCurtainHandle = {
  setProgress: (p: number) => void;
};

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#=/%~^()<>|;*+[]{}.:';
const randChar = () => CHARS[(Math.random() * CHARS.length) | 0];
const BG = '#080808';
const JITTER = 7; // max ragged-edge offset, in rows
const EDGE = 3; // rows near an edge that get the bright "materializing" treatment

type CellKind = 0 | 1 | 2; // dim · bright · crimson (vivid weighting - it's a hero moment)
function rollKind(): CellKind {
  const r = Math.random();
  if (r < 0.1) return 2;
  if (r < 0.42) return 1;
  return 0;
}

const AsciiCurtain = forwardRef<AsciiCurtainHandle, { className?: string }>(
  function AsciiCurtain({ className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progressRef = useRef(0);

    useImperativeHandle(ref, () => ({
      setProgress: (p: number) => { progressRef.current = Math.max(0, Math.min(2, p)); },
    }), []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      let w = 0, h = 0, cell = 18, cols = 0, rows = 0;
      let chars: string[] = [];
      let kinds: CellKind[] = [];
      let headJit: number[] = []; // per-column ragged offsets
      let tailJit: number[] = [];

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
        for (let i = 0; i < n; i++) { chars[i] = randChar(); kinds[i] = rollKind(); }
        headJit = Array.from({ length: cols }, () => Math.random() * JITTER);
        tailJit = Array.from({ length: cols }, () => Math.random() * JITTER);
      };
      build();

      const ro = new ResizeObserver(build);
      ro.observe(canvas);

      let raf = 0;
      let t = 0;

      const draw = () => {
        raf = requestAnimationFrame(draw);
        t += 0.016;
        const p = progressRef.current;

        // churn - the covered region keeps recomputing; edges churn extra hard
        const n = cols * rows;
        const flips = Math.max(2, Math.round(n * 0.006));
        for (let f = 0; f < flips; f++) {
          const i = (Math.random() * n) | 0;
          chars[i] = randChar();
          if (Math.random() < 0.2) kinds[i] = rollKind();
        }

        ctx.clearRect(0, 0, w, h);
        const fontPx = Math.round(cell * 0.82);
        ctx.font = `500 ${fontPx}px "Geist Mono", ui-monospace, monospace`;
        ctx.textBaseline = 'top';

        // edge positions in row-space; JITTER padding so p=1 fully covers
        const span = rows + JITTER;
        const head = p * span;
        const tail = (p - 1) * span;

        for (let c = 0; c < cols; c++) {
          const headRow = head - headJit[c];
          const tailRow = tail - tailJit[c];
          const x = c * cell;
          for (let r = 0; r < rows; r++) {
            if (r >= headRow) break; // below the head edge - not covered yet
            if (p > 1 && r < tailRow) continue; // above the tail edge - cleared
            const y = r * cell;

            // opaque background cell (slight overpaint kills hairline seams)
            ctx.fillStyle = BG;
            ctx.fillRect(x, y, cell + 1, cell + 1);

            const i = r * cols + c;
            const k = kinds[i];
            const wave = 0.5 + 0.5 * Math.sin((c + r) * 0.35 - t * 2.2);
            // distance to nearest active edge → the materializing frontier
            const dEdge = Math.min(headRow - r, p > 1 ? r - tailRow : Infinity);
            const onEdge = dEdge < EDGE;
            const boost = onEdge ? (1 - dEdge / EDGE) * 0.55 : 0;

            let col: string;
            if (k === 2 || (onEdge && (i * 31) % 7 === 0)) {
              col = `rgba(220,20,60,${Math.min(1, 0.55 + wave * 0.3 + boost).toFixed(3)})`;
            } else if (k === 1) {
              col = `rgba(255,255,255,${Math.min(1, 0.4 + wave * 0.3 + boost).toFixed(3)})`;
            } else {
              col = `rgba(255,255,255,${Math.min(1, 0.14 + wave * 0.12 + boost).toFixed(3)})`;
            }
            ctx.fillStyle = col;
            ctx.fillText(chars[i], x, y);
          }
        }
      };
      raf = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
  },
);

export default AsciiCurtain;
