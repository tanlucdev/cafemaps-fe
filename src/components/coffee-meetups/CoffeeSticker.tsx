export default function CoffeeSticker({
  className,
  exportImage = false,
}: {
  className?: string;
  exportImage?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={exportImage ? 280 : undefined}
      height={exportImage ? 249 : undefined}
      viewBox="0 0 180 160"
      fill="none"
      className={className}
    >
      <g
        stroke={exportImage ? "#fdf6ec" : "var(--card)"}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M43 48c-15-15 12-16 1-31M76 44c-14-16 13-16 2-31M109 48c-10-11 11-14 3-25" />
        <path d="M24 65h76l-7 55c-1 15-59 15-61 0L24 65ZM100 73h8c24 0 24 31-10 32M12 133c15 17 89 17 104-1" />
        <path d="m102 90 48-11 8 38c3 16-35 25-40 9l-16-36ZM151 87c21-13 35 14 8 21M110 146c15 4 46-2 54-15" />
      </g>
      <g
        stroke={exportImage ? "#2c1a0e" : "var(--foreground)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M43 48c-15-15 12-16 1-31M76 44c-14-16 13-16 2-31M109 48c-10-11 11-14 3-25"
          stroke={exportImage ? "#c8842a" : "var(--accent)"}
        />
        <path
          d="M100 73h8c24 0 24 31-10 32"
          fill={exportImage ? "#f5edd8" : "var(--background-secondary)"}
        />
        <path
          d="M24 65h76l-7 55c-1 15-59 15-61 0L24 65Z"
          fill={exportImage ? "#fef3e2" : "var(--accent-light)"}
        />
        <ellipse cx="62" cy="65" rx="38" ry="9" fill={exportImage ? "#c8842a" : "var(--accent)"} />
        <path d="M12 133c15 17 89 17 104-1" />
        <path
          d="M151 87c21-13 35 14 8 21"
          fill={exportImage ? "#f5edd8" : "var(--background-secondary)"}
        />
        <path
          d="m102 90 48-11 8 38c3 16-35 25-40 9l-16-36Z"
          fill={exportImage ? "#eaf2eb" : "var(--sage-light)"}
        />
        <ellipse
          cx="126"
          cy="84"
          rx="25"
          ry="6"
          transform="rotate(-13 126 84)"
          fill={exportImage ? "#7a9e7e" : "var(--sage)"}
        />
        <path d="M110 146c15 4 46-2 54-15" />
        <path d="M47 96v3m27-3v3m-20 7c4 5 9 5 13 0m57-1 1 2m15-6 1 2m-12 9c3 2 6 1 8-2" />
      </g>
      <g fill={exportImage ? "#c8842a" : "var(--accent)"} opacity=".35">
        <ellipse cx="41" cy="106" rx="6" ry="3" />
        <ellipse cx="81" cy="106" rx="6" ry="3" />
      </g>
      <g stroke={exportImage ? "#c8842a" : "var(--accent)"} strokeWidth="2" strokeLinecap="round">
        <path d="m150 29 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7ZM16 43v8m-4-4h8" />
      </g>
    </svg>
  );
}
