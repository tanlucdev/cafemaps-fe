import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { getPersonaRelations } from "@/lib/quiz/persona-relations";
import { normalizeQuizProfileId, resolveQuizPosterImage, resolveQuizWideImage } from "@/lib/quiz/profiles";
import type { LocalizedQuizProfile, QuizResultVariant } from "@/types/quiz";
import type { QuizResultImagePayload } from "@/apis/quiz";

/* eslint-disable @next/next/no-img-element */
export const runtime = "nodejs";

const MAX_TEXT = 180;
const MAX_LIST = 14;

type CleanPayload = QuizResultImagePayload;

export async function POST(request: Request) {
  let payload: CleanPayload;
  let image: string;
  try {
    const clean = cleanPayload(await request.json());
    if (!clean) return Response.json({ error: "Invalid payload" }, { status: 400 });
    payload = clean;
    image = await imageToDataUrl(
      new URL(
        payload.format === "desktop"
          ? resolveQuizPosterImage(payload.result.profile.posterImageSlug, payload.variant)
          : resolveQuizWideImage(payload.result.profile.posterImageSlug, payload.variant),
        request.url,
      ),
    );
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const size = payload.format === "desktop" ? { width: 1600, height: 1000 } : { width: 1080, height: 1500 };
  return new ImageResponse(
    payload.format === "desktop" ? <DesktopBoard payload={payload} image={image} /> : <MobileBoard payload={payload} image={image} />,
    { ...size, fonts: await loadExportFonts() },
  );
}

function DesktopBoard({ payload, image }: { payload: CleanPayload; image: string }) {
  const { result, labels } = payload;
  const relations = getPersonaRelations(result.profile, payload.profiles);
  return <Frame><img src={image} alt="" width={545} height={1000} style={{ objectFit: "cover" }} /><div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 56, width: 1055 }}><Badges labels={labels.result} dna={result.dna} /><Title profile={result.profile} titleSize={64} subtitleSize={28} bodySize={23} /><Score label={labels.match} score={result.score} fontSize={22} /><Chips chips={result.chips} fontSize={18} /><Columns labels={labels} profile={result.profile} relations={relations} /></div></Frame>;
}

function MobileBoard({ payload, image }: { payload: CleanPayload; image: string }) {
  const { result, labels } = payload;
  const relations = getPersonaRelations(result.profile, payload.profiles);
  return <Frame column><img src={image} alt="" width={1080} height={608} style={{ objectFit: "cover" }} /><div style={{ display: "flex", flexDirection: "column", gap: 30, padding: 48 }}><Title profile={result.profile} titleSize={76} subtitleSize={34} bodySize={27} /><Score label={labels.match} score={result.score} fontSize={27} /><Chips chips={result.chips.slice(0, 6)} fontSize={20} /><Columns labels={labels} profile={result.profile} relations={relations} compact /></div></Frame>;
}

function Frame({ children, column }: { children: ReactNode; column?: boolean }) {
  return <div style={{ display: "flex", flexDirection: column ? "column" : "row", width: "100%", height: "100%", background: "#fbf4e8", color: "#2c1a0e", fontFamily: '"Plus Jakarta Sans", Arial, sans-serif' }}>{children}</div>;
}

function Badges({ labels, dna }: { labels: string; dna: string }) {
  return <div style={{ display: "flex", gap: 14 }}><span style={badge("#fffaf2", "#9a672f")}>{labels}</span><span style={badge("#2c1a0e", "#fff7ea")}>{dna}</span></div>;
}

function Title({ profile, titleSize, subtitleSize, bodySize }: { profile: LocalizedQuizProfile; titleSize: number; subtitleSize: number; bodySize: number }) {
  return <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontFamily: "Lora, Georgia, serif", fontSize: titleSize, lineHeight: 0.98, fontWeight: 700 }}>{profile.title}</div><div style={{ marginTop: 16, fontSize: subtitleSize, lineHeight: 1.12, fontWeight: 800, color: "#9a672f" }}>{profile.subtitle}</div><div style={{ marginTop: 18, fontSize: bodySize, lineHeight: 1.45, color: "#5f4932" }}>{clip(profile.description, 210)}</div></div>;
}

function Score({ label, score, fontSize }: { label: string; score: number; fontSize: number }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize, fontWeight: 800 }}><span>{label}</span><span>{score}%</span></div><div style={{ display: "flex", height: 24, padding: 4, border: "1px solid #dfbf8f", borderRadius: 999, background: "#fffaf2" }}><div style={{ display: "flex", height: "100%", width: `${score}%`, borderRadius: 999, background: "#c8842a" }} /></div></div>;
}

function Chips({ chips, fontSize }: { chips: string[]; fontSize: number }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{chips.map((chip) => <span key={chip} style={{ border: "1px solid #dfbf8f", borderRadius: 999, background: "#fffaf2", padding: "10px 16px", fontSize, fontWeight: 800 }}>{chip}</span>)}</div>;
}

