import type { Metadata } from 'next';
import { SITE, STORY, DIFFERENTIATORS } from '@/lib/constants';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import ChannelChaos from '@/components/illustrations/ChannelChaos';
import Team from '@/components/sections/Team';
import Faq from '@/components/sections/Faq';

export const metadata: Metadata = {
  title: 'About Zeptaz',
  description:
    'Why Zeptaz exists, the principles every build follows, and the founding team. Operator-first, human-approved, and skeptical of hype.',
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        tone="light"
        eyebrow="About Zeptaz"
        title="The people behind the system."
        lead={`${SITE.tagline}. Operator-first, human-approved, and built to be reliable inside your stack.`}
      />

      {/* story + the problem we kept seeing */}
      <section data-nav="light" className="section-light relative border-t border-ink-border py-24">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Eyebrow tone="light" className="mb-6">Our story</Eyebrow>
              <h2 className="heading-xl text-ink">Reliable systems over hype.</h2>
            </div>
            <div className="space-y-6 border-l border-ink-border pl-8">
              {STORY.map((p) => (
                <Reveal as="p" key={p.slice(0, 24)} className="max-w-2xl text-base leading-relaxed text-ink-secondary">{p}</Reveal>
              ))}
              <Reveal className="pt-4">
                <div className="mono-meta mb-3 text-ink-muted">The pattern we kept seeing</div>
                <ChannelChaos />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* operating principles - quiet ledger, not the home tablist */}
      <section data-nav="dark" className="section-dark relative overflow-hidden border-t border-border py-24">
        <div className="section-shell">
          <div className="max-w-3xl">
            <Eyebrow className="mb-6">Operating Principles</Eyebrow>
            <Reveal as="h2" className="heading-xl text-text-primary">Six things we refuse to be.</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
              Every build gets held against these. They cost us some projects - that’s the point.
            </Reveal>
          </div>
          <Reveal stagger={0.06} className="mt-12 border-t border-border">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.no} className="grid gap-2 border-b border-border py-6 sm:grid-cols-[64px_260px_minmax(0,1fr)] sm:gap-8">
                <span className="font-mono text-[11px] tracking-[0.18em] text-crimson">{d.no}</span>
                <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-faint line-through decoration-text-faint/60">
                  {d.not}
                </span>
                <div>
                  <div className="text-[15px] font-semibold text-text-primary">{d.title}</div>
                  <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-text-muted">{d.desc}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Team />
      <Faq topic="general" />
      <CtaBand title="Work with us." lead="Book a workflow fit call and we will map where work is leaking, then recommend a build scope, timeline, and price range." />
    </>
  );
}
