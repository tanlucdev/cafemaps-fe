import { MOCK_CAFES } from "@/lib/mock-data";
import type { BackgroundCafe, HeroImage, KeywordFilter, PolaroidItem, QuickFilter } from "./types";

export const KEYWORD_TO_FILTER: KeywordFilter[] = [
  { keywords: ["làm việc", "work", "workspace"], purpose: "làm việc" },
  { keywords: ["học tập", "học", "study"], purpose: "học tập" },
  { keywords: ["hẹn hò", "date", "romantic"], purpose: "hẹn hò" },
  { keywords: ["họp nhóm", "meeting", "group"], purpose: "họp nhóm" },
  { keywords: ["chill", "một mình"], purpose: "chill một mình" },
  { keywords: ["bạn bè", "gặp bạn", "friend"], purpose: "gặp bạn bè" },
  { keywords: ["yên tĩnh", "quiet", "yên"], vibe: "yên tĩnh" },
  { keywords: ["vintage", "cổ điển"], vibe: "vintage" },
  { keywords: ["thiên nhiên", "nature", "cây"], vibe: "thiên nhiên" },
  { keywords: ["hiện đại", "modern"], vibe: "hiện đại" },
  { keywords: ["minimalist", "tối giản"], vibe: "minimalist" },
  { keywords: ["lãng mạn", "romantic"], vibe: "lãng mạn" },
  { keywords: ["sáng tạo", "creative"], vibe: "sáng tạo" },
  { keywords: ["nhộn nhịp", "vibrant", "náo nhiệt"], vibe: "nhộn nhịp" },
];

export const PLACEHOLDER_KEYS = [
  "placeholderWork",
  "placeholderDate",
  "placeholderMorning",
] as const;

export const VIBE_MAP: Record<string, string> = {
  yên: "yên tĩnh",
  tĩnh: "yên tĩnh",
  "yên tĩnh": "yên tĩnh",
  quiet: "yên tĩnh",
  calming: "yên tĩnh",
  "yen tinh": "yên tĩnh",
  "thiên nhiên": "thiên nhiên",
  cây: "thiên nhiên",
  vườn: "thiên nhiên",
  nature: "thiên nhiên",
  vintage: "vintage",
  "cổ điển": "vintage",
  retro: "vintage",
  "làm việc": "làm việc",
  work: "làm việc",
  làm: "làm việc",
  "hẹn hò": "hẹn hò",
  date: "hẹn hò",
  "lãng mạn": "hẹn hò",
  "hiện đại": "hiện đại",
  modern: "hiện đại",
  "sáng tạo": "sáng tạo",
  creative: "sáng tạo",
  minimalist: "minimalist",
  "tối giản": "minimalist",
};

export const HERO_IMAGES: HeroImage[] = [
  {
    src: "/image/home-polaroid-1.jpg",
    captionKey: "cozy",
  },
  {
    src: "/image/home-polaroid-2.jpg",
    captionKey: "morning",
  },
  {
    src: "/image/home-polaroid-3.jpg",
    captionKey: "vintage",
  },
  {
    src: "/image/home-polaroid-4.jpg",
    captionKey: "work",
  },
];

const BACKGROUND_TILE_STYLES = [
  "aspect-[1.2/1] translate-y-2",
  "aspect-[0.86/1] -translate-y-4",
  "aspect-square translate-y-6",
  "aspect-[1.45/1] -translate-y-1",
  "aspect-[0.95/1] translate-y-5",
  "aspect-[1.12/1] -translate-y-5",
] as const;

export const BACKGROUND_CAFES: BackgroundCafe[] = MOCK_CAFES.slice(0, 14).map((cafe, index) => ({
  name: cafe.name,
  src: HERO_IMAGES[index % HERO_IMAGES.length].src,
  tileClassName: BACKGROUND_TILE_STYLES[index % BACKGROUND_TILE_STYLES.length],
}));

export const POLAROIDS: PolaroidItem[] = [
  { image: HERO_IMAGES[0], className: "top-[18%] left-[1.5%] rotate-[-8deg]" },
  { image: HERO_IMAGES[3], className: "bottom-[13%] left-[3%] rotate-[6deg]" },
  { image: HERO_IMAGES[1], className: "top-[18%] right-[1.5%] rotate-[7deg]" },
  { image: HERO_IMAGES[2], className: "right-[3%] bottom-[14%] rotate-[-5deg]" },
];

export const MOBILE_POLAROIDS: PolaroidItem[] = [
  { image: HERO_IMAGES[0], className: "top-[19.25rem] left-3 rotate-[-8deg]" },
  { image: HERO_IMAGES[2], className: "top-[20rem] right-3 rotate-[7deg]" },
  { image: HERO_IMAGES[3], className: "right-5 bottom-[7.75rem] rotate-[-5deg] opacity-70" },
];

export const QUICK_FILTERS: QuickFilter[] = [
  {
    emoji: "🌿",
    labelKey: "outdoor",
    vibe: "thiên nhiên",
  },
  {
    emoji: "🕒",
    labelKey: "openNow",
    openNow: true,
    featured: true,
  },
  {
    emoji: "☁️",
    labelKey: "quiet",
    vibe: "yên tĩnh",
  },
  {
    emoji: "✨",
    labelKey: "vintage",
    vibe: "vintage",
  },
  {
    emoji: "💻",
    labelKey: "workFriendly",
    purpose: "làm việc",
  },
];
