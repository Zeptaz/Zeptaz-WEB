import Link from 'next/link';
import { SITE } from '@/lib/constants';

/** Shared closing CTA used at the bottom of sub-pages. */
export default function CtaBand({
  title = 'Ready to stop chasing work?',
  lead = 'Book a workflow fit call. We look at how inquiries move from form and inbox to an owner and a follow-up, and where work is leaking today.',
  eyebrow,
  primary,
  secondary,
}: {
  title?: string;
  lead?: string;
  eyebrow?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section data-nav="dark" className="section-dark relative overflow-hidden border-t border-border py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgb(220 20 60 / calc(0.12 * var(--glow-strength))), transparent 60%)' }}
      />
      <div className="section-shell relative text-center">
        {eyebrow && <span className="eyebrow mb-6 text-crimson">{eyebrow}</span>}
        <h2 className="display-hero mx-auto max-w-[16ch] text-text-primary">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary">{lead}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={primary?.href ?? '/contact'} className="btn btn-primary">{primary?.label ?? SITE.ctaPrimary}</Link>
          {secondary && <Link href={secondary.href} className="btn btn-ghost-dark">{secondary.label}</Link>}
        </div>
      </div>
    </section>
  );
}
