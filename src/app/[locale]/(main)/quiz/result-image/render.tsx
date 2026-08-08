import type { ReactNode } from "react";
import { getPersonaRelations } from "@/lib/quiz/persona-relations";
import type { LocalizedQuizProfile } from "@/types/quiz";
import { MOBILE_BOARD } from "../mobile-board-tokens";
import type { CleanPayload } from "./sanitize";

type IconName = "sparkles" | "coffee" | "circleOff" | "heart" | "shuffle" | "users";

/* eslint-disable @next/next/no-img-element */
export function DesktopBoard({ payload, image, thumbnails }: { payload: CleanPayload; image: string; thumbnails: Record<string, string> }) {
  const { result, labels } = payload;
  const relations = getPersonaRelations(result.profile, payload.profiles);
  return (
    <Frame>
      <Poster image={image} width={456} height={858} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "34px 34px 34px 48px", width: 1122 }}>
        <Summary labels={labels} result={result} />
        <div style={{ display: "flex", gap: 16 }}>
          <ListCard title={labels.traits} items={result.profile.personalityTraits} icon="sparkles" tone="warm" />
          <ListCard title={labels.bestFor} items={result.profile.bestFor} icon="coffee" tone="green" />
          <ListCard title={labels.avoidWhen} items={result.profile.avoidWhen} icon="circleOff" tone="rose" />
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <RelationCard title={labels.compatiblePersonas} items={relations.compatible} thumbnails={thumbnails} icon="heart" />
          <RelationCard title={labels.incompatiblePersonas} items={relations.incompatible} thumbnails={thumbnails} icon="shuffle" />
          <RelationCard title={labels.pairPersonas} items={relations.pair} thumbnails={thumbnails} icon="users" />
        </div>
      </div>
    </Frame>
  );
}

export function MobileBoard({ payload, image, thumbnails }: { payload: CleanPayload; image: string; thumbnails: Record<string, string> }) {
  const { result, labels } = payload;
  const relations = getPersonaRelations(result.profile, payload.profiles);
  return (
    <Frame column>
      <PlainHero image={image} width={MOBILE_BOARD.image.width} height={MOBILE_BOARD.image.height} />
      <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 42 }}>
        <MobileSummary result={result} labels={labels} />
        <div style={{ display: "flex", gap: 14 }}>
          <ListCard title={labels.traits} items={result.profile.personalityTraits.slice(0, 2)} icon="sparkles" tone="warm" mobile />
          <ListCard title={labels.bestFor} items={result.profile.bestFor.slice(0, 2)} icon="coffee" tone="green" mobile />
          <ListCard title={labels.avoidWhen} items={result.profile.avoidWhen.slice(0, 2)} icon="circleOff" tone="rose" mobile />
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <RelationCard title={labels.compatiblePersonas} items={relations.compatible} thumbnails={thumbnails} icon="heart" mobile />
          <RelationCard title={labels.incompatiblePersonas} items={relations.incompatible} thumbnails={thumbnails} icon="shuffle" mobile />
          <RelationCard title={labels.pairPersonas} items={relations.pair} thumbnails={thumbnails} icon="users" mobile />
        </div>
      </div>
    </Frame>
  );
}

function Frame({ children, column }: { children: ReactNode; column?: boolean }) {
  return <div style={{ display: "flex", flexDirection: column ? "column" : "row", width: "100%", height: "100%", background: "#fff8ee", color: "#24150b", fontFamily: '"Plus Jakarta Sans", Arial, sans-serif' }}>{children}</div>;
}

function Poster({ image, width, height }: { image: string; width: number; height: number }) {
  return <div style={{ display: "flex", width, height, margin: "34px 0 0 34px", overflow: "hidden", borderRadius: 8, background: "#f5e0c1", boxShadow: "0 24px 60px rgba(88,55,24,0.18)" }}><img src={image} alt="" width={width} height={height} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>;
}

