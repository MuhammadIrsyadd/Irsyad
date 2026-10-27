// Surya Majapahit — the eight-pointed sun emblem of the Majapahit court,
// whose capital was Trowulan, in today's Mojokerto. Drawn from scratch as
// a simple geometric mark: a disc, an eight-pointed star of long rays and
// eight shorter rays between them.

const LONG = Array.from({ length: 8 }, (_, i) => i * 45);
const SHORT = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);

export default function SuryaMajapahit({
  className,
  color = "currentColor",
  title,
}: {
  className?: string;
  color?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g fill={color}>
        {LONG.map((a) => (
          <path key={`l${a}`} d="M0 -48 L6 -20 L-6 -20 Z" transform={`rotate(${a})`} />
        ))}
        {SHORT.map((a) => (
          <path key={`s${a}`} d="M0 -34 L4.5 -19 L-4.5 -19 Z" transform={`rotate(${a})`} />
        ))}
        <circle r="17" />
      </g>
      {/* engraved inner ring */}
      <circle r="11.5" fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.6" />
    </svg>
  );
}
