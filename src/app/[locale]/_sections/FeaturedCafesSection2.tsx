"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { MapPin, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys";
import { coverObjectPosition } from "@/lib/cover-image";
import { cn } from "@/lib/utils";
import { getCafeOpenStatus } from "@/lib/opening-hours";
import type { Cafe } from "@/types/cafe";
import { useTranslations } from "next-intl";

interface FeaturedCafesSection2Props {
  cafes: Cafe[];
  locale: string;
}

function saveReturnUrl() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(AUTH_STORAGE_KEYS.returnUrl, window.location.href);
  }
}

interface HeroCardProps {
  cafe: Cafe;
}

function HeroCard({ cafe }: HeroCardProps) {
  const openStatus = getCafeOpenStatus(cafe.openingTime, cafe.closingTime);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
      className="group relative col-span-2 overflow-hidden rounded-3xl border border-border bg-card"
    >
      <Link href={`/cafe/${cafe.slug}`} className="block h-full" onClick={saveReturnUrl}>
        <div className="relative h-85 overflow-hidden sm:h-105 lg:h-120">
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes="(max-width: 640px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: coverObjectPosition(cafe) }}
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-[#C8842A] to-[#6B3F1A]" />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          {/* Rank badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-yellow-900 shadow-lg">
              #1 Tuần này
            </span>
            {openStatus !== null && (
              <span className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm",
                openStatus ? "bg-[var(--status-open)] text-white" : "bg-black/50 text-white/70"
              )}>
                <span className={cn("h-1.5 w-1.5 rounded-full", openStatus ? "bg-white" : "bg-white/50")} />
                {openStatus ? "Đang mở" : "Đã đóng"}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            {cafe.oneLiner && (
              <p className="mb-2 text-sm italic text-white/60">&ldquo;{cafe.oneLiner}&rdquo;</p>
            )}
            <h3 className="font-display mb-1.5 text-2xl font-bold leading-snug text-white sm:text-3xl">
              {cafe.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="shrink-0" />
                {cafe.district}
              </span>
                </div>
            {cafe.vibes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cafe.vibes.slice(0, 3).map((v) => (
                  <span
                    key={v}
                    className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
                  >
                    {v}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

interface SmallCardProps {
  cafe: Cafe;
  delay: number;
  rank: number;
}

function SmallCard({ cafe, delay, rank }: SmallCardProps) {
  const openStatus = getCafeOpenStatus(cafe.openingTime, cafe.closingTime);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.33, 1, 0.68, 1] }}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-transform duration-200 hover:-translate-y-0.5"
    >
      <Link href={`/cafe/${cafe.slug}`} className="block" onClick={saveReturnUrl}>
        <div className="relative h-40 overflow-hidden bg-(--background-secondary) sm:h-48">
          {cafe.coverImage ? (
            <Image
              src={cafe.coverImage}
              alt={cafe.name}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ objectPosition: coverObjectPosition(cafe) }}
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-[#C8842A]/60 to-[#6B3F1A]/60" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

          {/* Rank */}
          <span className={cn(
            "absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow",
            rank === 2
              ? "bg-slate-300/90 text-slate-700"
              : "bg-amber-600/90 text-amber-100"
          )}>
            {rank === 2 ? "02" : "03"}
          </span>

          {openStatus !== null && (
            <span className={cn(
              "absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm",
              openStatus ? "bg-[var(--status-open)] text-white" : "bg-black/40 text-white/70"
            )}>
              <span className={cn("h-1.5 w-1.5 rounded-full", openStatus ? "bg-white" : "bg-white/50")} />
              {openStatus ? "Mở" : "Đóng"}
            </span>
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-display text-sm font-bold leading-snug text-white line-clamp-1 sm:text-base">
              {cafe.name}
            </h3>
            <p className="flex items-center gap-1 text-white/65 text-xs mt-0.5">
              <MapPin size={10} className="shrink-0" />
              {cafe.district}
            </p>
          </div>
        </div>

        <div className="px-4 py-3">
          {cafe.oneLiner && (
            <p className="text-xs text-(--foreground-muted) line-clamp-2 italic leading-relaxed">
              {cafe.oneLiner}
            </p>
          )}
          {cafe.vibes.length > 0 && (
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {cafe.vibes.slice(0, 2).map((v) => (
                <span
                  key={v}
                  className="rounded-full bg-(--background-secondary) px-2 py-0.5 text-[10px] text-(--foreground-muted)"
                >
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

const VIBE_STORIES = [
  {
    id: "quiet",
    label: "Yên tĩnh",
    emoji: "☁️",
    desc: "Không gian tập trung, chill một mình",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
    vibe: "yên tĩnh",
    color: "from-slate-600 to-slate-800",
  },
  {
    id: "nature",
    label: "Thiên nhiên",
    emoji: "🌿",
    desc: "Cây xanh, ánh sáng tự nhiên",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
    vibe: "thiên nhiên",
    color: "from-green-700 to-green-900",
  },
  {
    id: "vintage",
    label: "Vintage",
    emoji: "✨",
    desc: "Phong cách cổ điển, hoài niệm",
    image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80",
    vibe: "vintage",
    color: "from-amber-700 to-amber-900",
  },
  {
    id: "work",
    label: "Work-friendly",
    emoji: "💻",
    desc: "WiFi tốt, ổ điện đầy đủ",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    vibe: "hiện đại",
    color: "from-blue-700 to-blue-900",
  },
];

function VibeStoriesSection() {
  return (
    <section className="bg-(--background-secondary) py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              Tìm theo phong cách
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Quán nào hợp với bạn?
            </h2>
          </div>
          <Link
            href="/quiz"
            className="hidden items-center gap-1.5 text-sm font-medium text-accent hover:text-(--accent-hover) transition-colors sm:flex"
          >
            Làm trắc nghiệm
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {VIBE_STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.33, 1, 0.68, 1] }}
            >
              <Link
                href={`/search?vibes=${encodeURIComponent(story.vibe)}`}
                className="group relative block aspect-3/4 overflow-hidden rounded-2xl"
              >
                <Image
                  src={story.image}
                  alt={story.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className={cn("absolute inset-0 bg-linear-to-t opacity-70", story.color)} />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className="mb-1 text-2xl">{story.emoji}</span>
                  <p className="font-display text-sm font-bold text-white sm:text-base">{story.label}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-white/70 sm:text-xs">{story.desc}</p>
                </div>
                <div className="absolute inset-0 rounded-2xl ring-0 ring-white/20 transition-all duration-300 group-hover:ring-2" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-(--accent-hover)"
          >
            Làm trắc nghiệm tìm quán
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MapCtaBanner() {
  return (
    <section className="py-12 px-4 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-[#C8842A]"
        >
          {/* Background texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='white'/%3E%3C/svg%3E")`,
              backgroundSize: "30px 30px",
            }}
            aria-hidden
          />

          <div className="relative grid gap-8 px-8 py-10 sm:grid-cols-2 sm:items-center sm:px-12 sm:py-12 lg:px-16">
            {/* Left */}
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/70">
                <Clock size={14} />
                Cập nhật thường xuyên
              </p>
              <h2 className="font-display mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
                Khám phá bản đồ<br />cà phê TP.HCM
              </h2>
              <p className="mb-6 text-white/75 leading-relaxed">
                Hơn 500 quán trải khắp 19 quận — xem ngay trên bản đồ tương tác.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#C8842A] transition-all hover:bg-white/90 active:scale-95"
                >
                  Khám phá ngay
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/contribute"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20"
                >
                  Đóng góp quán
                </Link>
              </div>
            </div>

            {/* Right: stat grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: "500+", label: "Quán cà phê" },
                { num: "19", label: "Quận / Huyện" },
                { num: "8", label: "Phong cách vibe" },
                { num: "24h", label: "Cập nhật" },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <p className="font-display text-2xl font-bold text-white">{num}</p>
                  <p className="mt-0.5 text-xs text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function FeaturedCafesSection2({ cafes, locale: _locale }: FeaturedCafesSection2Props) {
  void _locale;
  const t = useTranslations("featured");
  const featured = cafes.slice(0, 3);

  if (featured.length === 0) return null;

  const [first, second, third] = featured;

  return (
    <>
      {/* Featured section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-7 flex items-end justify-between"
        >
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
              {t("weeklyFavourite")}
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("mustVisit")}
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden items-center gap-1.5 text-sm font-medium text-accent hover:text-(--accent-hover) transition-colors sm:flex"
          >
            {t("viewAll")}
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Magazine grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {/* Hero card (spans 2 cols on desktop, full on mobile) */}
          {first && <HeroCard cafe={first} />}

          {/* Side cards (stacked on desktop) */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {second && <SmallCard cafe={second} delay={0.1} rank={2} />}
            {third && <SmallCard cafe={third} delay={0.18} rank={3} />}
          </div>
        </div>

        {/* Mobile view all */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-(--accent-hover)"
          >
            {t("viewAllMobile")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Vibe stories section */}
      <VibeStoriesSection />

      {/* Map CTA banner */}
      <MapCtaBanner />
    </>
  );
}
