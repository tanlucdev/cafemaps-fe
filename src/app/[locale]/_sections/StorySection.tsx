"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface StorySectionProps {
  locale: string;
}

const STORIES = [
  {
    id: "vintage" as const,
    image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80",
    tag: "vintage",
  },
  {
    id: "nature" as const,
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
    tag: "thiên nhiên",
  },
  {
    id: "minimalist" as const,
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
    tag: "minimalist",
  },
];

export default function StorySection({ locale: _locale }: StorySectionProps) {
  void _locale;
  const t = useTranslations("story");

  return (
    <section className="bg-[var(--background-secondary)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 text-xs font-semibold tracking-wider text-[var(--accent)] uppercase">
            {t("label")}
          </p>
          <h2 className="font-display mb-4 text-4xl font-bold text-[var(--foreground)] sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[var(--foreground-muted)]">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Story cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
            >
              <Link
                href={`/?vibe=${encodeURIComponent(story.tag)}`}
                className="group card-shadow block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.tag}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-4 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {story.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display mb-2 text-xl font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {t(`items.${story.id}.title`)}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-[var(--foreground-muted)]">
                    {t(`items.${story.id}.description`)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="hover-underline inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
          >
            {t("cta")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
