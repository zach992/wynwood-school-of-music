interface SectionMarkProps {
  /** Pixel height of the slash marks. Default 64. */
  size?: number;
}

/**
 * Brand-styled section divider mark inspired by the WSM Style Guide tag
 * pattern — a small filled purple slash next to a larger white-outlined slash,
 * both leaning forward like a backslash.
 */
export default function SectionMark({ size = 64 }: SectionMarkProps) {
  const skew = size * 0.35;
  const purpleWidth = size * 0.16;
  const outlineWidth = size * 0.4;
  const gap = size * 0.1;
  const stroke = Math.max(2, size * 0.06);
  const inset = stroke / 2;

  const totalWidth = purpleWidth + gap + outlineWidth + skew + stroke;

  const purpleX0 = inset;
  const purplePoints = [
    [purpleX0 + skew, inset],
    [purpleX0 + skew + purpleWidth, inset],
    [purpleX0 + purpleWidth, size - inset],
    [purpleX0, size - inset],
  ];

  const outlineX0 = purpleX0 + purpleWidth + gap;
  const outlinePoints = [
    [outlineX0 + skew, inset],
    [outlineX0 + skew + outlineWidth, inset],
    [outlineX0 + outlineWidth, size - inset],
    [outlineX0, size - inset],
  ];

  return (
    <svg
      width={totalWidth}
      height={size}
      viewBox={`0 0 ${totalWidth} ${size}`}
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <polygon
        points={purplePoints.map((p) => p.join(",")).join(" ")}
        fill="var(--color-wsm-accent, #994878)"
      />
      <polygon
        points={outlinePoints.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={stroke}
        strokeLinejoin="miter"
      />
    </svg>
  );
}
