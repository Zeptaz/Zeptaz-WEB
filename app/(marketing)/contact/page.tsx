import type { Metadata } from 'next';
import { Mail, Clock, ShieldCheck } from 'lucide-react';
import { SITE } from '@/lib/constants';
import FinalCta from '@/components/sections/FinalCta';

export const metadata: Metadata = {
  title: 'Contact - Zeptaz',
  description:
    'Book a workflow fit call. We look at how inquiries move from form and inbox to an owner and a follow-up, and where work is leaking today.',
};

const INFO = [
  { icon: Mail, title: 'Email', desc: SITE.email },
  { icon: Clock, title: 'Response time', desc: 'We reply to fit-call requests within one business day.' },
  { icon: ShieldCheck, title: 'No autonomous outreach', desc: 'No spam, no cold sending. AI stays human-approved.' },
];

export default function ContactPage() {
  return (
    <>
      <div className="pt-16">
        <FinalCta />
      </div>

      <section data-nav="dark" className="section-dark relative overflow-hidden border-t border-border py-20">
        <div className="section-shell">
          <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            {INFO.map((it) => {
              const Icon = it.icon;
              return (
                <div key={it.title} className="flex flex-col bg-bg-primary p-7">
                  <span className="flex h-10 w-10 items-center justify-center border border-border-strong text-crimson">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div className="mt-5 text-[14px] font-semibold text-text-primary">{it.title}</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-text-muted">{it.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
