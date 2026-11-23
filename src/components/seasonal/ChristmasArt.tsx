import type { SVGProps } from "react";

const icons = {
  cup: "latte-scarf",
  hero: "santa-coffee",
  tree: "christmas-tree",
  sprig: "holly-sprig",
  bow: "bow-holly",
  santa: "cute-santa",
  kitten: "cat-face",
  cat: "cat-full",
  house: "cafe-house",
  book: "snow-book",
  gift: "gift-box",
  lantern: "lantern",
  cocoa: "cocoa-mug",
} as const;
type Art = keyof typeof icons | "star" | "lights";

export default function ChristmasArt({
  kind = "cup",
  className = "",
  sizes = "64px",
}: {
  kind?: Art;
  className?: string;
  sizes?: string;
}) {
  const artworkClass = `christmas-art ${className}`;
  if (kind !== "lights" && kind !== "star") {
    const widths =
      kind === "cup" || kind === "hero"
        ? [128, 256, 512]
        : ["tree", "santa", "cat"].includes(kind)
          ? [128, 256]
          : [128];
    const path = `/image/christmas/${icons[kind]}`;
    // ponytail: static WebP sizes; use Next optimization when the deployment supports it.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${path}-128.webp`}
        srcSet={widths.map((width) => `${path}-${width}.webp ${width}w`).join(", ")}
        sizes={sizes}
        width={64}
        height={64}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable={false}
        className={artworkClass}
      />
    );
  }
  const props: SVGProps<SVGSVGElement> = {
    viewBox: kind === "lights" ? "0 0 600 24" : "0 0 200 200",
    fill: "none",
    stroke: "var(--season-ink)",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: "false",
    className: artworkClass,
  };
  if (kind === "lights")
    return (
      <svg {...props} preserveAspectRatio="none">
        <path d="M0 3Q150 25 300 5Q450 25 600 3" stroke="var(--season-pine)" strokeWidth="1.5" />
        {[30, 90, 150, 210, 270, 330, 390, 450, 510, 570].map((x, i) => (
          <g key={x} className="christmas-bulb" style={{ animationDelay: `${i * -0.7}s` }}>
            <path d={`M${x} ${x < 70 || x > 530 ? 6 : 12}v4`} strokeWidth="1.5" />
            <ellipse
              cx={x}
              cy={x < 70 || x > 530 ? 14 : 20}
              rx="3"
              ry="4"
              fill={i % 3 === 0 ? "var(--season-berry)" : "var(--season-gold)"}
              stroke="none"
            />
          </g>
        ))}
      </svg>
    );
  return (
    <svg {...props}>
      <Star />
    </svg>
  );
}

function Star() {
  return (
    <path
      d="m100 22 22 49 54 6-40 36 11 54-47-28-47 28 11-54-40-36 54-6Z"
      fill="var(--season-gold)"
    />
  );
}
