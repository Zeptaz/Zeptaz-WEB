'use client';
import { useRef, useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Inquiries enter from many channels (left) and tangle through disconnected
 * tools - most reach a record, some fray off into a "stale / lost" state.
 */
export default function ChannelChaos() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const flows = svg.querySelectorAll<SVGPathElement>('.flow');
    const stale = svg.querySelectorAll<SVGPathElement>('.flow-stale');
    const nodes = svg.querySelectorAll<SVGElement>('.src-node');
    const lostDot = svg.querySelector<SVGElement>('.lost-dot');

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // draw the healthy flows on scroll-in
      flows.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut',
          scrollTrigger: { trigger: svg, start: 'top 78%' },
        });
      });
      // stale flows draw partially then a dot detaches
      stale.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: `${len * 0.55} ${len}`, strokeDashoffset: len * 0.55 });
        gsap.to(p, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.out', scrollTrigger: { trigger: svg, start: 'top 78%' } });
      });
      // source nodes blink in
      gsap.from(nodes, {
        opacity: 0, scale: 0.4, transformOrigin: 'center', duration: 0.5, stagger: 0.08, ease: 'back.out(2)',
        scrollTrigger: { trigger: svg, start: 'top 80%' },
      });
      // animated packets traveling along the main flows
      svg.querySelectorAll<SVGElement>('.packet').forEach((pkt, i) => {
        const path = flows[i % flows.length];
        if (!path) return;
        const len = path.getTotalLength();
        const obj = { d: 0 };
        gsap.to(obj, {
          d: len, duration: 2.4 + i * 0.3, ease: 'none', repeat: -1, delay: 0.6 + i * 0.4,
          onUpdate: () => {
            const pt = path.getPointAtLength(obj.d);
            pkt.setAttribute('transform', `translate(${pt.x},${pt.y})`);
            (pkt as SVGElement).style.opacity = obj.d < 8 || obj.d > len - 8 ? '0' : '1';
          },
        });
      });
      // lost dot pulse
      if (lostDot) gsap.to(lostDot, { opacity: 0.25, scale: 1.6, transformOrigin: 'center', duration: 1.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, svg);

    return () => ctx.revert();
  }, []);

  const sources = [
    { y: 40, label: 'FORM' },
    { y: 95, label: 'EMAIL' },
    { y: 150, label: 'CRM' },
    { y: 205, label: 'ADS' },
    { y: 260, label: 'REFERRAL' },
  ];

  return (
    // solid dark panel so the diagram reads on light sections too
    <div className="relative aspect-[4/3] w-full border border-border bg-[#0A0A0A]">
      <div className="absolute inset-0 dot-grid opacity-50" />
      <svg ref={ref} viewBox="0 0 600 300" className="relative h-full w-full" fill="none">
        {/* source nodes */}
        {sources.map((s, i) => (
          <g key={i} className="src-node">
            <rect x="24" y={s.y - 12} width="86" height="24" stroke="#2A2A2A" fill="#0D0D0D" />
            <text x="67" y={s.y + 3} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="#6B6B6B">{s.label}</text>
          </g>
        ))}

        {/* healthy flows → record */}
        <path className="flow draw-path" d="M110 40 C 250 40, 280 140, 430 150" stroke="#DC143C" strokeWidth="1.4" opacity="0.85" />
        <path className="flow draw-path" d="M110 95 C 250 95, 300 150, 430 150" stroke="#4ADE80" strokeWidth="1.4" opacity="0.7" />
        <path className="flow draw-path" d="M110 150 C 240 150, 300 150, 430 150" stroke="#4ADE80" strokeWidth="1.4" opacity="0.7" />

        {/* stale / lost flows that fray off */}
        <path className="flow-stale draw-path" d="M110 205 C 240 205, 300 250, 360 270" stroke="#6B6B6B" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.6" />
        <path className="flow-stale draw-path" d="M110 260 C 220 260, 280 240, 340 250" stroke="#6B6B6B" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.6" />

        {/* record node */}
        <g>
          <rect x="430" y="124" width="120" height="52" stroke="#DC143C" fill="#120406" />
          <text x="490" y="146" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1" fill="#EFEFEF">ATS / CRM</text>
          <text x="490" y="162" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1" fill="#6B6B6B">RECORD</text>
        </g>

        {/* lost marker */}
        <g>
          <circle className="lost-dot" cx="360" cy="270" r="5" fill="#DC143C" opacity="0.7" />
          <text x="372" y="274" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1" fill="#6B6B6B">STALE · NO OWNER</text>
        </g>

        {/* traveling packets */}
        <circle className="packet" r="2.6" fill="#fff" opacity="0" />
        <circle className="packet" r="2.6" fill="#4ADE80" opacity="0" />
        <circle className="packet" r="2.6" fill="#fff" opacity="0" />
      </svg>
    </div>
  );
}
