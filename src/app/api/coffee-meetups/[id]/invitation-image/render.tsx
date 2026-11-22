import type { CSSProperties } from "react";
import type { InvitationStyle } from "@/apis/coffee-meetups/invitation";
import CoffeeSticker from "@/components/coffee-meetups/CoffeeSticker";

const palettes: Record<InvitationStyle["color"], readonly string[]> = {
  caramel: ["#fffaf0", "#f7e5c9", "#ddbd92", "#382719", "#80502c"],
  rose: ["#fff7f5", "#f7dce1", "#dca7b2", "#472531", "#8c4057"],
  matcha: ["#f8faed", "#e5edcc", "#bccb93", "#2d3822", "#4a6034"],
  blue: ["#f5faff", "#dcebf6", "#a7c8df", "#23384a", "#31587c"],
  cocoa: ["#fcf5f0", "#ecd9ce", "#c9a38e", "#39251e", "#694435"],
};

type Frame = { card?: CSSProperties; photo: CSSProperties };

export function InvitationImage({
  design,
  title,
  organizer,
  schedule,
  venue,
  note,
  photo,
}: {
  design: InvitationStyle;
  title: string;
  organizer: string;
  schedule: string;
  venue: string;
  note: string;
  photo: string | null;
}) {
  const [paper, wash, line, ink, accent] = palettes[design.color];
  const frames: Record<InvitationStyle["template"], Frame> = {
    envelope: {
      card: { borderRadius: 50 },
      photo: { border: "14px solid white", borderBottomWidth: 28, transform: "rotate(-2deg)" },
    },
    postcard: {
      card: { border: `12px solid ${accent}` },
      photo: { borderRadius: 12, border: `8px dashed ${line}` },
    },
    ticket: {
      card: { borderRadius: 26, border: `6px dashed ${line}` },
      photo: { borderRadius: 18, transform: "rotate(2deg)" },
    },
    notebook: {
      card: { borderLeft: `22px solid ${line}` },
      photo: { border: "12px solid white", transform: "rotate(-3deg)" },
    },
    menu: {
      card: { border: `12px solid ${accent}` },
      photo: { borderRadius: 220, border: `7px solid ${line}` },
    },
    picnic: {
      card: { borderRadius: 42, border: `10px solid ${line}` },
      photo: { borderRadius: "180px 180px 22px 22px" },
    },
    film: {
      card: { borderRadius: 12 },
      photo: {
        border: `10px solid ${accent}`,
        borderTop: `14px dashed ${accent}`,
        borderBottom: `14px dashed ${accent}`,
      },
    },
    ribbon: {
      card: { borderLeft: `34px solid ${line}` },
      photo: { border: "12px solid white", transform: "rotate(3deg)" },
    },
    stars: {
      card: { border: `7px dashed ${line}` },
      photo: { border: `10px solid ${line}`, borderRadius: "230px 230px 24px 24px" },
    },
    latte: {
      card: { borderRadius: "92px 24px 92px 24px" },
      photo: { borderRadius: 220, width: 590, border: `14px solid ${wash}` },
    },
    matchbox: {
      card: { border: `20px solid ${accent}` },
      photo: { border: `7px solid ${accent}`, transform: "rotate(-2deg)" },
    },
    "pressed-flower": {
      card: { borderRadius: "70px 24px 70px 24px" },
      photo: { borderRadius: "210px 210px 12px 12px", border: `10px solid ${wash}` },
    },
    receipt: {
      card: { border: `8px dashed ${line}`, borderRadius: 0 },
      photo: { borderRadius: 4, border: `4px dashed ${line}` },
    },
    window: {
      card: { border: `14px solid ${line}` },
      photo: { borderRadius: 8, border: `16px solid ${wash}` },
    },
    checkers: {
      card: { border: `10px solid ${line}` },
      photo: { border: `12px dashed ${accent}`, transform: "rotate(2deg)" },
    },
  };
  const frame = frames[design.template];
  const titleSize = title.length > 86 ? 54 : title.length > 55 ? 64 : 76;
  const text: CSSProperties = { textAlign: "center", wordBreak: "break-word", maxWidth: 840 };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", padding: 40, background: wash }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "54px 42px 42px",
          background: paper,
          color: ink,
          border: `4px solid ${line}`,
          borderRadius: 32,
          fontFamily: "Plus Jakarta Sans",
          fontSize: 34,
          ...frame.card,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ ...text, fontSize: 33, color: accent, fontWeight: 700 }}>{organizer}</div>
          <div
            style={{
              ...text,
              fontFamily: "Lora",
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.11,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 810,
            height: 402,
            flexShrink: 0,
            background: wash,
            borderRadius: 18,
            overflow: "hidden",
            ...frame.photo,
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              width={810}
              height={402}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <CoffeeSticker exportImage />
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            color: accent,
          }}
        >
          <div style={{ ...text, fontSize: 38, fontWeight: 700 }}>{schedule}</div>
          <div style={{ ...text, fontWeight: 700 }}>{venue}</div>
          {note && <div style={{ ...text, color: ink, fontSize: 30 }}>{note}</div>}
        </div>
        <div style={{ fontSize: 25, fontWeight: 700, color: accent }}>Cafe Maps</div>
      </div>
    </div>
  );
}
