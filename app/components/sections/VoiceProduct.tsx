import Link from 'next/link';
import { Languages, MessageSquareText, CalendarCheck, ShoppingBag } from 'lucide-react';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import Drift from '@/components/ui/Drift';

const POINTS = [
  { icon: Languages, label: 'Sinhala, Tamil, English' },
  { icon: MessageSquareText, label: 'Answers customer questions' },
  { icon: CalendarCheck, label: 'Books appointments' },
  { icon: ShoppingBag, label: 'Takes orders' },
];

/** Compact product band on the home page - the full story lives on the product page. */
export default function VoiceProduct() {
  return (
    <section
      id="voice"
      data-nav="dark"
      className="section-dark relative overflow-hidden border-t border-border py-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 20% 30%, rgb(220 20 60 / calc(0.10 * var(--glow-strength))), transparent 60%)' }}
      />
      <Drift className="grid-lines opacity-25" />

      <div className="section-shell relative">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow className="mb-6">New · Product</Eyebrow>
            <Reveal as="h2" className="heading-xl text-text-primary">
              Zeptaz Voice — AI phone agents that{' '}
              <span className="text-gradient-crimson">get routine calls handled.</span>
            </Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
              The same operator-first approach, applied to the phone. Zeptaz Voice answers
              questions, books appointments, and takes orders in Sinhala, Tamil, and English -
              with human handoffs and every outcome visible to your team.
            </Reveal>

            <Reveal delay={0.1} className="mt-9 flex flex-wrap gap-3">
              <Link href="/products/voice-agent" className="btn btn-primary">Explore Zeptaz Voice</Link>
              <Link href="/products/voice-agent#demo" className="btn btn-ghost-dark">Try the voice demo</Link>
            </Reveal>
          </div>

          <Reveal stagger={0.08} className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {POINTS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="flex flex-col gap-4 bg-bg-primary p-6">
                  <span className="flex h-9 w-9 items-center justify-center border border-border-strong text-crimson">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="text-sm leading-relaxed text-text-secondary">{p.label}</span>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
