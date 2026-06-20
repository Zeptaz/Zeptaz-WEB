'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TEAM_MEMBERS } from '@/lib/constants';

function LinkedinIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function InstagramIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

type TeamMember = (typeof TEAM_MEMBERS)[number];

export default function TeamShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const members = TEAM_MEMBERS;

  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  return (
    <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-16 select-none w-full">
      {/* Left: staggered photo grid */}
      <div className="flex gap-3 flex-shrink-0 overflow-x-auto pb-1 md:pb-0">
        <div className="flex flex-col gap-3">
          {col1.map(m => (
            <PhotoCard key={m.id} member={m} hoveredId={hoveredId} onHover={setHoveredId}
              className="w-[140px] h-[155px] sm:w-[160px] sm:h-[175px] md:w-[175px] md:h-[195px]" />
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-[60px] sm:mt-[70px] md:mt-[80px]">
          {col2.map(m => (
            <PhotoCard key={m.id} member={m} hoveredId={hoveredId} onHover={setHoveredId}
              className="w-[155px] h-[170px] sm:w-[175px] sm:h-[190px] md:w-[192px] md:h-[210px]" />
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-[28px] sm:mt-[34px] md:mt-[40px]">
          {col3.map(m => (
            <PhotoCard key={m.id} member={m} hoveredId={hoveredId} onHover={setHoveredId}
              className="w-[145px] h-[160px] sm:w-[165px] sm:h-[180px] md:w-[182px] md:h-[200px]" />
          ))}
        </div>
      </div>

      {/* Right: name + role + social list */}
      <div className="flex flex-col gap-6 pt-0 md:pt-3 flex-1">
        <p
          className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#DC143C]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Founding Team
        </p>

        {members.map(m => (
          <MemberRow key={m.id} member={m} hoveredId={hoveredId} onHover={setHoveredId} />
        ))}

        <p className="text-[#6B6B6B] text-[12px] leading-[1.7] max-w-xs" style={{ fontFamily: 'var(--font-mono)' }}>
          Based in Colombo, Sri Lanka — building the AI-powered workforce of the future.
        </p>
      </div>
    </div>
  );
}

function PhotoCard({
  member, className, hoveredId, onHover,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        'overflow-hidden cursor-pointer flex-shrink-0 transition-opacity duration-300',
        className,
        isDimmed ? 'opacity-40' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover object-top"
      />
    </div>
  );
}

function MemberRow({
  member, hoveredId, onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        'cursor-pointer transition-opacity duration-300',
        isDimmed ? 'opacity-30' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'h-2 rounded-none flex-shrink-0 transition-all duration-300',
            isActive ? 'w-5 bg-[#DC143C]' : 'w-2 bg-[#DC143C]/30',
          )}
        />
        <span
          className={cn(
            'text-[18px] sm:text-[20px] font-semibold leading-none tracking-tight transition-colors duration-300',
            isActive ? 'text-white' : 'text-[#A1A1A1]',
          )}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {member.name}
        </span>

        {/* Social icons — slide in on hover */}
        <div
          className={cn(
            'flex items-center gap-1.5 transition-all duration-200',
            isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none',
          )}
        >
          {member.social?.linkedin && (
            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-1 text-[#6B6B6B] hover:text-white transition-colors duration-150" title="LinkedIn">
              <LinkedinIcon size={11} />
            </a>
          )}
          {member.social?.instagram && (
            <a href={member.social.instagram} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-1 text-[#6B6B6B] hover:text-white transition-colors duration-150" title="Instagram">
              <InstagramIcon size={11} />
            </a>
          )}
        </div>
      </div>

      <p className="mt-1.5 pl-[28px] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DC143C]"
        style={{ fontFamily: 'var(--font-mono)' }}>
        {member.role}
      </p>
      <p className="mt-0.5 pl-[28px] text-[12px] text-[#6B6B6B] leading-[1.6]">
        {member.focus}
      </p>
    </div>
  );
}
