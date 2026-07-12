'use client';
/**
 * Isometric line-art set, one per service. Ink strokes on light paper with a
 * crimson accent. Designed for the Service Categories cards; CSS hover handled
 * by the parent (.group). Stroke parts tagged with .iso-accent / .iso-float
 * for subtle motion.
 */

const STROKE = '#0C0C0C';
const FAINT = '#B6B1A6';
const CRIMSON = '#DC143C';

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 240 200" fill="none" className="h-full w-full">
      {children}
    </svg>
  );
}

/* Recruitment - candidate cards routed into a tray */
function Recruitment() {
  return (
    <Frame>
      <g stroke={STROKE} strokeWidth="1.5">
        <path d="M60 70 L120 40 L180 70 L120 100 Z" fill="#E9E6DF" />
        <path className="iso-float" d="M70 58 L120 34 L170 58 L120 82 Z" fill="#F1EFEA" />
        <circle cx="120" cy="56" r="9" fill="none" />
        <path d="M108 70 q12 -10 24 0" />
      </g>
      <g stroke={FAINT} strokeWidth="1.25">
        <path d="M120 100 L120 140" strokeDasharray="3 4" />
        <path d="M120 130 L70 158" strokeDasharray="3 4" />
        <path d="M120 130 L170 158" strokeDasharray="3 4" />
      </g>
      <g stroke={STROKE} strokeWidth="1.5">
        <path d="M44 158 L70 144 L96 158 L70 172 Z" fill="#E9E6DF" />
        <path d="M144 158 L170 144 L196 158 L170 172 Z" fill="#E9E6DF" />
      </g>
      <circle className="iso-accent" cx="120" cy="130" r="4" fill={CRIMSON} />
    </Frame>
  );
}

/* Sales - pipeline bars / routing switch */
function Sales() {
  return (
    <Frame>
      <g stroke={STROKE} strokeWidth="1.5">
        <path d="M40 150 L90 122 L90 90 L40 118 Z" fill="#F1EFEA" />
        <path d="M40 150 L90 122 L140 150 L90 178 Z" fill="#E9E6DF" />
        <path d="M90 122 L140 94 L140 150" fill="none" />
        <path d="M90 90 L140 62 L140 94 L90 122 Z" fill="#F1EFEA" />
        <path d="M140 62 L190 90 L190 122 L140 150" fill="none" />
        <path d="M140 62 L190 34 L190 66 L140 94 Z" fill="#F1EFEA" />
      </g>
      <path className="iso-accent" d="M52 112 L96 86" stroke={CRIMSON} strokeWidth="2" />
      <circle className="iso-accent" cx="96" cy="86" r="4" fill={CRIMSON} />
      <path d="M150 78 L188 56" stroke={FAINT} strokeWidth="1.25" strokeDasharray="3 4" />
    </Frame>
  );
}

/* Onboarding - checklist clipboard */
function Onboarding() {
  return (
    <Frame>
      <g stroke={STROKE} strokeWidth="1.5">
        <path className="iso-float" d="M80 50 L150 50 L168 150 L98 150 Z" fill="#F1EFEA" />
        <path d="M100 58 L138 58" />
        <path d="M103 80 L150 80" />
        <path d="M106 100 L152 100" />
        <path d="M109 120 L154 120" />
      </g>
      <g stroke={CRIMSON} strokeWidth="2" className="iso-accent">
        <path d="M88 76 l5 6 l9 -12" />
        <path d="M91 96 l5 6 l9 -12" />
      </g>
      <g stroke={FAINT} strokeWidth="1.5">
        <path d="M94 116 l5 6 l9 -12" />
      </g>
    </Frame>
  );
}

/* Marketing Ops - campaign board with broadcast nodes */
function Marketing() {
  return (
    <Frame>
      <g stroke={STROKE} strokeWidth="1.5">
        <path d="M70 110 L120 84 L170 110 L120 136 Z" fill="#E9E6DF" />
        <path className="iso-float" d="M96 70 L120 58 L144 70 L120 82 Z" fill="#F1EFEA" />
        <path d="M120 82 L120 100" />
      </g>
      <g stroke={FAINT} strokeWidth="1.25">
        <path d="M120 110 L62 140" strokeDasharray="3 4" />
        <path d="M120 110 L120 152" strokeDasharray="3 4" />
        <path d="M120 110 L178 140" strokeDasharray="3 4" />
      </g>
      <g fill={STROKE}>
        <circle cx="62" cy="140" r="3.5" />
        <circle cx="178" cy="140" r="3.5" />
      </g>
      <circle className="iso-accent" cx="120" cy="152" r="4.5" fill={CRIMSON} />
      <circle className="iso-accent" cx="120" cy="62" r="3.5" fill={CRIMSON} />
    </Frame>
  );
}

/* Reporting & Docs - document with chart */
function Reporting() {
  return (
    <Frame>
      <g stroke={STROKE} strokeWidth="1.5">
        <path d="M86 46 L150 46 L170 70 L170 154 L86 154 Z" fill="#F1EFEA" />
        <path d="M150 46 L150 70 L170 70" />
        <path d="M98 66 L132 66" stroke={FAINT} />
      </g>
      <g stroke={STROKE} strokeWidth="1.5">
        <path d="M100 138 L100 110" />
        <path d="M118 138 L118 96" />
        <path d="M136 138 L136 118" />
        <path className="iso-accent" d="M154 138 L154 84" stroke={CRIMSON} strokeWidth="2" />
        <path d="M96 138 L160 138" />
      </g>
      <circle className="iso-accent" cx="154" cy="84" r="4" fill={CRIMSON} />
    </Frame>
  );
}

const MAP: Record<string, () => React.ReactElement> = {
  recruitment: Recruitment,
  sales: Sales,
  onboarding: Onboarding,
  'marketing-ops': Marketing,
  'reporting-documents': Reporting,
};

export default function IsoArt({ variant }: { variant: string }) {
  const Comp = MAP[variant] ?? Recruitment;
  return <Comp />;
}
