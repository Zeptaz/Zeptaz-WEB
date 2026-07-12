import { cn } from '@/lib/utils';

/**
 * Sparse structural grid overlay (Cipher-style): thin vertical + horizontal
 * lines with small crosshair "+" markers at the intersections. Decorative.
 */
export default function GridFrame({
  tone = 'dark',
  cols = [25, 50, 75],
  rows = [33.333, 66.666],
  className,
}: {
  tone?: 'dark' | 'light';
  /** vertical line positions (% of width) */
  cols?: number[];
  /** horizontal line positions (% of height) */
  rows?: number[];
  className?: string;
}) {
  const line = tone === 'light' ? 'rgba(12,12,12,0.10)' : 'rgba(255,255,255,0.06)';
  const mark = tone === 'light' ? 'rgba(12,12,12,0.28)' : 'rgba(255,255,255,0.20)';

  const xs = cols;   // vertical lines (% of width)
  const ys = rows;   // horizontal lines (% of height)

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {/* lines */}
      {xs.map((x) => (
        <div key={`v${x}`} className="absolute top-0 bottom-0 w-px" style={{ left: `${x}%`, background: line }} />
      ))}
      {ys.map((y) => (
        <div key={`h${y}`} className="absolute left-0 right-0 h-px" style={{ top: `${y}%`, background: line }} />
      ))}

      {/* crosshair markers at intersections */}
      {xs.map((x) =>
        ys.map((y) => (
          <Plus key={`p${x}-${y}`} x={x} y={y} color={mark} />
        )),
      )}
    </div>
  );
}

function Plus({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}>
      <div className="absolute h-px w-3" style={{ background: color, transform: 'translate(-50%,-50%)' }} />
      <div className="absolute h-3 w-px" style={{ background: color, transform: 'translate(-50%,-50%)' }} />
    </div>
  );
}
