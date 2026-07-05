import type { ReactNode } from "react";
import { AirVent, Car, PawPrint, TreePine, Wifi, Zap } from "lucide-react";

export const AMENITY_ICONS: Record<string, ReactNode> = {
  wifi: <Wifi size={14} />,
  "điều hoà": <AirVent size={14} />,
  "điều hòa": <AirVent size={14} />,
  "air conditioning": <AirVent size={14} />,
  ac: <AirVent size={14} />,
  "đậu xe": <Car size={14} />,
  parking: <Car size={14} />,
  "ngoài trời": <TreePine size={14} />,
  outdoor: <TreePine size={14} />,
  "ổ cắm": <Zap size={14} />,
  outlet: <Zap size={14} />,
  "power outlet": <Zap size={14} />,
  "thú cưng": <PawPrint size={14} />,
  pet: <PawPrint size={14} />,
};

export const GOOD_FOR_RULES = [
  {
    terms: ["chill một mình", "một mình", "chill", "solo"],
    emoji: "☕",
    labels: { vi: "Chill một mình", en: "Solo chill" },
  },
  {
    terms: ["học tập", "đọc sách", "yên tĩnh", "study", "read", "quiet"],
    emoji: "📚",
    labels: { vi: "Đọc sách", en: "Reading" },
  },
  {
    terms: ["làm việc", "remote", "wifi", "work"],
    emoji: "💻",
    labels: { vi: "Làm việc remote", en: "Remote work" },
  },
  {
    terms: ["ổ cắm", "cắm máy", "outlet", "power"],
    emoji: "🔌",
    labels: { vi: "Cắm máy ngồi lâu", en: "Long laptop sessions" },
  },
  {
    terms: ["jazz", "acoustic", "nhạc", "music"],
    emoji: "🎵",
    labels: { vi: "Nghe nhạc", en: "Music" },
  },
  { terms: ["thú cưng", "pet"], emoji: "🐶", labels: { vi: "Dẫn thú cưng", en: "Pet friendly" } },
  {
    terms: ["hẹn hò", "lãng mạn", "date", "romantic"],
    emoji: "🕯️",
    labels: { vi: "Hẹn hò nhẹ nhàng", en: "Easy dates" },
  },
  {
    terms: ["gặp bạn bè", "họp nhóm", "nhộn nhịp", "friends", "group", "lively"],
    emoji: "💬",
    labels: { vi: "Gặp bạn bè", en: "Friends hangout" },
  },
  {
    terms: ["thiên nhiên", "ngoài trời", "sân vườn", "nature", "outdoor", "garden"],
    emoji: "🌿",
    labels: { vi: "Ngồi ngoài trời", en: "Outdoor seating" },
  },
  {
    terms: ["sáng tạo", "creative"],
    emoji: "✍️",
    labels: { vi: "Viết linh tinh", en: "Creative writing" },
  },
];

export const FALLBACK_GOOD_FOR = [
  { emoji: "☕", labels: { vi: "Chill một mình", en: "Solo chill" } },
  { emoji: "📚", labels: { vi: "Đọc sách", en: "Reading" } },
  { emoji: "💻", labels: { vi: "Làm việc remote", en: "Remote work" } },
];

export const DISPLAY_TAG_RULES = [
  {
    terms: [
      "ngoài trời",
      "sân vườn",
      "ban công",
      "rooftop",
      "terrace",
      "garden",
      "outdoor",
      "balcony",
    ],
    labels: { vi: "ngoài trời", en: "outdoor seating" },
  },
  {
    terms: ["hút thuốc", "khói thuốc", "cho phép hút thuốc", "smoking", "smoking allowed"],
    labels: { vi: "chỗ hút thuốc", en: "smoking allowed" },
  },
];

export const AMENITY_LABELS: Record<string, { vi: string; en: string }> = {
  wifi: { vi: "wifi", en: "wifi" },
  "điều hoà": { vi: "điều hoà", en: "air conditioning" },
  "điều hòa": { vi: "điều hòa", en: "air conditioning" },
  ac: { vi: "điều hoà", en: "air conditioning" },
  "air conditioning": { vi: "điều hoà", en: "air conditioning" },
  "chỗ đậu xe": { vi: "chỗ đậu xe", en: "parking" },
  "đậu xe": { vi: "đậu xe", en: "parking" },
  parking: { vi: "đậu xe", en: "parking" },
  "ngoài trời": { vi: "ngoài trời", en: "outdoor seating" },
  outdoor: { vi: "ngoài trời", en: "outdoor seating" },
  "ổ cắm": { vi: "ổ cắm", en: "power outlets" },
  outlet: { vi: "ổ cắm", en: "power outlets" },
  "power outlets": { vi: "ổ cắm", en: "power outlets" },
  "pet-friendly": { vi: "thân thiện thú cưng", en: "pet friendly" },
};

export const PARKING_LOCATION_LABELS: Record<string, { vi: string; en: string }> = {
  "gửi xe vỉa hè phía trước": {
    vi: "Gửi xe vỉa hè phía trước",
    en: "Street-side parking in front",
  },
  "gửi xe trước quán": { vi: "Gửi xe trước quán", en: "Parking in front" },
  "có chỗ đậu xe": { vi: "Có chỗ đậu xe", en: "Parking available" },
};
