import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock, MapPin, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getLocalizedBlogPosts } from "@/lib/blog-data";
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { BlogCardMotion, BlogHeroMotion, BlogReveal } from "./BlogMotion";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

const accentClass = {
  amber: "bg-[#fff1d8] text-[#8a551b] border-[#e6c28b]",
  sage: "bg-[#eaf2eb] text-[#496f4d] border-[#c8ddca]",
  rose: "bg-[#f9e7e2] text-[#8a4b3f] border-[#edc9bf]",
};

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);

  return createLocalizedMetadata({
    locale,
    pathname: "/blog",
    title: normalizedLocale === "vi" ? "Blog Cafe Maps" : "Cafe Maps Blog",
    description:
      normalizedLocale === "vi"
        ? "Những câu chuyện, gợi ý và cẩm nang nhỏ để chọn quán cà phê hợp mood tại TP.HCM."
        : "Stories, guides, and small notes for finding the right cafe mood in Ho Chi Minh City.",
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const posts = getLocalizedBlogPosts(locale);
  const [featuredPost, ...otherPosts] = posts;

  return (
    <main className="bg-[var(--background)]">
      <BlogHeroMotion className="relative isolate min-h-[620px] overflow-hidden bg-[var(--background)] p-2 pt-[calc(74px+0.5rem)] sm:p-3 sm:pt-[calc(74px+0.75rem)] md:p-4 md:pt-[calc(74px+1rem)]">
        <div className="relative min-h-[520px] overflow-hidden rounded-[24px] border border-[#ffe3b7]/20 bg-[#4a2a16] shadow-[0_22px_62px_rgba(18,10,5,0.24),0_12px_42px_rgba(245,166,58,0.12)] sm:rounded-[30px] md:min-h-[560px] md:rounded-[36px]">
          <Image
            src={featuredPost.heroImage}
            alt={featuredPost.heroImageAlt}
            fill
            priority
            className="object-cover brightness-[1.04] contrast-[0.98] saturate-[1.06]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(55,31,12,0.08)_0%,rgba(184,108,42,0.06)_42%,rgba(26,14,6,0.48)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,11,5,0.72)_0%,rgba(60,34,18,0.48)_42%,rgba(94,54,28,0.16)_68%,rgba(28,15,6,0.28)_100%)]" />
          <div className="absolute inset-0 [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.78%22_numOctaves=%222%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.48%22/%3E%3C/svg%3E')] opacity-[0.08] mix-blend-overlay" />
          <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl flex-col justify-end px-5 py-10 sm:px-8 md:min-h-[560px] md:px-10 lg:px-14 lg:py-14">
            <div className="max-w-3xl text-white">
              <BlogReveal>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/28 bg-[#3a2112]/34 px-3.5 py-2 text-xs font-bold tracking-[0.12em] text-[#ffe7bd] uppercase shadow-[0_10px_28px_rgba(0,0,0,0.12),0_8px_24px_rgba(245,166,58,0.08)] backdrop-blur-md">
                  <BookOpen size={14} aria-hidden="true" />
                  {normalizedLocale === "vi" ? "Cafe Maps Blog" : "Cafe Maps Blog"}
                </div>
              </BlogReveal>
              <BlogReveal delay={0.08}>
                <h1 className="font-system sm:font-lora text-[42px] leading-[1.02] font-bold text-[#fff7e8] drop-shadow-[0_8px_28px_rgba(0,0,0,0.48)] sm:text-[58px] md:text-[68px] lg:text-[76px]">
                  {normalizedLocale === "vi"
                    ? "Những ghi chú nhỏ cho người thích đi cà phê"
                    : "Small notes for people who love cafe-hopping"}
                </h1>
              </BlogReveal>
              <BlogReveal delay={0.16}>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 font-semibold text-[#fff0d4]/92 drop-shadow-[0_5px_18px_rgba(0,0,0,0.34)] sm:text-[17px] sm:leading-8">
                  {normalizedLocale === "vi"
                    ? "Review nhẹ, cẩm nang chọn quán và vài moodboard đủ ấm để bạn tìm thấy chỗ ngồi hợp với hôm nay."
                    : "Gentle reviews, practical cafe guides, and warm moodboards for finding today's right table."}
                </p>
              </BlogReveal>
            </div>
          </div>
        </div>
      </BlogHeroMotion>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <BlogReveal>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block overflow-hidden rounded-[24px] border border-[#ead8bf]/80 bg-[#fff8ed] shadow-[0_16px_44px_rgba(91,58,29,0.08)] transition hover:shadow-[0_20px_54px_rgba(91,58,29,0.12)] dark:border-white/10 dark:bg-[#2a2825]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={featuredPost.heroImage}
                  alt={featuredPost.heroImageAlt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 54vw, 100vw"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold",
                      accentClass[featuredPost.accent],
                    )}
                  >
                    {featuredPost.category}
                  </span>
                  <span className="text-xs font-semibold text-[var(--foreground-muted)]">
                    {featuredPost.dateLabel}
                  </span>
                </div>
                <h2 className="font-display mt-4 text-2xl leading-tight font-extrabold text-[var(--foreground)] sm:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)] sm:text-[15px]">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--accent-hover)]">
                  {normalizedLocale === "vi" ? "Đọc bài nổi bật" : "Read featured story"}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          </BlogReveal>

          <div className="grid gap-3">
            <BlogReveal
              delay={0.08}
              className="rounded-[24px] border border-[#ead8bf]/80 bg-[#fff8ed] p-6 shadow-[0_16px_44px_rgba(91,58,29,0.06)] dark:border-white/10 dark:bg-[#242220]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c8842a] text-white">
                <Sparkles size={18} aria-hidden="true" />
              </div>
              <h2 className="font-display mt-4 text-2xl font-extrabold text-[var(--foreground)]">
                {normalizedLocale === "vi" ? "Đọc theo mood" : "Read by mood"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                {normalizedLocale === "vi"
                  ? "Mỗi bài là một lát cắt nhỏ của đời sống cà phê: làm việc, đi một mình, hẹn cuối tuần hoặc chỉ tìm chút nắng."
                  : "Each story captures a small slice of cafe life: working, going solo, weekend dates, or finding a little sun."}
              </p>
            </BlogReveal>

            {otherPosts.slice(0, 2).map((post, index) => (
              <BlogReveal key={post.slug} delay={0.14 + index * 0.06}>
                <BlogMiniCard post={post} />
              </BlogReveal>
            ))}
          </div>
        </div>

        <BlogReveal className="mt-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.14em] text-[#a86d1e] uppercase">
              {normalizedLocale === "vi" ? "Bài mới" : "Latest"}
            </p>
            <h2 className="font-display mt-2 text-3xl leading-tight font-extrabold text-[var(--foreground)]">
              {normalizedLocale === "vi" ? "Gợi ý để đọc chậm" : "Notes worth reading slowly"}
            </h2>
          </div>
        </BlogReveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCardMotion
              key={post.slug}
              index={index}
              className="overflow-hidden rounded-[24px] border border-[#ead8bf]/80 bg-[#fff8ed] transition hover:shadow-[0_18px_42px_rgba(91,58,29,0.10)] dark:border-white/10 dark:bg-[#2a2825]"
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.heroImage}
                    alt={post.heroImageAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="p-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold",
                      accentClass[post.accent],
                    )}
                  >
                    {post.category}
                  </span>
                  <h3 className="font-display mt-3 text-xl leading-tight font-extrabold text-[var(--foreground)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-[#7b5631] dark:text-[#d8bd99]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} aria-hidden="true" />
                      {post.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} aria-hidden="true" />
                      {post.location}
                    </span>
                  </div>
                </div>
              </Link>
            </BlogCardMotion>
          ))}
        </div>
      </section>
    </main>
  );
}

function BlogMiniCard({ post }: { post: ReturnType<typeof getLocalizedBlogPosts>[number] }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-[112px_1fr] overflow-hidden rounded-[20px] border border-[#ead8bf]/80 bg-[#fff8ed] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(91,58,29,0.08)] dark:border-white/10 dark:bg-[#2a2825]"
    >
      <div className="relative min-h-[132px] overflow-hidden">
        <Image
          src={post.heroImage}
          alt={post.heroImageAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="112px"
        />
      </div>
      <div className="p-4">
        <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#a86d1e] uppercase">
          {post.mood}
        </p>
        <h3 className="font-display mt-2 line-clamp-2 text-lg leading-tight font-extrabold text-[var(--foreground)]">
          {post.title}
        </h3>
        <p className="mt-2 text-xs font-semibold text-[var(--foreground-muted)]">{post.readTime}</p>
      </div>
    </Link>
  );
}
