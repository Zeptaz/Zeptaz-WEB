import { siHubspot, siGmail, siZapier, siMake, siN8n, siNotion, siQuickbooks } from 'simple-icons';
import type { CSSProperties } from 'react';

/**
 * One integration "pill" for the marquee. Renders the official monochrome logo
 * via simple-icons where available, otherwise a clean wordmark. Both rest as
 * muted grey and shift to the brand color (lightened so it reads on the dark
 * surface) + a slight lift on hover.
 *
 * Slack / Salesforce / Microsoft Teams were removed from simple-icons at those
 * brands' request, so they show as wordmarks. Drop an SVG path into LOCAL_PATHS
 * (or the brand into WORDMARK_HEX) to upgrade any of them.
 */

type Icon = { path: string; hex: string; title: string };

// simple-icons that resolve in the installed version.
const ICONS: Record<string, Icon> = {
  HubSpot: siHubspot,
  Gmail: siGmail,
  Zapier: siZapier,
  Make: siMake,
  n8n: siN8n,
  Notion: siNotion,
  QuickBooks: siQuickbooks,
};

// Local SVG path overrides (24x24 viewBox, evenodd) for brands simple-icons no
// longer ships. Slack & Salesforce are the official single-path marks (ported
// from the V1 site); Microsoft Teams is a clean custom glyph - swap if needed.
const LOCAL_PATHS: Record<string, { path: string; hex: string }> = {
  Slack: {
    hex: 'E01E5A',
    path: 'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z',
  },
  Salesforce: {
    hex: '00A1E0',
    path: 'M10.002 3.284c.924-1.006 2.232-1.636 3.685-1.636 1.972 0 3.695 1.08 4.647 2.69a6.153 6.153 0 0 1 2.443-.504c3.432 0 6.216 2.795 6.216 6.24 0 3.448-2.784 6.243-6.216 6.243-.424 0-.838-.045-1.236-.127a4.737 4.737 0 0 1-4.22 2.603c-.656 0-1.279-.135-1.843-.377A5.24 5.24 0 0 1 8.784 21.6C6.11 21.6 3.86 19.725 3.35 17.19a4.74 4.74 0 0 1-.85.077C1.121 17.267 0 16.13 0 14.75a2.5 2.5 0 0 1 .85-1.892A5.25 5.25 0 0 1 .76 11.4c0-2.907 2.357-5.265 5.264-5.265.73 0 1.426.148 2.058.415.44-.756 1.07-1.39 1.92-1.266z',
  },
  'Microsoft Teams': {
    hex: '6264A7',
    path: 'M9 7.5H15A2.4 2.4 0 0 1 17.4 9.9V16.1A2.4 2.4 0 0 1 15 18.5H9A2.4 2.4 0 0 1 6.6 16.1V9.9A2.4 2.4 0 0 1 9 7.5ZM8.7 9.9V11.6H11.15V16.4H12.85V11.6H15.3V9.9H8.7ZM15.8 2.6A2.3 2.3 0 1 1 15.8 7.2A2.3 2.3 0 0 1 15.8 2.6Z',
  },
};

function relLum(hex: string): number {
  const c = hex.replace('#', '');
  const ch = (i: number) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(0) + 0.7152 * ch(2) + 0.0722 * ch(4);
}

/** Keep the brand hue but ensure it's bright enough on #080808. */
function readableOnDark(hex: string): string {
  if (relLum(hex) >= 0.3) return hex;
  const c = hex.replace('#', '');
  const mix = (i: number) => {
    const v = parseInt(c.slice(i, i + 2), 16);
    return Math.round(v + (255 - v) * 0.55);
  };
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h(mix(0))}${h(mix(2))}${h(mix(4))}`;
}

export default function IntegrationLogo({ name }: { name: string }) {
  const shape = LOCAL_PATHS[name] ?? ICONS[name];
  const brand = readableOnDark(`#${(shape?.hex ?? 'EFEFEF').replace('#', '')}`);

  return (
    <div
      style={{ '--brand': brand } as CSSProperties}
      className="group flex shrink-0 items-center gap-3.5 border border-border bg-bg-subtle/70 px-7 py-5 text-text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:text-[var(--brand)]"
    >
      {shape && (
        <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0" fill="currentColor" aria-hidden>
          <path d={shape.path} fillRule="evenodd" clipRule="evenodd" />
        </svg>
      )}
      <span className="whitespace-nowrap font-mono text-[14px] uppercase tracking-[0.1em]">{name}</span>
    </div>
  );
}
