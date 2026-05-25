import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, UserRound } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { blogPosts, getLocalizedBlogPost, getRelatedBlogPosts } from "@/lib/blog-data"
import { createLocalizedMetadata, normalizeLocale } from "@/lib/metadata"

interface BlogDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getLocalizedBlogPost(slug, locale)

  if (!post) {
    return {
      title: normalizeLocale(locale) === "vi" ? "Không tìm thấy bài viết" : "Post not found",
    }
  }

  return createLocalizedMetadata({
    locale,
    pathname: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    image: post.heroImage,
    imageAlt: post.heroImageAlt,
  })
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params
  const normalizedLocale = normalizeLocale(locale)
  const post = getLocalizedBlogPost(slug, locale)

  if (!post) notFound()

  const relatedPosts = getRelatedBlogPosts(post.slug, locale)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    datePublished: post.dateLabel,
    inLanguage: normalizedLocale === "vi" ? "vi-VN" : "en-US",
  }

  return (
    <main className="bg-[var(--background)] pt-[62px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="border-b border-[#ead8bf] bg-[#f7ecd8] dark:border-white/10 dark:bg-[#242220]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
            <div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-extrabold text-[#8a551b] transition hover:text-[var(--accent-hover)] dark:text-[#e5b56d]"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                {normalizedLocale === "vi" ? "Về blog" : "Back to blog"}
              </Link>
              <div className="mt-7 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#e6c28b] bg-[#fff1d8] px-3 py-1 text-xs font-extrabold text-[#8a551b]">
                  {post.category}
                </span>
                <span className="text-xs font-semibold text-[var(--foreground-muted)]">
                  {post.dateLabel}
                </span>
              </div>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] font-extrabold text-[var(--foreground)] sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">
                {post.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-[#7b5631] dark:text-[#d8bd99]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={15} aria-hidden="true" />
                  {post.readTime}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} aria-hidden="true" />
                  {post.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserRound size={15} aria-hidden="true" />
                  {post.author}
                </span>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-white/60 shadow-[0_20px_54px_rgba(91,58,29,0.16)] dark:border-white/10">
              <Image
                src={post.heroImage}
                alt={post.heroImageAlt}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,760px)_320px] lg:px-8">
          <div>
            <p className="font-lora text-xl leading-9 text-[var(--foreground)] sm:text-2xl sm:leading-10">
              {post.intro}
            </p>

            <blockquote className="my-8 border-l-4 border-[#c8842a] bg-[#fff8ed] px-5 py-4 font-lora text-xl leading-9 font-semibold text-[#5f3b1f] dark:bg-[#2a2825] dark:text-[#f0d7b4]">
              {post.pullQuote}
            </blockquote>

            <div className="space-y-8">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-2xl font-extrabold text-[var(--foreground)]">
                    {section.heading}
                  </h2>
                  <p className="mt-3 text-[16px] leading-8 text-[var(--foreground-muted)]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[8px] border border-[#ead8bf] bg-[#fff8ed] p-5 dark:border-white/10 dark:bg-[#2a2825]">
              <p className="text-xs font-extrabold tracking-[0.14em] text-[#a86d1e] uppercase">
                {normalizedLocale === "vi" ? "Ghi chú nhanh" : "Quick notes"}
              </p>
              <ul className="mt-4 space-y-3">
                {post.checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--foreground-muted)]">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf2eb] text-[#496f4d]">
                      <Check size={13} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>

      <section className="mx-auto max-w-7xl border-t border-[#ead8bf] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold text-[var(--foreground)]">
            {normalizedLocale === "vi" ? "Đọc tiếp" : "Read next"}
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--accent-hover)]"
          >
            {normalizedLocale === "vi" ? "Tất cả bài viết" : "All posts"}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {relatedPosts.map((relatedPost) => (
            <Link
              key={relatedPost.slug}
              href={`/blog/${relatedPost.slug}`}
              className="group grid grid-cols-[120px_1fr] overflow-hidden rounded-[8px] border border-[#ead8bf] bg-[#fff8ed] transition hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(91,58,29,0.10)] dark:border-white/10 dark:bg-[#2a2825]"
            >
              <div className="relative min-h-[140px] overflow-hidden">
                <Image
                  src={relatedPost.heroImage}
                  alt={relatedPost.heroImageAlt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  sizes="120px"
                />
              </div>
              <div className="p-4">
                <p className="text-[11px] font-extrabold tracking-[0.12em] text-[#a86d1e] uppercase">
                  {relatedPost.category}
                </p>
                <h3 className="mt-2 line-clamp-2 font-display text-lg leading-tight font-extrabold text-[var(--foreground)]">
                  {relatedPost.title}
                </h3>
                <p className="mt-2 text-xs font-semibold text-[var(--foreground-muted)]">
                  {relatedPost.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
