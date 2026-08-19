'use client';
import { useMemo, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { SITE } from '@/lib/constants';
import {
  VOICE_PILOT_STEPS,
  VOICE_PILOT_TERMS,
  VOICE_CALL_VOLUMES,
  VOICE_WORKFLOW_OPTIONS,
} from '@/lib/voice';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

// Same EmailJS wiring as components/sections/FinalCta.tsx - one inbox, one
// template. Without the keys the form falls back to the visitor's email app.
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'mailto';

export default function VoicePilot() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [invalid, setInvalid] = useState(false);
  const [firstName, setFirstName] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [volume, setVolume] = useState('');
  const [workflow, setWorkflow] = useState('');
  const [problem, setProblem] = useState('');
  const [consent, setConsent] = useState(false);

  // The shared EmailJS template maps name / email / ats / message, so the
  // voice-specific answers ride along in the `ats` slot as one summary line.
  const summary = useMemo(
    () =>
      [
        'Zeptaz Voice pilot',
        company || '—',
        volume ? `${volume} calls/mo` : 'volume not given',
        workflow || 'workflow not chosen',
      ].join(' · '),
    [company, volume, workflow],
  );

  const valid =
    name.trim() !== '' &&
    email.includes('@') &&
    company.trim() !== '' &&
    workflow !== '' &&
    problem.trim() !== '' &&
    consent;

  const reset = () => {
    setStatus('idle');
    setInvalid(false);
    setName(''); setEmail(''); setCompany(''); setVolume(''); setWorkflow('');
    setProblem(''); setConsent(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid) { setInvalid(true); return; }
    setInvalid(false);
    setFirstName(name.trim().split(/\s+/)[0]);

    const form = e.currentTarget;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      const body = [
        `Name: ${name}`,
        `Work email: ${email}`,
        `Company: ${company}`,
        `Approx. monthly calls: ${volume || 'not given'}`,
        `First workflow: ${workflow}`,
        '',
        problem,
      ].join('\n');
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Zeptaz Voice - workflow assessment')}&body=${encodeURIComponent(body)}`;
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
    <section
      id="apply"
      data-nav="light"
      className="section-light relative overflow-hidden border-t border-ink-border py-24"
    >
      <div className="section-shell relative">
        <div className="max-w-2xl">
          <Eyebrow index="05" tone="light" className="mb-6">Start a Pilot</Eyebrow>
          <Reveal as="h2" className="heading-xl text-ink">Start with one workflow.</Reveal>
          <Reveal as="p" delay={0.05} className="mt-6 text-base leading-relaxed text-ink-secondary">
            We define the scope, integrations, escalation rules, and success measures before any
            live calls.
          </Reveal>
        </div>

        {/* pilot process */}
        <Reveal
          stagger={0.08}
          className="mt-12 grid gap-px overflow-hidden border border-ink-border bg-ink-border sm:grid-cols-3"
        >
          {VOICE_PILOT_STEPS.map((s) => (
            <div key={s.n} className="bg-paper p-7">
              <span className="font-mono text-[10px] tracking-[0.18em] text-crimson">{s.n}</span>
              <h3 className="mt-4 heading-md text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{s.desc}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* pilot fit */}
          <div>
            <p className="mono-meta text-ink-muted">Pilot fit</p>
            <Reveal as="h3" className="mt-3 heading-lg text-ink">A clear call. A measurable outcome.</Reveal>
            <Reveal as="p" delay={0.05} className="mt-5 max-w-md text-base leading-relaxed text-ink-secondary">
              The best pilots begin with one repeatable call, a human escalation owner, and an
              agreed definition of success.
            </Reveal>

            <Reveal stagger={0.08} className="mt-9 grid gap-px border border-ink-border bg-ink-border sm:grid-cols-2">
              {VOICE_PILOT_TERMS.map((t) => (
                <div key={t.label} className="bg-paper p-6">
                  <p className="mono-meta text-crimson">{t.label}</p>
                  <ul className="mt-4 space-y-2.5">
                    {t.items.map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-secondary">
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-crimson" strokeWidth={2.5} />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
          </div>

          {/* assessment form */}
          <Reveal as="div" delay={0.1} className="border border-ink-border-strong bg-paper p-7">
            {status === 'sent' ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="flex h-12 w-12 items-center justify-center bg-crimson/12 text-crimson">
                  <Check className="h-6 w-6" />
                </span>
                <p className="mt-4 heading-md text-ink">Thanks, {firstName}.</p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-secondary">
                  We’ll come back within one business day to map your call workflow and confirm
                  whether it’s a good first pilot.
                </p>
                <button type="button" onClick={reset} className="btn btn-ghost-light mt-7">
                  Send another
                </button>
              </div>
            ) : (
              <form ref={formRef} className="space-y-4" onSubmit={onSubmit} noValidate>
                <p className="mono-meta mb-6 text-ink-muted">Workflow assessment</p>

                <Field label="Your name" name="name" value={name} onChange={setName} placeholder="Nimal Perera" />
                <Field label="Work email" name="email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
                <Field label="Company" name="company" value={company} onChange={setCompany} placeholder="Your company" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Select label="Approx. monthly calls" name="volume" value={volume} onChange={setVolume} placeholder="Select range" options={VOICE_CALL_VOLUMES} />
                  <Select label="First workflow" name="workflow" value={workflow} onChange={setWorkflow} placeholder="Select a workflow" options={VOICE_WORKFLOW_OPTIONS} />
                </div>

                <div>
                  <label htmlFor="message" className="mono-meta mb-2 block text-ink-muted">
                    Where do calls get stuck today?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full resize-none border border-ink-border-strong bg-paper-2 px-3.5 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-crimson focus:outline-none"
                    placeholder="Tell us what callers need and what your team currently does by hand."
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 pt-1 text-sm leading-relaxed text-ink-secondary">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#DC143C]"
                  />
                  I agree that Zeptaz may contact me about a workflow assessment and pilot.
                </label>

                {/* carried into the shared EmailJS template */}
                <input type="hidden" name="ats" value={summary} readOnly />

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-70"
                >
                  {status === 'sending'
                    ? <>Sending <LoaderCircle className="h-4 w-4 animate-spin" /></>
                    : <>Request a workflow assessment <ArrowRight className="h-4 w-4" /></>}
                </button>

                {invalid && (
                  <p className="text-center font-mono text-[11px] uppercase tracking-[0.1em] text-crimson" role="alert">
                    Complete the required fields and consent before continuing.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-center font-mono text-[11px] uppercase tracking-[0.1em] text-crimson" role="alert">
                    Something went wrong - email us at{' '}
                    <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a>
                  </p>
                )}
                {status === 'mailto' && (
                  <p className="text-center font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted" role="status">
                    Your email app should open - or write to{' '}
                    <a href={`mailto:${SITE.email}`} className="text-crimson underline">{SITE.email}</a>
                  </p>
                )}
                {!invalid && status !== 'error' && status !== 'mailto' && (
                  <p className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                    No spam · No autonomous outreach
                  </p>
                )}
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, name, type = 'text', value, onChange, placeholder,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mono-meta mb-2 block text-ink-muted">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-ink-border-strong bg-paper-2 px-3.5 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-crimson focus:outline-none"
      />
    </div>
  );
}

function Select({
  label, name, value, onChange, placeholder, options,
}: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; placeholder: string; options: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mono-meta mb-2 block text-ink-muted">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border border-ink-border-strong bg-paper-2 px-3.5 py-3 text-sm text-ink focus:border-crimson focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
