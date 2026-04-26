"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface StorySectionProps {
  locale: string
}

const STORIES = [
  {
    id: "vintage",
    title: "Vintage & Retro",
    description:
      "Những không gian đưa bạn trở về thập niên 80–90 với đồ nội thất cổ điển và âm nhạc hoài cổ.",
    image:
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80",
    tag: "vintage",
  },
  {
    id: "nature",
    title: "Thiên nhiên xanh mát",
    description:
      "Thoát khỏi nhịp sống đô thị ồn ào, tận hưởng cà phê giữa vườn cây và ánh sáng tự nhiên.",
    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
    tag: "thiên nhiên",
  },
  {
    id: "minimalist",
    title: "Minimalist & Hiện đại",
    description:
      "Thiết kế tối giản, không gian yên tĩnh — lý tưởng để làm việc tập trung hay suy nghĩ sâu.",
    image:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
    tag: "minimalist",
  },
]

export default function StorySection({ locale }: StorySectionProps) {
  const t = useTranslations("story")

  return (
    <section className="py-20 bg-[var(--background-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
            Stories
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-4">
            {t("title")}
          </h2>
          <p className="text-[var(--foreground-muted)] text-base max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Story cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
            >
              <Link
                href={`/${locale}?vibe=${encodeURIComponent(story.tag)}`}
                className="block group rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] card-shadow hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-white text-xs font-medium px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    {story.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed line-clamp-2">
                    {story.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover-underline"
          >
            {t("cta")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
