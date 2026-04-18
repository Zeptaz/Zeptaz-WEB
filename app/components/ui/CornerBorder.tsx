/**
 * CornerBorder — Nivora's signature L-shaped corner brackets on cards.
 *
 * Place inside any card that has `relative` positioning and a `group` class.
 * The brackets inherit `currentColor`, so control their color via the
 * className prop using Tailwind text utilities + group-hover variants.
 *
 * Example:
 *   <div className="relative group ...">
 *     <CornerBorder className="text-[#E5E5E5] group-hover:text-[#DC143C]/40 transition-colors duration-300" />
 *     ... card content ...
 *   </div>
 */

interface CornerBorderProps {
  /** Arm length of each bracket in px. Default: 12 */
  size?: number;
  /** Line thickness in px. Default: 2 */
  thickness?: number;
  /** Tailwind className for color / transition. Uses currentColor. */
  className?: string;
}

export default function CornerBorder({
  size = 12,
  thickness = 2,
  className = 'text-[#E5E5E5]',
}: CornerBorderProps) {
  const s = `${size}px`;
  const t = `${thickness}px`;
  const base: React.CSSProperties = {
    position: 'absolute',
    width: s,
    height: s,
    borderColor: 'currentColor',
    borderStyle: 'solid',
  };

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
    >
      {/* Top-left */}
      <span style={{ ...base, top: 0, left: 0, borderWidth: `${t} 0 0 ${t}` }} />
      {/* Top-right */}
      <span style={{ ...base, top: 0, right: 0, borderWidth: `${t} ${t} 0 0` }} />
      {/* Bottom-left */}
      <span style={{ ...base, bottom: 0, left: 0, borderWidth: `0 0 ${t} ${t}` }} />
      {/* Bottom-right */}
      <span style={{ ...base, bottom: 0, right: 0, borderWidth: `0 ${t} ${t} 0` }} />
    </span>
  );
}