function Summary({ labels, result }: { labels: CleanPayload["labels"]; result: CleanPayload["result"] }) {
  return <div style={{ display: "flex", position: "relative", overflow: "hidden", flexDirection: "column", width: 1118, minHeight: 432, border: "1px solid #e5cfad", borderRadius: 8, background: "#fffaf2", padding: 32, boxShadow: "0 18px 46px rgba(88,55,24,0.12)" }}><div style={{ display: "flex", position: "absolute", top: -150, right: -140, width: 330, height: 330, borderRadius: 999, background: "rgba(242,207,136,0.28)" }} /><div style={{ display: "flex", position: "absolute", top: 32, right: 32, width: 118, height: 118, borderRadius: 999, border: "1px solid #dfbf8f", background: "#ffffffc7", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 28px rgba(88,55,24,0.12)" }}><span style={{ fontSize: 40, lineHeight: 1, fontWeight: 900, color: "#9a672f" }}>{result.score}%</span><span style={{ marginTop: 8, fontSize: 14, lineHeight: 1, fontWeight: 900, color: "#6b4a28" }}>{labels.match}</span></div><div style={{ display: "flex", gap: 10 }}><span style={badge("#ffffffbf", "#9a672f")}>{labels.result}</span><span style={badge("#2c1a0e", "#fff7ea")}>{result.dna}</span></div><div style={{ marginTop: 36, paddingRight: 136, fontFamily: "Lora, Georgia, serif", fontSize: 66, lineHeight: 0.98, fontWeight: 700 }}>{result.profile.title}</div><div style={{ marginTop: 14, fontSize: 27, lineHeight: 1.1, fontWeight: 900, color: "#9a672f" }}>{sentence(result.profile.subtitle)}</div><div style={{ marginTop: 16, fontSize: 23, lineHeight: 1.48, color: "#6b5842" }}>{clip(result.profile.description, 230)}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>{result.chips.map((chip) => <span key={chip} style={{ border: "1px solid #dfbf8f", borderRadius: 999, background: "#fffaf2", padding: "10px 16px", fontSize: 18, fontWeight: 900 }}>{sentence(chip)}</span>)}</div></div>;
}

function PlainHero({ image, width, height }: { image: string; width: number; height: number }) {
  return <div style={{ display: "flex", width, height, overflow: "hidden", background: MOBILE_BOARD.imageBg }}><img src={image} alt="" width={width} height={height} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>;
}

function MobileSummary({ result, labels }: { result: CleanPayload["result"]; labels: CleanPayload["labels"] }) {
  return <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${MOBILE_BOARD.border}`, borderRadius: 8, background: "#ffffffb8", padding: 28 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 18 }}><span style={badge(MOBILE_BOARD.chipBg, "#8b521b")}>{labels.result}</span><span style={badge("#24150b", "#fff7ea")}>{result.dna}</span></div><div style={{ marginTop: 20, fontFamily: "Lora, Georgia, serif", fontSize: 74, lineHeight: 0.98, fontWeight: 700 }}>{result.profile.title}</div><div style={{ marginTop: 10, fontSize: 29, lineHeight: 1.1, fontWeight: 900, color: MOBILE_BOARD.accent }}>{sentence(result.profile.subtitle)}</div><div style={{ marginTop: 14, fontSize: 24, lineHeight: 1.38, fontWeight: 600, color: MOBILE_BOARD.muted }}>{clip(result.profile.description, 170)}</div><div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18 }}><span style={{ fontSize: 42, lineHeight: 1, fontWeight: 900, color: MOBILE_BOARD.accent }}>{result.score}%</span><span style={{ fontSize: 19, fontWeight: 900, color: "#6b4a28" }}>{labels.match}</span><div style={{ display: "flex", flex: 1, height: 13, overflow: "hidden", borderRadius: 999, background: MOBILE_BOARD.border }}><div style={{ display: "flex", width: `${result.score}%`, height: "100%", borderRadius: 999, background: MOBILE_BOARD.accent }} /></div></div><Chips chips={result.chips.slice(0, 6)} fontSize={17} /></div>;
}

function Chips({ chips, fontSize }: { chips: string[]; fontSize: number }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 20 }}>{chips.map((chip) => <span key={chip} style={{ border: "1px solid #dfbf8f", borderRadius: 999, background: "#fffaf2", padding: "9px 15px", fontSize, fontWeight: 900 }}>{sentence(chip)}</span>)}</div>;
}

function ListCard({ title, items, icon, tone, mobile }: { title: string; items: string[]; icon: IconName; tone: "warm" | "green" | "rose"; mobile?: boolean }) {
  const colors = { warm: ["#e6bf82", "#fff8ec", "#9b5f20"], green: ["#b9cfad", "#f5fbef", "#526f35"], rose: ["#e4b8a5", "#fff4ef", "#9b4e31"] }[tone];
  return <div style={{ display: "flex", flexDirection: "column", width: mobile ? 316 : 362, height: mobile ? 176 : 196, border: `1px solid ${colors[0]}`, borderRadius: 8, background: colors[1], padding: mobile ? 14 : 18, boxShadow: "0 12px 30px rgba(88,55,24,0.08)" }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><Icon name={icon} color={colors[2]} /><div style={cardTitle(colors[2], mobile ? 18 : 20)}>{title}</div></div>{items.map((item) => <div key={item} style={{ display: "flex", gap: 10, padding: "5px 0", fontSize: mobile ? 17 : 20, lineHeight: 1.2, fontWeight: 500, color: "#5f4932" }}><span style={{ display: "flex", width: 8, height: 8, marginTop: 7, borderRadius: 999, background: "#6b5842" }} /><span>{sentence(clip(item, mobile ? 40 : 80))}</span></div>)}</div>;
}

function RelationCard({ title, items, thumbnails, icon, mobile }: { title: string; items: LocalizedQuizProfile[]; thumbnails: Record<string, string>; icon: IconName; mobile?: boolean }) {
  return <div style={card(mobile ? 198 : 198, mobile ? 316 : 362)}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name={icon} color="#c8842a" /><div style={cardTitle("#8b521b", mobile ? 18 : 20)}>{title}</div></div>{items.slice(0, 2).map((profile) => <div key={profile.id} style={{ display: "flex", alignItems: "center", gap: mobile ? 9 : 14, height: mobile ? 56 : 56, marginTop: 9, border: "1px solid #ead5b7", borderRadius: 8, background: "#fff8ee", padding: 7 }}><img src={thumbnails[profile.id] ?? profile.posterImage} alt="" width={38} height={38} style={{ borderRadius: 7, objectFit: "cover" }} /><span style={{ fontSize: mobile ? 15 : 18, lineHeight: 1.12, fontWeight: 900 }}>{profile.title}</span></div>)}</div>;
}

function Icon({ name, color }: { name: IconName; color: string }) {
  return <img src={iconSrc(name, color)} alt="" width={22} height={22} />;
}

function iconSrc(name: IconName, color: string) {
  const stroke = color.replace("#", "%23");
  const paths = {
    sparkles: '<path d="M11 2l1.8 5.2L18 9l-5.2 1.8L11 16l-1.8-5.2L4 9l5.2-1.8z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/>',
    coffee: '<path d="M5 8h10v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M15 10h2a3 3 0 0 1 0 6h-2"/><path d="M8 3v2M12 3v2"/>',
    circleOff: '<circle cx="12" cy="12" r="8"/><path d="M7 7l10 10"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    shuffle: '<path d="M4 7h3c4 0 5 10 9 10h4"/><path d="M17 14l3 3-3 3"/><path d="M4 17h3c1.5 0 2.6-1.4 3.6-3"/><path d="M17 4l3 3-3 3"/><path d="M14 7h6"/>',
    users: '<path d="M15 18a4 4 0 0 0-8 0"/><circle cx="11" cy="8" r="3"/><path d="M20 18a3 3 0 0 0-4-2.8"/><path d="M16 5.2a3 3 0 0 1 0 5.6"/>',
  }[name];
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

function card(height: number, width = 362) {
  return { display: "flex", flexDirection: "column" as const, width, height, border: "1px solid #e5cfad", borderRadius: 8, background: "rgba(255,255,255,0.7)", padding: 18, boxShadow: "0 12px 30px rgba(88,55,24,0.08)" };
}

function cardTitle(color = "#24150b", fontSize = 20) {
  return { fontSize, lineHeight: 1.2, fontWeight: 900, color };
}

const clip = (v: string, max: number) => (v.length > max ? `${v.slice(0, max - 1)}...` : v);
const sentence = (v: string) => (v ? v[0].toLocaleUpperCase("vi-VN") + v.slice(1) : v);
const badge = (background: string, color: string) => ({ background, color, border: "1px solid #ead5b7", borderRadius: 999, padding: "10px 18px", fontSize: 18, fontWeight: 900 });
