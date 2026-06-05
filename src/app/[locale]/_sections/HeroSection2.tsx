"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Search, Navigation, Loader2, Coffee, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  buildSearchParams,
  clearLastSearchState,
  getLastSearchState,
  setLastSearchState,
  type LastSearchState,
} from "@/lib/search-state";
import { MOCK_CAFES } from "@/lib/mock-data";

interface HeroSection2Props {
  locale: string;
}

const QUICK_TAGS = [
  { emoji: "☁️", label: "Yên tĩnh", vibe: "yên tĩnh" },
  { emoji: "🌿", label: "Thiên nhiên", vibe: "thiên nhiên" },
  { emoji: "✨", label: "Vintage", vibe: "vintage" },
  { emoji: "💻", label: "Work-friendly", purpose: "làm việc" },
  { emoji: "🌙", label: "Tối muộn", vibe: "nhộn nhịp" },
  { emoji: "💕", label: "Hẹn hò", purpose: "hẹn hò" },
];

const STATS = [
  { value: "500+", label: "Quán cà phê" },
  { value: "19", label: "Quận / Huyện" },
  { value: "10k+", label: "Lượt tìm kiếm" },
];

const PLACEHOLDER_CYCLE = [
  "Tìm chỗ làm việc yên tĩnh...",
  "Hẹn hò cuối tuần...",
  "Cà phê sáng gần nhà...",
  "Quán vintage Quận 3...",
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1600&q=85",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1600&q=85",
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1600&q=85",
];

const HERO_IMAGE_ALTS = [
  "Không gian quán cà phê ấm cúng",
  "Quầy pha chế cà phê cổ điển",
  "Góc quán cà phê sáng tự nhiên",
];

