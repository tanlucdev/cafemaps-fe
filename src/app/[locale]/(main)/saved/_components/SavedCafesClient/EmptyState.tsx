"use client";

import ChristmasArt from "@/components/seasonal/ChristmasArt";
import seasonal from "@/components/seasonal/SeasonalPages.module.css";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Bookmark, Compass } from "lucide-react";

export function EmptyState({ title, subtitle, cta }: { title: string; subtitle: string; cta: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] border border-[#ffe3b7]/55 bg-[#1f1209] px-5 py-14 text-center shadow-[0_22px_70px_rgba(44,26,14,0.16)] sm:px-8 sm:py-18"
    >
      <Image
        src="/image/home-polaroid-2.jpg"
        alt=""
        fill
        sizes="(min-width: 768px) 70vw, 100vw"
        className="object-cover opacity-58"
      />
      <div className={`${seasonal.photoScrim} absolute inset-0 bg-linear-to-t from-[#1f1209]/95 via-[#1f1209]/60 to-[#1f1209]/18`} />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ffe3b7]/24 bg-[#fff0d2]/12 text-[#ffd18c] shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur">
          <span className={seasonal.emptyIcon}><Bookmark size={25} /></span>
          <ChristmasArt kind="gift" className={seasonal.emptyArt} />
        </div>
        <h2 className="font-lora text-2xl font-bold leading-tight text-[#fff7e8] sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-xs text-sm leading-6 text-[#fff0d2]/78">{subtitle}</p>
        <Link href="/search" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--accent-foreground)] shadow-[0_12px_34px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd18c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f1209]">
          <Compass size={16} />
          {cta}
        </Link>
      </div>
    </motion.section>
  )
}
