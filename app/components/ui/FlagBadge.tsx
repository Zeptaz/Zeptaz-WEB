import { ShieldCheck, AlertTriangle } from 'lucide-react';

/** Human-approved / auto-flag marker used on Engine surfaces. */
export default function FlagBadge({ flag }: { flag?: 'human' | 'alert' }) {
  if (flag === 'human')
    return (
      <span className="inline-flex items-center gap-1.5 bg-crimson/12 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-crimson">
        <ShieldCheck className="h-3 w-3" /> Human-approved
      </span>
    );
  if (flag === 'alert')
    return (
      <span className="inline-flex items-center gap-1.5 bg-terminal-amber/12 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-terminal-amber">
        <AlertTriangle className="h-3 w-3" /> Auto-flag
      </span>
    );
  return null;
}