function normalize(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function getNameSuggestions(input: string) {
  if (input.length < 2) return [];
  const q = normalize(input);
  return MOCK_CAFES.filter(
    (c) => normalize(c.name).includes(q) || c.name.toLowerCase().includes(input.toLowerCase()),
  ).slice(0, 5);
}

export default function HeroSection2({ locale }: HeroSection2Props) {
  const t = useTranslations("hero");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [bgIdx, setBgIdx] = useState(0);
  const [lastSearch, setLastSearch] = useState<LastSearchState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const nameSuggestions = useMemo(() => getNameSuggestions(search), [search]);
  const showDropdown = focused && search.length >= 2 && nameSuggestions.length > 0;

  useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_CYCLE.length), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBgIdx((i) => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setLastSearch(getLastSearchState());
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
    const q = search.trim();
    setFocused(false);
    const params = buildSearchParams({ search: q || undefined }, "popular").toString();
    if (q) {
      setLastSearchState({ query: q, filter: { search: q }, sort: "popular", params });
    }
    router.push(`/search${params ? `?${params}` : ""}`);
  }

  function handleQuickTag({ vibe, purpose }: { vibe?: string; purpose?: string }) {
    const filter = { vibes: vibe ? [vibe] : undefined, purposes: purpose ? [purpose] : undefined };
    const params = buildSearchParams(filter, "popular").toString();
    setLastSearchState({ filter, sort: "popular", params });
    router.push(`/search?${params}`);
  }

  function handleNearMe() {
    if (!navigator.geolocation) { router.push("/search"); return; }
    setNearbyLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const filter = { nearMe: true, lat: coords.latitude, lng: coords.longitude, radiusKm: 2 };
        const params = buildSearchParams(filter, "popular").toString();
        setLastSearchState({ filter, sort: "popular", params });
        setNearbyLoading(false);
        router.push(`/search?${params}`);
      },
      () => { setNearbyLoading(false); router.push("/search"); },
    );
  }

  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden pt-16">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((img, i) => (
          <motion.div
            key={img}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === bgIdx ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={HERO_IMAGE_ALTS[i]}
              aria-hidden
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />
      </div>

      {/* Slideshow dots */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-1.5" aria-hidden>
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setBgIdx(i)}
            className={cn(
              "rounded-full transition-all duration-300 cursor-pointer",
              i === bgIdx ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40",
            )}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">

        {/* Resume last search banner */}
        {lastSearch && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white backdrop-blur-md"
          >
            <Search size={14} className="shrink-0 opacity-70" />
            <span className="opacity-80">Tiếp tục:</span>
            <span className="font-medium truncate max-w-45">
              {lastSearch.query || lastSearch.filter.vibes?.join(", ") || "tìm kiếm trước"}
            </span>
            <button
              onClick={() => router.push(`/search?${lastSearch.params}`)}
              className="ml-1 shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30 transition-colors cursor-pointer"
            >
              Xem
            </button>
            <button
              onClick={() => { clearLastSearchState(); setLastSearch(null); }}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Đóng"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex items-center gap-2"
        >
          <span className="flex items-center gap-1.5 rounded-full border border-[#C8842A]/60 bg-[#C8842A]/20 px-3.5 py-1 text-xs font-semibold tracking-widest text-[#F5D09A] uppercase backdrop-blur-sm">
            <Coffee size={11} />
            TP. Hồ Chí Minh
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display mb-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Tìm quán cà phê{" "}
          <span className="text-[#F5D09A]">hoàn hảo</span>
          <br className="hidden sm:block" />
          {" "}cho khoảnh khắc của bạn
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 max-w-xl text-base text-white/70 sm:text-lg"
        >
          Khám phá {STATS[0].value} quán cà phê đẹp nhất TP.HCM — từ góc làm việc yên tĩnh đến buổi hẹn hò lãng mạn.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          ref={containerRef}
          className="relative w-full max-w-2xl"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className={cn(
                  "absolute top-1/2 left-4 -translate-y-1/2 transition-colors",
                  focused ? "text-[#C8842A]" : "text-white/50",
                )}
              />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => setFocused(true)}
                placeholder={PLACEHOLDER_CYCLE[placeholderIdx]}
                className="h-14 w-full rounded-2xl border border-white/20 bg-white/10 pl-12 pr-4 text-sm text-white placeholder-white/40 backdrop-blur-md transition-all outline-none focus:border-[#C8842A]/60 focus:bg-white/15 sm:text-base"
              />
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="h-14 shrink-0 cursor-pointer rounded-2xl bg-[#C8842A] px-6 text-sm font-bold text-white transition-all hover:bg-[#A86A1A] active:scale-95 sm:px-8 sm:text-base"
            >
              {t("cta")}
            </button>

            {/* Near me button */}
            <button
              type="button"
              onClick={handleNearMe}
              disabled={nearbyLoading}
              aria-label="Gần đây"
              className="flex h-14 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 backdrop-blur-md transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {nearbyLoading ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                <Navigation size={18} className="text-white" />
              )}
            </button>
          </div>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl"
              >
                <div className="px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 px-1 pt-1 pb-2">
                    Quán cà phê
                  </p>
                  {nameSuggestions.map((cafe) => (
                    <button
                      key={cafe.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setFocused(false);
                        router.push(`/cafe/${cafe.slug}`);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/10 cursor-pointer"
                    >
                      <MapPin size={14} className="shrink-0 text-[#C8842A]" />
                      <div>
                        <p className="text-sm font-medium text-white">{cafe.name}</p>
                        <p className="text-xs text-white/50">{cafe.district}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick tags */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {QUICK_TAGS.map(({ emoji, label, vibe, purpose }) => (
            <button
              key={label}
              onClick={() => handleQuickTag({ vibe, purpose })}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm text-white/80 backdrop-blur-sm transition-all hover:border-[#C8842A]/60 hover:bg-[#C8842A]/20 hover:text-[#F5D09A] active:scale-95"
            >
              <span className="text-base leading-none">{emoji}</span>
              {label}
            </button>
          ))}
          <Link
            href="/search"
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm text-white/80 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/15"
          >
            <Sparkles size={13} />
            Xem tất cả
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex items-center gap-6 sm:gap-10"
        >
          {STATS.map(({ value, label }, i) => (
            <div key={label} className="flex items-center gap-4">
              {i > 0 && <div className="h-8 w-px bg-white/20" />}
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">{value}</p>
                <p className="text-xs text-white/50 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="text-xs font-medium tracking-widest text-white/40 uppercase">Cuộn xuống</p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-linear-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
