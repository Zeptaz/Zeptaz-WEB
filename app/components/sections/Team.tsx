'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { TEAM } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Eyebrow from '@/components/ui/Eyebrow';
import Reveal from '@/components/ui/Reveal';

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Team() {
  // Touch devices have no hover - tapping a portrait toggles its overlay.
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="team" data-nav="light" className="section-light section-screen relative overflow-hidden border-t border-ink-border">
      <div className="section-shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:items-center lg:gap-14">
          {/* intro */}
          <div>
            <Eyebrow index="08" tone="light" className="mb-6">The Team</Eyebrow>
            <Reveal as="h2" className="heading-xl text-ink">People behind the system.</Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-md text-base leading-relaxed text-ink-secondary">
              A small, hands-on founding crew of builders and operators. We build the first systems ourselves - and document every reusable module as we go.
            </Reveal>
            <Reveal as="a" delay={0.1} className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink hover:text-crimson" href="#contact">
              Work with us <ArrowRight className="h-3.5 w-3.5" />
            </Reveal>
          </div>

          {/* Portraits. On sm+ the overlay reveals the detail on hover; below sm
              the circle is far too small to hold a bio, so the same content is
              laid out under the portrait instead of being hidden. */}
          <Reveal stagger={0.08} className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8">
            {TEAM.map((m) => {
              const isOpen = open === m.name;
              const socials = m.social && (
                <>
                  {m.social.linkedin && (
                    <a href={m.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-border-strong text-ink-secondary transition-colors hover:border-crimson hover:text-crimson sm:h-9 sm:w-9 sm:border-white/25 sm:text-paper/80">
                      <LinkedinIcon />
                    </a>
                  )}
                  {m.social.instagram && (
                    <a href={m.social.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on Instagram`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-border-strong text-ink-secondary transition-colors hover:border-crimson hover:text-crimson sm:h-9 sm:w-9 sm:border-white/25 sm:text-paper/80">
                      <InstagramIcon />
                    </a>
                  )}
                </>
              );

              return (
              <div key={m.name} className="flex flex-col items-center sm:block">
                <div
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a')) return;
                    setOpen(isOpen ? null : m.name);
                  }}
                  className="group relative aspect-square w-full max-w-[240px] overflow-hidden rounded-full ring-1 ring-ink-border sm:max-w-none"
                  style={{ backgroundColor: m.panel }}
                >
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 45vw, 32vw"
                    className={cn(
                      'object-contain object-bottom mix-blend-luminosity opacity-90 grayscale transition-all duration-500 group-hover:mix-blend-normal group-hover:grayscale-0 group-hover:scale-[1.03]',
                      isOpen && 'mix-blend-normal grayscale-0 scale-[1.03]',
                    )}
                  />

                  {/* overlay - sm+ only (hover / keyboard focus / tap) */}
                  <div className={cn(
                    'absolute inset-0 hidden flex-col items-center justify-center gap-2 bg-ink/72 px-6 text-center opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:flex',
                    isOpen && 'opacity-100',
                  )}>
                    <div className="text-lg font-semibold text-paper">{m.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-crimson">{m.role}</div>
                    {m.bio && <p className="mt-1 max-w-[26ch] text-[12px] leading-relaxed text-paper/75">{m.bio}</p>}
                    {socials && <div className="mt-2 flex items-center gap-3">{socials}</div>}
                  </div>
                </div>

                {/* mobile detail - the overlay content, laid out properly */}
                <div className="mt-5 flex flex-col items-center text-center sm:hidden">
                  <div className="text-lg font-semibold text-ink">{m.name}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-crimson">{m.role}</div>
                  {m.bio && <p className="mt-3 max-w-[34ch] text-[13px] leading-relaxed text-ink-secondary">{m.bio}</p>}
                  {socials && <div className="mt-4 flex items-center gap-3">{socials}</div>}
                </div>
              </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
