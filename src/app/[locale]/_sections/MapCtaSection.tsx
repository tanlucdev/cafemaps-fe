"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function MapCtaSection() {
  const t = useTranslations("map")

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-end"
        >
          {/* Map background */}
          <Image
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80"
            alt="Map view"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content overlay */}
          <div className="relative z-10 p-8 md:p-12 w-full">
            <div className="max-w-lg">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="flex items-center gap-2 text-[var(--accent)] text-sm font-medium mb-3">
                  <MapPin size={16} />
                  {t("city")}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {t("title")}
                </h2>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {t("subtitle")}
                </p>
                <Button
                  variant="link"
                  size="lg"
                  onClick={() => {
                    window.open(
                      "https://www.google.com/maps/search/cafe+ho+chi+minh",
                      "_blank"
                    )
                  }}
                >
                  <MapPin size={16} />
                  {t("cta")}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Floating stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute top-6 right-6 hidden md:flex flex-col gap-3"
          >
            {[
              { num: "500+", label: t("statCafes") },
              { num: "19", label: t("statDistricts") },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="glass rounded-xl px-4 py-3 text-center min-w-[120px]"
              >
                <p className="font-display text-2xl font-bold text-white">
                  {num}
                </p>
                <p className="text-white/60 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
