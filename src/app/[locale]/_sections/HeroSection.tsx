"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOCK_CAFES } from "@/lib/mock-data";

interface HeroSectionProps {
  locale: string;
}

const KEYWORD_TO_FILTER: Array<{ keywords: string[]; vibe?: string; purpose?: string }> = [
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

const QUICK_FILTERS = [
  { emoji: "☁️", vibe: "yên tĩnh", labelKey: "quickFilterQuiet" as const },
  { emoji: "🌿", vibe: "thiên nhiên", labelKey: "quickFilterNature" as const },
  { emoji: "✨", vibe: "vintage", labelKey: "quickFilterVintage" as const },
  { emoji: "💻", purpose: "làm việc", labelKey: "quickFilterWork" as const },
];

const PLACEHOLDER_KEYS = ["placeholderWork", "placeholderDate", "placeholderMorning"] as const;

const VIBE_MAP: Record<string, string> = {
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

type Greeting = { sub: string; text: string };

function getGreeting(lang: string): Greeting {
  const h = new Date().getHours();

  const content: Record<
    string,
    { morning: Greeting; noon: Greeting; afternoon: Greeting; evening: Greeting }
  > = {
    vi: {
      morning: {
        text: "Mình là Lực — mình lập trang này vì mê cà phê 🙈 Sáng nay đi đâu?",
        sub: "CÀ PHÊ SÁNG",
      },
      noon: {
        text: "Mình là Lực — giờ này chắc đang tìm chỗ trốn nắng nhỉ ☀️",
        sub: "TRỐN NẮNG TRƯA",
      },
      afternoon: {
        text: "Mình là Lực — chiều rồi, làm thêm ly nữa không? ☕",
        sub: "CÀ PHÊ CHIỀU",
      },
      evening: {
        text: "Mình là Lực — tối rồi vẫn còn quán mở, mình tìm cho nhé 🌙",
        sub: "CÒN QUÁN MỞ TỐI NAY",
      },
    },
    en: {
      morning: {
        text: "I'm Luc — built this because I'm obsessed with cafés 🙈 Where to this morning?",
        sub: "MORNING COFFEE",
      },
      noon: {
        text: "I'm Luc — hiding from the midday sun? Same. Let's find somewhere ☀️",
        sub: "LUNCH BREAK",
      },
      afternoon: {
        text: "I'm Luc — afternoon slump? One more coffee fixes that ☕",
        sub: "AFTERNOON COFFEE",
      },
      evening: {
        text: "I'm Luc — still up, still caffeinating. Let me find you a spot 🌙",
        sub: "NIGHT OWL",
      },
    },
  };

  const set = content[lang] ?? content.vi;
  if (h >= 5 && h < 11) return set.morning;
  if (h >= 11 && h < 14) return set.noon;
  if (h >= 14 && h < 19) return set.afternoon;
  return set.evening;
}

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function getNameSuggestions(input: string, cafes: typeof MOCK_CAFES) {
  if (input.length < 2) return [];
  const q = normalize(input);
  return cafes
    .filter(
      (c) => normalize(c.name).includes(q) || c.name.toLowerCase().includes(input.toLowerCase()),
    )
    .slice(0, 4);
}

function getSmartSuggestions(input: string, lang: string) {
  if (input.length < 2) return [];
  const lower = input.toLowerCase();
  const suggestions: Array<{ label: string; query: string }> = [];

  let detectedVibe: string | null = null;
  for (const [keyword, vibe] of Object.entries(VIBE_MAP)) {
    if (lower.includes(normalize(keyword)) || lower.includes(keyword)) {
      detectedVibe = vibe;
      break;
    }
  }

  let detectedDistrict: string | null = null;
  const districtMatch = lower.match(/qu[aậ]n\s*(\d+|[a-zÀ-ɏ\s]+)/i);
  if (districtMatch) {
    detectedDistrict = districtMatch[0]
      .replace(/qu[aậ]n/i, "Quận")
      .replace(/\s+/g, " ")
      .trim();
  }

  const isVi = lang === "vi";

  if (detectedVibe && !detectedDistrict) {
    const popular = ["Quận 1", "Quận 3", "Bình Thạnh", "Phú Nhuận", "Quận 7"];
    popular.forEach((d) => {
      suggestions.push({
        label: isVi ? `Quán ${detectedVibe} ở ${d}` : `${detectedVibe} cafés in ${d}`,
        query: `${detectedVibe} ${d}`,
      });
    });
  } else if (detectedVibe && detectedDistrict) {
    suggestions.push({
      label: isVi
        ? `Quán ${detectedVibe} ở ${detectedDistrict}`
        : `${detectedVibe} cafés in ${detectedDistrict}`,
      query: `${detectedVibe} ${detectedDistrict}`,
    });
  } else if (detectedDistrict && !detectedVibe) {
    const vibes = ["yên tĩnh", "làm việc", "thiên nhiên"];
    vibes.forEach((v) => {
      suggestions.push({
        label: isVi ? `Quán ${v} ở ${detectedDistrict}` : `${v} cafés in ${detectedDistrict}`,
        query: `${v} ${detectedDistrict}`,
      });
    });
  }

  return suggestions.slice(0, 3);
}

function ChibiWalkAnimation() {
  return (
    <div className="relative mx-auto mb-6 h-28 w-64 overflow-hidden" aria-hidden>
      {/* Ground line */}
      <div className="bg-accent absolute right-0 bottom-3 left-0 h-px opacity-20" />

      {/* Coffee cup — static, centered background element */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <svg
          width="36"
          height="44"
          viewBox="0 0 72 88"
          fill="none"
          className="text-accent opacity-70"
        >
          <path
            className="steam-1"
            d="M26 28 Q22 20 26 12 Q30 4 26 0"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            className="steam-2"
            d="M36 26 Q32 18 36 10 Q40 2 36 -2"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            className="steam-3"
            d="M46 28 Q42 20 46 12 Q50 4 46 0"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <ellipse cx="36" cy="80" rx="30" ry="6" fill="currentColor" opacity="0.18" />
          <path
            d="M14 42 L18 76 Q18 80 22 80 L50 80 Q54 80 54 76 L58 42 Z"
            fill="currentColor"
            opacity="0.85"
          />
          <rect x="12" y="36" width="48" height="10" rx="5" fill="currentColor" />
          <path
            d="M58 48 Q72 50 72 60 Q72 70 58 70"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="36" cy="41" rx="19" ry="3.5" fill="currentColor" opacity="0.35" />
        </svg>
      </div>

      {/* Chibi character walking back and forth */}
      <motion.div
        className="absolute bottom-3"
        animate={{ x: [0, 160, 0], y: [0, -4, 0] }}
        transition={{
          x: { duration: 5, repeat: Infinity, ease: "linear", times: [0, 0.5, 1] },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Flip direction when going right→left */}
        <motion.div
          animate={{ scaleX: [1, 1, -1, -1, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.49, 0.5, 0.99, 1],
          }}
          style={{ originX: "50%" }}
        >
          <svg width="38" height="62" viewBox="0 0 32 52" fill="none">
            {/* Head */}
            <circle cx="16" cy="11" r="9" fill="#C8842A" />
            {/* Eyes */}
            <circle cx="12.5" cy="10" r="1.5" fill="white" />
            <circle cx="19.5" cy="10" r="1.5" fill="white" />
            <circle cx="13" cy="10.5" r="0.8" fill="#3D2510" />
            <circle cx="20" cy="10.5" r="0.8" fill="#3D2510" />
            {/* Smile */}
            <path
              d="M12.5 14 Q16 17 19.5 14"
              stroke="white"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Body */}
            <rect x="10" y="20" width="12" height="14" rx="4" fill="#E8A84E" />
            {/* Arms — left holding cup */}
            <path
              d="M10 24 Q4 26 5 30"
              stroke="#C8842A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Mini coffee cup in hand */}
            <rect x="2" y="27" width="6" height="5" rx="1.5" fill="#C8842A" />
            <path
              d="M8 29 Q10 29.5 10 31 Q10 32.5 8 32.5"
              stroke="#C8842A"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Right arm */}
            <path
              d="M22 24 Q27 26 26 30"
              stroke="#C8842A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Legs — alternating walk cycle */}
            <motion.path
              d="M13 34 Q12 40 10 46"
              stroke="#C8842A"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              animate={{ d: ["M13 34 Q12 40 10 46", "M13 34 Q14 40 16 46", "M13 34 Q12 40 10 46"] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M19 34 Q20 40 22 46"
              stroke="#C8842A"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              animate={{ d: ["M19 34 Q20 40 22 46", "M19 34 Q18 40 16 46", "M19 34 Q20 40 22 46"] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
            />
            {/* Shoes */}
            <motion.ellipse
              cx="10"
              cy="47"
              rx="4"
              ry="2.5"
              fill="#3D2510"
              animate={{ cx: [10, 16, 10] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="22"
              cy="47"
              rx="4"
              ry="2.5"
              fill="#3D2510"
              animate={{ cx: [22, 16, 22] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
            />
            {/* Hair tuft */}
            <path
              d="M16 2 Q18 -1 20 2"
              stroke="#3D2510"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Floating coffee beans */}
      <motion.div
        className="text-accent absolute opacity-40"
        style={{ right: "24px", bottom: "28px" }}
        animate={{ y: [0, -6, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="10" height="14" viewBox="0 0 14 20" fill="currentColor">
          <ellipse cx="7" cy="10" rx="6" ry="9" />
          <path
            d="M7 2 Q4 10 7 18"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </motion.div>
      <motion.div
        className="text-accent absolute opacity-30"
        style={{ left: "18px", bottom: "32px" }}
        animate={{ y: [0, -4, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <svg width="8" height="11" viewBox="0 0 14 20" fill="currentColor">
          <ellipse cx="7" cy="10" rx="6" ry="9" />
          <path
            d="M7 2 Q4 10 7 18"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </motion.div>
    </div>
  );
}

export default function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("hero");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const greeting = useMemo(() => getGreeting(locale), [locale]);
  const nameSuggestions = useMemo(() => getNameSuggestions(search, MOCK_CAFES), [search]);
  const smartSuggestions = useMemo(() => getSmartSuggestions(search, locale), [search, locale]);
  const showDropdown =
    focused && search.length >= 2 && (nameSuggestions.length > 0 || smartSuggestions.length > 0);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_KEYS.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setFocused(false);
    }
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  function handleSearch() {
    const q = search.trim().toLowerCase();
    const params = new URLSearchParams();

    let matched = false;
    for (const mapping of KEYWORD_TO_FILTER) {
      if (mapping.keywords.some((k) => q.includes(k))) {
        if (mapping.vibe) params.append("vibe", mapping.vibe);
        if (mapping.purpose) params.append("purpose", mapping.purpose);
        matched = true;
      }
    }

    if (q.includes("gần")) params.set("nearMe", "true");
    if (!matched && q) params.set("search", q);

    setFocused(false);
    router.push(`/${locale}/search${params.size ? `?${params}` : ""}`);
  }

  function handleQuickFilter({ vibe, purpose }: { vibe?: string; purpose?: string }) {
    const params = new URLSearchParams();
    if (vibe) params.set("vibe", vibe);
    if (purpose) params.set("purpose", purpose);
    router.push(`/${locale}/search?${params.toString()}`);
  }

  function handleSmartSearch(query: string) {
    setFocused(false);
    setSearch(query);
    const params = new URLSearchParams();
    const lower = query.toLowerCase();

    for (const mapping of KEYWORD_TO_FILTER) {
      if (mapping.keywords.some((k) => lower.includes(k))) {
        if (mapping.vibe) params.append("vibe", mapping.vibe);
        if (mapping.purpose) params.append("purpose", mapping.purpose);
      }
    }

    const districtMatch = lower.match(/qu[aậ]n\s*(\d+|[a-zÀ-ɏ\s]+)/i);
    if (districtMatch) {
      params.set("district", districtMatch[0].replace(/qu[aậ]n/i, "Quận").trim());
    }

    router.push(`/${locale}/search${params.size ? `?${params}` : ""}`);
  }

  return (
    <section className="border-border relative overflow-hidden border-b bg-(--background-secondary) pt-16">
      {/* Leaf accent — top left */}
      <svg
        className="leaf-1 text-accent pointer-events-none absolute top-6 left-4 opacity-[0.18] sm:left-10"
        width="28"
        height="36"
        viewBox="0 0 28 36"
        fill="currentColor"
        aria-hidden
      >
        <path d="M14 2 C6 8 2 18 6 28 C8 34 14 36 14 36 C14 36 20 34 22 28 C26 18 22 8 14 2Z" />
        <path
          d="M14 4 L14 34"
          stroke="white"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
      {/* Subtle background grain overlay for hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
        {/* Chibi walking animation */}
        <ChibiWalkAnimation />

        {/* Personalised time-based greeting */}
        <p className="mb-1 text-[11px] font-semibold tracking-[0.1em] text-[var(--accent)] uppercase">
          {greeting.sub}
        </p>
        <p className="mb-3 text-[13px] font-normal text-[var(--foreground-muted)]">
          {greeting.text}
        </p>

        <h1 className="font-display text-foreground mb-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t("headlineCompact")}
        </h1>
        <p className="mx-auto mb-5 max-w-xl text-base text-(--foreground-muted)">
          {t("subtitleCompact")}
        </p>

        {/* Search bar with autocomplete dropdown */}
        <div ref={containerRef} className="relative mx-auto flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search
              size={15}
              className={cn(
                "absolute top-1/2 left-3.5 -translate-y-1/2 transition-colors",
                focused ? "text-accent" : "text-(--foreground-muted)",
              )}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => setFocused(true)}
              placeholder={!search ? t(PLACEHOLDER_KEYS[placeholderIdx]) : undefined}
              className="border-border bg-background text-foreground focus:border-accent h-11 w-full rounded-xl border pr-4 pl-10 text-sm transition-all focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-accent h-11 shrink-0 rounded-xl px-6 text-sm font-semibold text-white transition-all hover:bg-(--accent-hover) active:scale-95"
          >
            {t("cta")}
          </button>

          {/* Autocomplete dropdown */}
          {showDropdown && (
            <div className="absolute top-[calc(100%+8px)] right-0 left-0 z-[200] max-h-[min(60vh,320px)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] text-left shadow-[0_8px_24px_rgba(44,26,14,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.32)]">
              {nameSuggestions.length > 0 && (
                <div className="border-b border-[var(--border)] py-2 last:border-b-0">
                  <div className="px-4 pt-1 pb-1 text-[11px] font-semibold tracking-[0.08em] text-[var(--foreground-muted)] uppercase">
                    {locale === "vi" ? "Quán cà phê" : "Cafés"}
                  </div>
                  {nameSuggestions.map((cafe) => (
                    <button
                      key={cafe.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setFocused(false);
                        router.push(`/${locale}/cafe/${cafe.slug}`);
                      }}
                      className="flex w-full items-center gap-3 bg-transparent px-4 py-2.5 text-left transition-colors hover:bg-[var(--background-secondary)]"
                    >
                      <span className="shrink-0 text-base">☕</span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-[var(--foreground)]">
                          {cafe.name}
                        </div>
                        <div className="truncate text-xs text-[var(--foreground-muted)]">
                          {cafe.district}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {smartSuggestions.length > 0 && (
                <div className="py-2 last:border-b-0">
                  <div className="px-4 pt-1 pb-1 text-[11px] font-semibold tracking-[0.08em] text-[var(--foreground-muted)] uppercase">
                    {locale === "vi" ? "Tìm kiếm" : "Search"}
                  </div>
                  {smartSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSmartSearch(s.query);
                      }}
                      className="flex w-full items-center gap-3 bg-transparent px-4 py-2.5 text-left transition-colors hover:bg-[var(--background-secondary)]"
                    >
                      <span className="shrink-0 text-base">🔍</span>
                      <div className="truncate text-sm font-medium text-[var(--foreground)]">
                        {s.label}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick filter chips */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {QUICK_FILTERS.map(({ emoji, vibe, purpose, labelKey }) => (
            <button
              key={labelKey}
              onClick={() => handleQuickFilter({ vibe, purpose })}
              className="border-border bg-background/80 hover:border-accent hover:text-accent flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm text-(--foreground-muted) transition-all duration-150 hover:bg-(--accent-light)"
            >
              <span>{emoji}</span>
              {t(labelKey)}
            </button>
          ))}
        </div>

        {/* Explore CTA */}
        <p className="mt-5 text-sm text-(--foreground-muted)">
          hoặc{" "}
          <a
            href={`/${locale}/search`}
            className="text-accent underline underline-offset-2 transition-colors hover:text-(--accent-hover)"
          >
            khám phá tất cả quán →
          </a>
        </p>
      </div>
    </section>
  );
}