function Columns({ labels, profile, relations, compact }: { labels: CleanPayload["labels"]; profile: LocalizedQuizProfile; relations: ReturnType<typeof getPersonaRelations>; compact?: boolean }) {
  const groups = [[labels.traits, profile.personalityTraits], [labels.bestFor, profile.bestFor], [labels.avoidWhen, profile.avoidWhen], [labels.compatiblePersonas, relations.compatible.map((p) => p.title)], [labels.incompatiblePersonas, relations.incompatible.map((p) => p.title)], [labels.pairPersonas, relations.pair.map((p) => p.title)]];
  return <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? 14 : 16 }}>{groups.map(([title, items]) => <div key={title as string} style={{ display: "flex", flexDirection: "column", gap: 10, width: compact ? 318 : 296, minHeight: compact ? 154 : 150, border: "1px solid #e5cfad", borderRadius: 8, background: "#fffdf8", padding: compact ? 16 : 18 }}><div style={{ fontSize: compact ? 20 : 18, fontWeight: 900, color: "#9a672f" }}>{title as string}</div>{(items as string[]).slice(0, compact ? 2 : 3).map((item) => <div key={item} style={{ fontSize: compact ? 19 : 17, lineHeight: 1.25, color: "#5f4932" }}>{clip(item, 52)}</div>)}</div>)}</div>;
}

function cleanPayload(value: unknown): CleanPayload | null {
  const p = value as Partial<QuizResultImagePayload>;
  if (!p || (p.format !== "desktop" && p.format !== "mobile") || (p.variant !== "man" && p.variant !== "woman")) return null;
  const profile = cleanProfile(p.result?.profile);
  const score = Number(p.result?.score);
  const labels = cleanLabels(p.labels);
  if (!profile || !labels || !Number.isFinite(score) || score < 0 || score > 100) return null;
  const profiles = arr(p.profiles, MAX_LIST).map(cleanProfile).filter(Boolean) as LocalizedQuizProfile[];
  return { format: p.format, variant: p.variant as QuizResultVariant, result: { profile, score: Math.round(score), dna: s(p.result?.dna, 24), chips: arr(p.result?.chips, 8).map((item) => s(item, 32)).filter(Boolean) }, profiles, labels };
}

function cleanProfile(value: unknown): LocalizedQuizProfile | null {
  const p = value as LocalizedQuizProfile;
  const id = normalizeQuizProfileId(p?.id);
  if (!id || !p.posterImageSlug) return null;
  return {
    ...p,
    id,
    code: s(p.code, 6),
    sticker: p.sticker,
    posterImageSlug: s(p.posterImageSlug, 80),
    posterImage: s(p.posterImage, 160),
    title: s(p.title, 64),
    subtitle: s(p.subtitle, 90),
    description: s(p.description, 320),
    shareTitle: s(p.shareTitle, 90),
    shareDescription: s(p.shareDescription, 180),
    vibes: arr(p.vibes, 6).map((v) => s(v, 32)),
    purposes: arr(p.purposes, 6).map((v) => s(v, 32)),
    tags: arr(p.tags, 8).map((v) => s(v, 32)),
    reasons: arr(p.reasons, 4).map((v) => s(v, 90)),
    personalityTraits: arr(p.personalityTraits, 3).map((v) => s(v, 70)),
    bestFor: arr(p.bestFor, 3).map((v) => s(v, 70)),
    avoidWhen: arr(p.avoidWhen, 3).map((v) => s(v, 70)),
  };
}

function cleanLabels(value: unknown): CleanPayload["labels"] | null {
  const keys = ["result", "match", "traits", "bestFor", "avoidWhen", "compatiblePersonas", "incompatiblePersonas", "pairPersonas"] as const;
  if (!value || typeof value !== "object") return null;
  return Object.fromEntries(keys.map((key) => [key, s((value as Record<string, unknown>)[key], 42)])) as CleanPayload["labels"];
}

async function imageToDataUrl(url: URL) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Image missing");
  const input = Buffer.from(await response.arrayBuffer());
  const sharp = (await import("sharp")).default;
  return `data:image/png;base64,${(await sharp(input).png().toBuffer()).toString("base64")}`;
}

const arr = (v: unknown, max: number) => (Array.isArray(v) ? v.slice(0, max) : []);
const s = (v: unknown, max = MAX_TEXT) => (typeof v === "string" ? v.slice(0, max) : "");
const clip = (v: string, max: number) => (v.length > max ? `${v.slice(0, max - 1)}...` : v);
const badge = (background: string, color: string) => ({ background, color, border: "1px solid #ead5b7", borderRadius: 999, padding: "10px 18px", fontSize: 18, fontWeight: 800 });

type ExportFontWeight = 400 | 500 | 600 | 700 | 800;
type ExportFont = { name: string; data: ArrayBuffer; weight: ExportFontWeight; style: "normal" };

async function loadExportFonts(): Promise<ExportFont[]> {
  const [plusJakarta400, plusJakarta500, plusJakarta600, plusJakarta700, plusJakarta800, lora700] = await Promise.all([
    readFont("PlusJakartaSans-400.ttf"),
    readFont("PlusJakartaSans-500.ttf"),
    readFont("PlusJakartaSans-600.ttf"),
    readFont("PlusJakartaSans-700.ttf"),
    readFont("PlusJakartaSans-800.ttf"),
    readFont("Lora-700.ttf"),
  ]);
  return [
    { name: "Plus Jakarta Sans", data: plusJakarta400, weight: 400, style: "normal" },
    { name: "Plus Jakarta Sans", data: plusJakarta500, weight: 500, style: "normal" },
    { name: "Plus Jakarta Sans", data: plusJakarta600, weight: 600, style: "normal" },
    { name: "Plus Jakarta Sans", data: plusJakarta700, weight: 700, style: "normal" },
    { name: "Plus Jakarta Sans", data: plusJakarta800, weight: 800, style: "normal" },
    { name: "Lora", data: lora700, weight: 700, style: "normal" },
  ];
}

function readFont(file: string) {
  return readFile(join(process.cwd(), "src/assets/fonts", file)).then(toArrayBuffer);
}

function toArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}
