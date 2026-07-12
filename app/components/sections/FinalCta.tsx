'use client';
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { SITE } from '@/lib/constants';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';
import Drift from '@/components/ui/Drift';

// EmailJS wiring - set these in .env.local (all safe to expose client-side):
//   NEXT_PUBLIC_EMAILJS_SERVICE_ID / _TEMPLATE_ID / _PUBLIC_KEY
// Without them the form falls back to opening the visitor's email app.
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'mailto';

export default function FinalCta() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      // Not configured yet - hand off to the visitor's email app instead.
      const data = new FormData(form);
      const body = [
        `Name: ${data.get('name')}`,
        `Work email: ${data.get('email')}`,
        `ATS / CRM: ${data.get('ats')}`,
        '',
        `${data.get('message')}`,
      ].join('\n');
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Workflow fit call')}&body=${encodeURIComponent(body)}`;
      setStatus('mailto');
      return;
    }

    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, { publicKey: PUBLIC_KEY });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" data-nav="dark" className="section-dark section-screen relative overflow-hidden border-t border-border">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(220,20,60,0.12), transparent 60%)' }} />
      <Drift className="dot-grid opacity-40" />

      <div className="section-shell relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
          {/* pitch */}
          <div>
            <Eyebrow index="09" className="mb-6">Get Started</Eyebrow>
            <Reveal as="h2" className="display-hero text-text-primary" y={40}>
              Stop chasing.<br /><span className="text-gradient-crimson">Start shipping</span> work.
            </Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-md text-base leading-relaxed text-text-secondary">
              Book a workflow fit call. We’ll look at how inquiries move from form and inbox to an owner and a follow-up - and where work is leaking today.
            </Reveal>
            <Reveal stagger={0.08} className="mt-8 space-y-2.5">
              {['Free / discounted founding diagnostic', 'A 1-3 page flow map with the top leak points', 'A recommended build scope, timeline, and price range'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-sm text-text-secondary">
                  <Check className="h-4 w-4 flex-shrink-0 text-crimson" strokeWidth={2.5} /> {t}
                </div>
              ))}
            </Reveal>
          </div>

          {/* form */}
          <Reveal as="div" className="border border-border bg-bg-subtle/70 p-7 backdrop-blur-sm">
            {status === 'sent' ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <span className="flex h-12 w-12 items-center justify-center bg-crimson/15 text-crimson"><Check className="h-6 w-6" /></span>
                <p className="mt-4 heading-md text-text-primary">Thanks - we’ll be in touch.</p>
                <p className="mt-2 text-sm text-text-muted">We reply to fit-call requests within one business day.</p>
              </div>
            ) : (
              <form ref={formRef} className="space-y-4" onSubmit={onSubmit}>
                <Field label="Name" name="name" placeholder="Your name" required />
                <Field label="Work email" name="email" type="email" placeholder="you@company.com" required />
                <Field label="ATS / CRM you use" name="ats" placeholder="Bullhorn, HubSpot, …" />
                <div>
                  <label htmlFor="message" className="mono-meta mb-2 block text-text-muted">Where do inquiries get stuck?</label>
                  <textarea
                    id="message" name="message" rows={3}
                    className="w-full resize-none border border-border-strong bg-bg-primary px-3.5 py-3 text-sm text-text-primary placeholder:text-text-faint focus:border-crimson focus:outline-none"
                    placeholder="A sentence or two is plenty."
                  />
                </div>
                <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-70">
                  {status === 'sending'
                    ? <>Sending <LoaderCircle className="h-4 w-4 animate-spin" /></>
                    : <>{SITE.ctaPrimary} <ArrowRight className="h-4 w-4" /></>}
                </button>
                {status === 'error' && (
                  <p className="text-center font-mono text-[11px] uppercase tracking-[0.1em] text-crimson" role="alert">
                    Something went wrong - email us at{' '}
                    <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a>
                  </p>
                )}
                {status === 'mailto' && (
                  <p className="text-center font-mono text-[11px] uppercase tracking-[0.1em] text-text-muted" role="status">
                    Your email app should open - or write to{' '}
                    <a href={`mailto:${SITE.email}`} className="text-crimson underline">{SITE.email}</a>
                  </p>
                )}
                {status !== 'error' && status !== 'mailto' && (
                  <p className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint">No spam · No autonomous outreach</p>
                )}
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = 'text', placeholder, required = false }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mono-meta mb-2 block text-text-muted">{label}</label>
      <input
        id={name} name={name} type={type} placeholder={placeholder} required={required}
        className="w-full border border-border-strong bg-bg-primary px-3.5 py-3 text-sm text-text-primary placeholder:text-text-faint focus:border-crimson focus:outline-none"
      />
    </div>
  );
}
