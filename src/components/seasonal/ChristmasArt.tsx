import type { SVGProps } from "react";

type Art = "cup" | "tree" | "sprig" | "bow" | "star" | "hat" | "lights";

// ponytail: one small SVG family; split artwork only when a second season needs it.
export default function ChristmasArt({
  kind = "cup",
  className,
}: { kind?: Art; className?: string }) {
  const props: SVGProps<SVGSVGElement> = {
    viewBox: kind === "lights" ? "0 0 600 24" : "0 0 200 200",
    fill: "none",
    stroke: "var(--season-ink)",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: "false",
    className: `christmas-art ${className ?? ""}`,
  };
  if (kind === "lights") return (
    <svg {...props} preserveAspectRatio="none">
      <path d="M0 3Q150 25 300 5Q450 25 600 3" stroke="var(--season-pine)" strokeWidth="1.5" />
      {[30, 90, 150, 210, 270, 330, 390, 450, 510, 570].map((x, i) => (
        <g key={x} className="christmas-bulb" style={{ animationDelay: `${i * -0.7}s` }}>
          <path d={`M${x} ${x < 70 || x > 530 ? 6 : 12}v4`} strokeWidth="1.5" />
          <ellipse cx={x} cy={x < 70 || x > 530 ? 14 : 20} rx="3" ry="4" fill={i % 3 === 0 ? "var(--season-berry)" : "var(--season-gold)"} stroke="none" />
        </g>
      ))}
    </svg>
  );
  return (
    <svg {...props}>
      {kind === "cup" && <>
        <ellipse cx="96" cy="174" rx="77" ry="10" fill="var(--season-gold)" opacity=".16" stroke="none" />
        <g className="christmas-steam" stroke="var(--season-pine)" opacity=".65">
          <path d="M74 69c-12-12 9-17 0-29M95 64c-12-12 9-17 0-29" />
        </g>
        <path d="M136 105h12c32 0 30 42-5 42h-10" fill="var(--season-paper)" />
        <path d="M44 91h96l-8 56c-4 35-76 35-80 0Z" fill="var(--season-paper)" />
        <path d="M47 110h90l-5 37c-4 28-76 28-79 0Z" fill="var(--season-pine)" stroke="none" />
        <path d="M87 132c-11-14-23 4 5 18 28-14 16-32 5-18l-5 5Z" fill="var(--season-paper)" stroke="none" />
        <ellipse cx="91" cy="92" rx="48" ry="10" fill="var(--season-ink)" />
        <path d="M100 83c1-30 24-55 47-48l18 32c-13-8-20-12-26-6l-9 27" fill="var(--season-berry)" />
        <path d="M100 82q16-9 36 1l-2 10q-17-8-37 0Z" fill="var(--season-paper)" />
        <circle cx="165" cy="69" r="10" fill="var(--season-paper)" />
        <g transform="translate(145 120) scale(.3)"><Tree /></g>
        <g transform="translate(13 72) scale(.18)"><Star /></g>
        <g transform="translate(157 12) scale(.14)"><Star /></g>
        <path d="M37 178h108" stroke="var(--season-ink)" opacity=".35" />
      </>}
      {kind === "tree" && <Tree />}
      {kind === "star" && <Star />}
      {kind === "hat" && <>
        <path d="M38 133C53 70 96 33 143 51l30 61c-26-16-39-30-52-16l-13 48" fill="var(--season-berry)" />
        <path d="M35 132q38-17 82 6l-5 22q-38-18-82-5Z" fill="var(--season-paper)" />
        <circle cx="171" cy="116" r="19" fill="var(--season-paper)" />
      </>}
      {kind === "sprig" && <>
        <path d="M24 165Q92 89 179 37" stroke="var(--season-pine)" />
        {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${i * 26} ${-i * 21})`} stroke="var(--season-pine)">
          <path d="m45 140-23-3m23 3-2-29m15 17-26-3m26 3-1-29m14 16-24-3m24 3-1-27" />
        </g>)}
        <circle cx="94" cy="122" r="7" fill="var(--season-berry)" stroke="none" />
        <circle cx="109" cy="116" r="6" fill="var(--season-berry)" stroke="none" />
        <circle cx="105" cy="132" r="6" fill="var(--season-berry)" stroke="none" />
      </>}
      {kind === "bow" && <>
        <path d="M97 90C44 21 14 81 41 112c15 16 39 0 56-11M103 90c53-69 83-9 56 22-15 16-39 0-56-11" fill="var(--season-berry)" />
        <path d="m91 105-30 58 25-8 9 17 11-66m4-2 29 57-22-8-8 16-10-64" fill="var(--season-berry)" />
        <rect x="88" y="83" width="24" height="28" rx="9" fill="var(--season-berry)" />
      </>}
    </svg>
  );
}

function Tree() {
  return <>
    <path d="M94 157h12v25H94Z" fill="var(--season-ink)" />
    <path d="m100 32 36 51h-15l31 40h-19l32 38H35l32-38H48l31-40H64Z" fill="var(--season-pine)" />
    <path d="m74 101 50 16m-61 13 65 17" stroke="var(--season-gold)" strokeWidth="4" />
    <circle cx="92" cy="85" r="5" fill="var(--season-berry)" stroke="none" />
    <circle cx="114" cy="134" r="5" fill="var(--season-berry)" stroke="none" />
    <g transform="translate(78 5) scale(.22)"><Star /></g>
  </>;
}

function Star() {
  return <path d="m100 22 22 49 54 6-40 36 11 54-47-28-47 28 11-54-40-36 54-6Z" fill="var(--season-gold)" />;
}
