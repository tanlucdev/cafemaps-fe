import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, BookOpen, Clock, MapPin, Sparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { getLocalizedBlogPosts } from "@/lib/blog-data"
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata"
import { cn } from "@/lib/utils"

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

const accentClass = {
  amber: "bg-[#fff1d8] text-[#8a551b] border-[#e6c28b]",
  sage: "bg-[#eaf2eb] text-[#496f4d] border-[#c8ddca]",
  rose: "bg-[#f9e7e2] text-[#8a4b3f] border-[#edc9bf]",
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params
  const normalizedLocale = normalizeLocale(locale)

  return createLocalizedMetadata({
    locale,
    pathname: "/blog",
    title: normalizedLocale === "vi" ? "Blog Cafe Maps" : "Cafe Maps Blog",
    description:
      normalizedLocale === "vi"
        ? "Những câu chuyện, gợi ý và cẩm nang nhỏ để chọn quán cà phê hợp mood tại TP.HCM."
        : "Stories, guides, and small notes for finding the right cafe mood in Ho Chi Minh City.",
  })
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  const normalizedLocale = normalizeLocale(locale)
  const posts = getLocalizedBlogPosts(locale)
  const [featuredPost, ...otherPosts] = posts

  return (
    <main className="bg-[var(--background)] pt-[62px]">
      <section className="relative min-h-[420px] overflow-hidden border-b border-[#ead8bf]">
        <Image
          src={featuredPost.heroImage}
          alt={featuredPost.heroImageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(44,26,14,0.78),rgba(44,26,14,0.42),rgba(44,26,14,0.18))]" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/14 px-3 py-1.5 text-xs font-bold tracking-[0.12em] uppercase backdrop-blur-md">
              <BookOpen size={14} aria-hidden="true" />
              {normalizedLocale === "vi" ? "Cafe Maps Blog" : "Cafe Maps Blog"}
            </div>
            <h1 className="font-display text-4xl leading-[1.04] font-extrabold sm:text-5xl lg:text-6xl">
              {normalizedLocale === "vi"
                ? "Những ghi chú nhỏ cho người thích đi cà phê"
                : "Small notes for people who love cafe-hopping"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/84 sm:text-lg">
              {normalizedLocale === "vi"
                ? "Review nhẹ, cẩm nang chọn quán và vài moodboard đủ ấm để bạn tìm thấy chỗ ngồi hợp với hôm nay."
                : "Gentle reviews, practical cafe guides, and warm moodboards for finding today's right table."}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group overflow-hidden rounded-[8px] border border-[#ead8bf] bg-[#fff8ed] shadow-[0_16px_44px_rgba(91,58,29,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_54px_rgba(91,58,29,0.12)] dark:border-white/10 dark:bg-[#2a2825]"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={featuredPost.heroImage}
                alt={featuredPost.heroImageAlt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
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
              <h2 className="mt-4 font-display text-2xl leading-tight font-extrabold text-[var(--foreground)] sm:text-3xl">
                {featuredPost.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)] sm:text-[15px]">
                {featuredPost.excerpt}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--accent-hover)]">
                {normalizedLocale === "vi" ? "Đọc bài nổi bật" : "Read featured story"}
                <ArrowRight size={16} aria-hidden="true" className="transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <div className="grid gap-3">
            <div className="rounded-[8px] border border-[#ead8bf] bg-[#f7ecd8] p-5 dark:border-white/10 dark:bg-[#242220]">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#c8842a] text-white">
                <Sparkles size={18} aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-extrabold text-[var(--foreground)]">
                {normalizedLocale === "vi" ? "Đọc theo mood" : "Read by mood"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                {normalizedLocale === "vi"
                  ? "Mỗi bài là một lát cắt nhỏ của đời sống cà phê: làm việc, đi một mình, hẹn cuối tuần hoặc chỉ tìm chút nắng."
                  : "Each story captures a small slice of cafe life: working, going solo, weekend dates, or finding a little sun."}
              </p>
            </div>

            {otherPosts.slice(0, 2).map((post) => (
              <BlogMiniCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.14em] text-[#a86d1e] uppercase">
              {normalizedLocale === "vi" ? "Bài mới" : "Latest"}
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight font-extrabold text-[var(--foreground)]">
              {normalizedLocale === "vi" ? "Gợi ý để đọc chậm" : "Notes worth reading slowly"}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-[8px] border border-[#ead8bf] bg-[#fff8ed] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(91,58,29,0.10)] dark:border-white/10 dark:bg-[#2a2825]"
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
                  <h3 className="mt-3 font-display text-xl leading-tight font-extrabold text-[var(--foreground)]">
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
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function BlogMiniCard({ post }: { post: ReturnType<typeof getLocalizedBlogPosts>[number] }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-[112px_1fr] overflow-hidden rounded-[8px] border border-[#ead8bf] bg-[#fff8ed] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(91,58,29,0.08)] dark:border-white/10 dark:bg-[#2a2825]"
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
        <h3 className="mt-2 line-clamp-2 font-display text-lg leading-tight font-extrabold text-[var(--foreground)]">
          {post.title}
        </h3>
        <p className="mt-2 text-xs font-semibold text-[var(--foreground-muted)]">{post.readTime}</p>
      </div>
    </Link>
  )
}
