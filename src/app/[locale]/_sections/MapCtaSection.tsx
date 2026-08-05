"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function MapCtaSection() {
  const t = useTranslations("map");
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className="relative isolate overflow-hidden px-4 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,#fdf6ec_0%,#f6ead4_48%,#fdf6ec_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.7%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.34%22/%3E%3C/svg%3E')] opacity-[0.04] mix-blend-multiply" />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex min-h-[400px] items-end overflow-hidden rounded-[28px] border border-[#ead8bf]/80 bg-[#2c1a0e] shadow-[0_26px_70px_rgba(91,58,29,0.18)] ring-1 ring-white/45 dark:ring-white/10"
        >
          {/* Map background */}
          <Image
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80"
            alt="Map view"
            fill
            sizes="100vw"
            className="object-cover opacity-88 saturate-[0.9] sepia-[0.14]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,214,145,0.30),transparent_30%),linear-gradient(to_top,rgba(23,12,4,0.90)_0%,rgba(42,22,7,0.56)_50%,rgba(255,226,181,0.10)_100%)]" />
          <div className="pointer-events-none absolute inset-0 [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.8%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.22%22/%3E%3C/svg%3E')] opacity-[0.08] mix-blend-screen" />
          <div className="pointer-events-none absolute top-9 right-8 hidden h-36 w-56 rotate-[-13deg] rounded-[50%] border-t border-dashed border-[#ffe3b7]/26 md:block" />
          <div className="pointer-events-none absolute right-[23%] bottom-9 hidden h-16 w-28 rotate-[15deg] rounded-[50%] border-t border-dashed border-[#ffe3b7]/22 lg:block" />

          {/* Content overlay */}
          <div className="relative z-10 w-full p-6 sm:p-8 md:p-12">
            <div className="max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.12 }}
              >
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/24 bg-[#fff1d6]/12 px-3 py-1.5 text-xs font-black tracking-[0.12em] text-[#ffd891] uppercase shadow-[0_10px_26px_rgba(0,0,0,0.18)] backdrop-blur-md">
                  <MapPin size={16} />
                  {t("city")}
                </p>
                <h2 className="font-lora mb-4 text-3xl leading-tight font-bold text-[#fff7e8] sm:text-4xl md:text-5xl">
                  {t("title")}
                </h2>
                <p className="mb-6 max-w-md text-sm leading-6 text-[#fff0d4]/76">{t("subtitle")}</p>
                <Button
                  render={<Link href="/map" />}
                  variant="default"
                  size="lg"
                  className="min-h-11 rounded-full border border-[#ffe3b7]/28 bg-[#f4b35d] px-5 font-black text-[#2c1a0e] shadow-[0_14px_34px_rgba(244,179,93,0.28)] hover:-translate-y-0.5 hover:bg-[#ffd891] focus-visible:ring-[#ffe3b7]/70"
                >
                  <MapPin size={16} />
                  {t("cta")}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Floating stat cards */}
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.24 }}
            className="absolute top-6 right-6 hidden flex-col gap-3 md:flex"
          >
            {[
              { num: "500+", label: t("statCafes") },
              { num: "19", label: t("statDistricts") },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="min-w-[120px] rounded-2xl border border-[#ffe3b7]/18 bg-[#fff1d6]/12 px-4 py-3 text-center shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-md"
              >
                <p className="font-display text-2xl font-black text-[#fff7e8]">{num}</p>
                <p className="mt-0.5 text-xs font-semibold text-[#fff0d4]/64">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
