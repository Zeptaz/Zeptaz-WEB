'use client';
import { INTEGRATIONS } from '@/lib/constants';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import IntegrationLogo from '@/components/ui/IntegrationLogo';

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  // Duplicate the set so translateX(-50%) loops seamlessly.
  const seq = [...items, ...items];
  return (
    <div className="overflow-hidden">
      {/* py-2 gives the hover lift room so the top border isn't clipped.
          `active:` is the touch equivalent of the hover pause - press and hold
          to stop the track, since a phone has no hover to pause with. */}
      <div
        className={`marquee-track flex w-max items-center gap-4 py-2 hover:[animation-play-state:paused] active:[animation-play-state:paused] ${
          reverse ? '[animation-direction:reverse]' : ''
        }`}
      >
        {seq.map((name, i) => (
          <IntegrationLogo key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

export default function Integrations() {
  // Reduce Motion: don't show a clipped/frozen marquee - lay every logo out in a
  // wrapped grid so all tools stay visible.
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return (
    <section id="integrations" data-nav="dark" className="section-dark section-screen relative overflow-hidden border-t border-border">
      <div className="section-shell relative">
        <div className="max-w-2xl">
          <Eyebrow index="05" className="mb-6">Integrations</Eyebrow>
          <Reveal as="h2" className="heading-lg max-w-[20ch] text-text-primary">
            We connect the tools your team already uses.
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-5 max-w-xl text-sm leading-relaxed text-text-secondary">
            Connector-first: no-code / low-code connector where possible, native webhook or API where needed. Every project passes a compatibility and access check before we build.
          </Reveal>
        </div>

        {/* Reduce Motion → wrapped grid (all logos visible, no motion).
            Otherwise → two full-width rows drifting in opposite directions. */}
        {reduced ? (
          <Reveal className="mt-12 flex flex-wrap gap-4">
            {INTEGRATIONS.map((name) => (
              <IntegrationLogo key={name} name={name} />
            ))}
          </Reveal>
        ) : (
          <Reveal className="marquee-mask mt-12 flex flex-col gap-4">
            <Row items={INTEGRATIONS} />
            <Row items={[...INTEGRATIONS].reverse()} reverse />
          </Reveal>
        )}
      </div>
    </section>
  );
}
