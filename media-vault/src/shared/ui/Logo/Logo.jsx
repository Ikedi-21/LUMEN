export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size * 4.2}
      height={size}
      viewBox="0 0 210 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="25"
        cy="25"
        r="19"
        fill="none"
        stroke="var(--accent-secondary)"
        strokeWidth="2"
      />
      <text
        x="25"
        y="33"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="22"
        fontWeight="700"
        fill="var(--text-primary)"
      >
        L
      </text>
      <text
        x="55"
        y="33"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="26"
        fontWeight="500"
        fill="var(--text-primary)"
      >
        umen
      </text>
    </svg>
  );
}
