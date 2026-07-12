'use client';
import { useRef, useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/gsap';

/** Lightweight rotating point-sphere (canvas 2D). Crimson-tinted, dpi-aware. */
export default function ParticleSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = prefersReducedMotion();

    // fibonacci sphere points
    const N = 520;
    const pts: { x: number; y: number; z: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const radius = Math.min(w, h) * 0.38;
      angle += reduce ? 0 : 0.0024;
      const cosA = Math.cos(angle), sinA = Math.sin(angle);

      const projected = pts.map((p) => {
        const x = p.x * cosA - p.z * sinA;
        const z = p.x * sinA + p.z * cosA;
        const scale = 0.6 + (z + 1) * 0.4;
        return { sx: cx + x * radius, sy: cy + p.y * radius, z, scale };
      }).sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const alpha = 0.18 + (p.z + 1) * 0.32;
        const size = p.scale * 1.5;
        // crimson near front, dim grey at back
        const crimson = p.z > 0.35;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fillStyle = crimson
          ? `rgba(220,20,60,${alpha})`
          : `rgba(200,200,200,${alpha * 0.5})`;
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(render);
    };
    render();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
