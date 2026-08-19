'use client';
import { useEffect, useRef, type RefObject } from 'react';
import { prefersReducedMotion } from '@/lib/gsap';

/**
 * Square-bar frequency meter for the live call. Reads the session's analyser
 * every frame while one is attached, and paints a flat baseline otherwise.
 * Throttled to 30fps with fewer bars on touch devices, matching AsciiWall.
 */
export default function VoiceVisualizer({
  analyser,
  className,
}: {
  analyser: RefObject<AnalyserNode | null>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = prefersReducedMotion();
    const BARS = coarse ? 24 : 48;
    const FRAME = 1000 / 30;

    let raf = 0;
    let last = 0;
    const bins = new Uint8Array(64);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < FRAME) return;
      last = t;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const node = analyser.current;
      const gap = 2;
      const barW = Math.max(1, (w - gap * (BARS - 1)) / BARS);
      const mid = h / 2;

      if (node) node.getByteFrequencyData(bins);

      for (let i = 0; i < BARS; i++) {
        const x = i * (barW + gap);
        let amp: number;

        if (node && !reduced) {
          const v = bins[Math.floor((i / BARS) * bins.length)] / 255;
          amp = Math.max(2, v * h * 0.9);
        } else {
          amp = 2;
        }

        // Crimson at the low end, fading to the faint grid grey at the top.
        const heat = Math.min(1, amp / (h * 0.7));
        ctx.fillStyle = node
          ? `rgba(220, 20, 60, ${0.25 + heat * 0.75})`
          : 'rgba(63, 63, 63, 0.9)';
        ctx.fillRect(x, mid - amp / 2, barW, amp);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [analyser]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
