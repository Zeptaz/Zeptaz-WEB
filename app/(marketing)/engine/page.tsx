import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { HERO } from '@/lib/constants';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import Eyebrow from '@/components/ui/Eyebrow';
import StatCounter from '@/components/ui/StatCounter';
import ModuleSpine from '@/components/sections/ModuleSpine';

export const metadata: Metadata = {
  title: 'The Engine - Zeptaz',
  description:
    'The anatomy of the connected engine: 11 dependency-locked modules from inquiry intake to reporting, what each one does, and which build tier includes it.',
};

export default function EnginePage() {
  return (
    <>
      <PageHero
        eyebrow="The Engine"
        title="One connected engine, not a menu."
        lead="Each module builds on the accuracy of the one before it. This page is the anatomy: what every station does, why it can’t be skipped, and which build tier includes it."
      />

      {/* stats band */}
      <section data-nav="dark" className="section-dark relative overflow-hidden border-t border-border">
        <div className="section-shell grid gap-px overflow-hidden border-x border-border bg-border sm:grid-cols-3">
          {HERO.stats.map((s) => (
            <div key={s.label} className="flex flex-col items-start gap-2 bg-bg-primary px-8 py-10">
              <span className="display-stat text-5xl font-bold text-text-primary">
                <StatCounter value={s.value} suffix={s.suffix} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="section-shell pb-8 pt-5">
          <a
            href="/#engine"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted transition-colors hover:text-crimson"
          >
            See the engine in motion on the home page <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <ModuleSpine />

      {/* why dependency-locked */}
      <section data-nav="light" className="section-light relative border-t border-ink-border py-24">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Eyebrow tone="light" className="mb-6">Anti-Cherry-Picking</Eyebrow>
            <h2 className="heading-xl text-ink">Why you can’t skip stations.</h2>
          </div>
          <div className="space-y-6 border-l border-ink-border pl-8">
            <p className="max-w-2xl text-base leading-relaxed text-ink-secondary">
              An AI draft written from an incomplete record is a bad draft. A follow-up task with no named owner is a task nobody does. A report built on inconsistent records is fiction with a chart. Every module on the spine exists because the one after it fails without it.
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-ink-secondary">
              That’s why our packages set <span className="text-ink font-semibold">reach, not composition</span>. Starter, Growth, and Scale run the same route with more stations switched on - you never remove a load-bearing step to hit a price point, because six months later that’s the step whose absence you’re paying for.
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-ink-secondary">
              Two stations deliberately stay under human control: AI response drafts wait for a person to approve them, and stale inquiries are raised to a person instead of being auto-archived. The system prepares; your team decides.
            </p>
          </div>
        </div>
      </section>

      <CtaBand title="Build the connected engine." />
    </>
  );
}
