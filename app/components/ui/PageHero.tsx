import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/constants';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

/** Compact page header used at the top of every sub-page. */
export default function PageHero({
  eyebrow,
  title,
  lead,
  tone = 'dark',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead: string;
  tone?: 'dark' | 'light';
}) {
  const light = tone === 'light';
  return (
    <section
      data-nav={tone}
      className={cn(
        'relative flex min-h-[58vh] items-center overflow-hidden pb-16 pt-32',
        light ? 'section-light border-b border-ink-border' : 'section-dark border-b border-border',
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 20%, rgb(220 20 60 / calc(0.08 * var(--glow-strength))), transparent 60%)' }}
      />
      <div className="section-shell relative">
        {eyebrow && <Eyebrow tone={tone} className="mb-6">{eyebrow}</Eyebrow>}
        <Reveal as="h1" className={cn('display-hero max-w-[18ch]', light ? 'text-ink' : 'text-text-primary')}>
          {title}
        </Reveal>
        <Reveal as="p" delay={0.05} className={cn('mt-6 max-w-2xl text-base leading-relaxed', light ? 'text-ink-secondary' : 'text-text-secondary')}>
          {lead}
        </Reveal>
        <Reveal as="div" delay={0.1} className="mt-9">
          <Link href="/contact" className="btn btn-primary">{SITE.ctaPrimary}</Link>
        </Reveal>
      </div>
    </section>
  );
}
